"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, Loader2, Mic, MicOff, Moon, Sun, MessageCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp: string
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

interface GeminiResponse {
  text: string;
}

export default function CompanionPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello, I'm your stress companion. How are you feeling today? I'm here to listen and help you navigate your emotions.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [conversationHistory, setConversationHistory] = useState<Message[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDarkMode)

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

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

    const userMessage: Message = { 
      role: "user", 
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const updatedHistory = [...conversationHistory, userMessage];
    setConversationHistory(updatedHistory);

    try {
      const response = await fetchGeminiResponse(updatedHistory);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationHistory(prev => [...prev, assistantMessage]);
      
      if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(response);
        
        const voices = window.speechSynthesis.getVoices();
        
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
        
        speech.rate = 0.9;  
        speech.pitch = 1.1;
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

  const quotes = [
    "Breathe in peace, breathe out stress.",
    "Small steps still move you forward.",
    "You are stronger than you think.",
    "It's okay not to be okay sometimes.",
    "Progress isn't always visible, but it's happening."
  ];

  const tips = [
    "Try 4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8.",
    "Take a 5-minute break to stretch.",
    "Write down three things you're grateful for.",
    "Stay hydrated throughout the day.",
    "Connect with someone you trust today."
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-b from-blue-50 to-purple-50'}`}>
      <div className="container mx-auto p-4 flex flex-col lg:flex-row">
      
        <div className="lg:hidden flex justify-between items-center mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-purple-600 dark:text-purple-300">Tranquil Mind</h1>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={toggleDarkMode}
              variant="ghost" 
              size="sm"
              className="rounded-full"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Button 
              onClick={toggleMobileMenu}
              variant="ghost" 
              size="sm"
              className="rounded-full"
              aria-label="Toggle menu"
            >
              <MessageCircle size={20} />
            </Button>
          </div>
        </div>

        <div className={`lg:block ${isMobileMenuOpen ? 'block' : 'hidden'} lg:w-1/4 mb-4 lg:mb-0 lg:mr-4`}>
          <Card className="h-full bg-white dark:bg-gray-800 shadow-lg overflow-hidden border-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-300">Tranquil Mind</h1>
                <Button 
                  onClick={toggleDarkMode}
                  variant="ghost" 
                  size="sm"
                  className="rounded-full"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-purple-600 dark:text-purple-300 mb-3">Daily Affirmation</h2>
                  <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg italic text-gray-700 dark:text-gray-200">
                    &quot;{quotes[Math.floor(Math.random() * quotes.length)]}&quot;
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-3">Wellness Tip</h2>
                  <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg text-gray-700 dark:text-gray-200">
                    {tips[Math.floor(Math.random() * tips.length)]}
                  </div>
                </div>
                
                <div className="pt-4">
                  <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">How It Works</h2>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 h-5 w-5 text-xs mr-2 mt-0.5">1</span>
                      <span>Type or speak how you&apos;re feeling</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 h-5 w-5 text-xs mr-2 mt-0.5">2</span>
                      <span>Get supportive, caring responses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 h-5 w-5 text-xs mr-2 mt-0.5">3</span>
                      <span>Build mindfulness through conversation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="flex-1">
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-0 overflow-hidden">
            <div className="p-6">
              <div className="mb-6 hidden lg:block">
                <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">Your Safe Space</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Share your thoughts freely. I&apos;m here to listen.</p>
              </div>

           
              <div className="h-[500px] lg:h-[600px] overflow-y-auto mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg relative border border-gray-100 dark:border-gray-700">
                {messages.map((message, index) => (
                  <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                    <div className="flex items-end gap-2 mb-1 text-xs text-gray-500 dark:text-gray-400">
                      {message.role === "user" ? (
                        <>
                          <span className="ml-auto">{message.timestamp}</span>
                          <span className="font-medium">You</span>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">Tranquil Mind</span>
                          <span>{message.timestamp}</span>
                        </>
                      )}
                    </div>
                    <div
                      className={`inline-block p-4 rounded-2xl text-base max-w-[80%] shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="text-left mb-4">
                    <div className="inline-block p-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin text-purple-500 dark:text-purple-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Share how you're feeling..."
                  className="resize-none rounded-2xl pl-4 pr-16 py-4 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 focus:border-purple-300 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-800 focus:ring-opacity-50 shadow-sm"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                
                <div className="absolute right-3 bottom-3 flex space-x-2">
                  <Button
                    onClick={toggleRecording}
                    className={`rounded-full h-10 w-10 flex items-center justify-center ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                    }`}
                    aria-label={isRecording ? "Stop recording" : "Start recording"}
                    size="sm"
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="rounded-full h-10 w-10 flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    size="sm"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {isRecording && (
                <div className="mt-4 text-center text-red-500 dark:text-red-400 animate-pulse flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-ping"></div>
                  Listening... Speak now
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}