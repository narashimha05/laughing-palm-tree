"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, Loader2, Mic, MicOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Message = {
  role: "user" | "assistant"
  content: string
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
    SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance
  }
  let SpeechRecognition: {
    new (): SpeechRecognition
  }
  
  let webkitSpeechRecognition: {
    new (): SpeechRecognition
  }

  interface SpeechRecognitionEvent {
    results: {
      [index: number]: {
        [index: number]: {
          transcript: string
        }
      }
    }
  }
}

interface SpeechRecognition {
  onend: (() => void) | null
  onresult: ((event: SpeechRecognitionEvent) => void) | null 
  start: () => void
  stop: () => void
  continuous: boolean 
  interimResults: boolean
  lang: string 
  onerror: ((event: { error: string }) => void) | null 
}

// Define the Gemini API response type
interface GeminiResponse {
  text: string;
}

export default function CompanionPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello, I'm your stress companion. How are you feeling today? I'm here to listen and help you navigate your emotions.",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [conversationHistory, setConversationHistory] = useState<Message[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognitionInstance = new SpeechRecognition()

        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = "en-US"

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          setTimeout(() => {
            handleSendMessage(transcript)
          }, 500)
        }

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error", event.error)
          setIsRecording(false)
          toast({
            title: "Speech Recognition Error",
            description: `Error: ${event.error}. Please try again.`,
            variant: "destructive",
          })
        }

        recognitionInstance.onend = () => {
          setIsRecording(false)
        }

        setRecognition(recognitionInstance)
      } else {
        toast({
          title: "Not Supported",
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive",
        })
      }
    }
  }, [toast])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleRecording = () => {
    if (!recognition) return

    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
    } else {
      setIsRecording(true)
      recognition.start()
      toast({
        title: "Listening...",
        description: "Speak now. I'm listening to you.",
      })
    }
  }

  const fetchGeminiResponse = async (messages: Message[]): Promise<string> => {
    try {
      // Format conversation history for Gemini
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: formattedMessages,
          systemPrompt: "You are a caring and empathetic stress companion. Respond in a conversational, friendly tone as if you're a close friend who listens and cares deeply. Keep responses relatively brief (1-3 sentences) but warm, supportive and helpful. Ask follow-up questions occasionally to show your engagement. Use simple language and avoid clinical terms. Focus on creating a safe space for the person to express their feelings."
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error fetching from Gemini API:', error);
      return "I'm here to listen. Would you like to share more about how you're feeling?";
    }
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Update conversation history
    const updatedHistory = [...conversationHistory, userMessage];
    setConversationHistory(updatedHistory);

    try {
      // Call Gemini API
      const response = await fetchGeminiResponse(updatedHistory);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationHistory(prev => [...prev, assistantMessage]);
      
      // Text-to-speech with female voice
      if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(response);
        
        // Get available voices
        const voices = window.speechSynthesis.getVoices();
        
        // Try to find a female voice
        const femaleVoice = voices.find(voice => 
          voice.name.includes('female') || 
          voice.name.includes('woman') ||
          voice.name.includes('girl') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('victoria')
        );
        
        if (femaleVoice) {
          speech.voice = femaleVoice;
        }
        
        // Set voice properties for a sweet, soothing tone
        speech.rate = 0.9;  // Slightly slower for soothing effect
        speech.pitch = 1.2; // Slightly higher pitch for female voice
        speech.volume = 1;
        
        window.speechSynthesis.speak(speech);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-teal-800 dark:text-teal-200 mb-6">Your Stress Companion</h1>

            <div className="h-[400px] overflow-y-auto mb-6 p-4 bg-teal-50 dark:bg-gray-900 rounded-lg relative">
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-teal-600 text-white dark:bg-teal-700"
                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-left mb-4">
                  <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Microphone Button */}
            <div className="flex justify-center mb-6">
              <Button
                onClick={toggleRecording}
                className={`rounded-full h-16 w-16 flex items-center justify-center ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    : "bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800"
                }`}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </Button>
            </div>

            <div className="flex space-x-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share how you're feeling or click the mic button to speak..."
                className="resize-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Speech recognition status */}
            {isRecording && (
              <div className="mt-4 text-center text-red-500 dark:text-red-400 animate-pulse">
                Listening... Speak now
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}