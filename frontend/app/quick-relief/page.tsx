"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TreesIcon as Lungs, Brain, Activity, Music, PlayCircle, PauseCircle, RotateCcw } from "lucide-react"

export default function QuickReliefPage() {
  const [breathCount, setBreathCount] = useState(0)
  const [isBreathingActive, setIsBreathingActive] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [breathingProgress, setBreathingProgress] = useState(0)

  const startBreathingExercise = () => {
    setIsBreathingActive(true)
    setBreathCount(0)
    setBreathingPhase("inhale")
    setBreathingProgress(0)

    const breathingCycle = () => {
      // Inhale for 4 seconds
      setBreathingPhase("inhale")
      let progress = 0
      const inhaleInterval = setInterval(() => {
        progress += 1
        setBreathingProgress(progress * 25) // 0-100 over 4 seconds
        if (progress >= 4) {
          clearInterval(inhaleInterval)

          // Hold for 4 seconds
          setBreathingPhase("hold")
          progress = 0
          const holdInterval = setInterval(() => {
            progress += 1
            setBreathingProgress(progress * 25) // 0-100 over 4 seconds
            if (progress >= 4) {
              clearInterval(holdInterval)

              // Exhale for 4 seconds
              setBreathingPhase("exhale")
              progress = 0
              const exhaleInterval = setInterval(() => {
                progress += 1
                setBreathingProgress(progress * 25) // 0-100 over 4 seconds
                if (progress >= 4) {
                  clearInterval(exhaleInterval)
                  setBreathCount((prev) => prev + 1)

                  // Continue the cycle if still active
                  if (isBreathingActive) {
                    breathingCycle()
                  }
                }
              }, 1000)
            }
          }, 1000)
        }
      }, 1000)
    }

    breathingCycle()
  }

  const stopBreathingExercise = () => {
    setIsBreathingActive(false)
  }

  const resetBreathingExercise = () => {
    setIsBreathingActive(false)
    setBreathCount(0)
    setBreathingPhase("inhale")
    setBreathingProgress(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-teal-800 mb-8 text-center">Quick Stress Relief</h1>

        <Tabs defaultValue="breathing" className="max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="breathing" className="flex flex-col items-center py-3">
              <Lungs className="h-5 w-5 mb-1" />
              <span>Breathing</span>
            </TabsTrigger>
            <TabsTrigger value="grounding" className="flex flex-col items-center py-3">
              <Brain className="h-5 w-5 mb-1" />
              <span>Grounding</span>
            </TabsTrigger>
            <TabsTrigger value="movement" className="flex flex-col items-center py-3">
              <Activity className="h-5 w-5 mb-1" />
              <span>Movement</span>
            </TabsTrigger>
            <TabsTrigger value="sounds" className="flex flex-col items-center py-3">
              <Music className="h-5 w-5 mb-1" />
              <span>Sounds</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breathing">
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-semibold text-teal-800 mb-4">4-4-4 Breathing</h2>
              <p className="mb-6 text-teal-600">
                This simple breathing technique can help calm your nervous system and reduce stress quickly.
              </p>

              <div className="mb-8 text-center">
                <div className="mb-4">
                  <div className="text-4xl font-bold text-teal-600 mb-2">
                    {breathingPhase === "inhale" ? "Inhale" : breathingPhase === "hold" ? "Hold" : "Exhale"}
                  </div>
                  <div className="h-4 w-full bg-teal-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 transition-all duration-300"
                      style={{ width: `${breathingProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-lg font-medium text-teal-700 mb-6">Breaths completed: {breathCount}</div>

                <div className="flex justify-center space-x-4">
                  {!isBreathingActive ? (
                    <Button onClick={startBreathingExercise} className="bg-teal-600 hover:bg-teal-700">
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Start
                    </Button>
                  ) : (
                    <Button onClick={stopBreathingExercise} variant="outline">
                      <PauseCircle className="mr-2 h-5 w-5" />
                      Pause
                    </Button>
                  )}

                  <Button onClick={resetBreathingExercise} variant="outline">
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="font-semibold text-teal-800 mb-2">Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2 text-teal-600">
                  <li>Inhale deeply through your nose for 4 seconds</li>
                  <li>Hold your breath for 4 seconds</li>
                  <li>Exhale completely through your mouth for 4 seconds</li>
                  <li>Repeat for at least 5 cycles</li>
                </ol>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="grounding">
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-semibold text-teal-800 mb-4">5-4-3-2-1 Grounding Technique</h2>
              <p className="mb-6 text-teal-600">
                This technique helps bring your attention to the present moment by engaging your five senses.
              </p>

              <div className="space-y-6">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">5 Things You Can See</h3>
                  <p className="text-teal-600">
                    Look around and name 5 things you can see right now. Focus on details and colors.
                  </p>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">4 Things You Can Touch</h3>
                  <p className="text-teal-600">
                    Notice 4 things you can physically feel (your clothes, the temperature, etc.).
                  </p>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">3 Things You Can Hear</h3>
                  <p className="text-teal-600">Listen for 3 sounds around you (traffic, birds, your breathing).</p>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">2 Things You Can Smell</h3>
                  <p className="text-teal-600">
                    Identify 2 scents you can smell right now or recall 2 favorite smells.
                  </p>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">1 Thing You Can Taste</h3>
                  <p className="text-teal-600">Notice 1 taste in your mouth or recall a favorite taste.</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="movement">
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-semibold text-teal-800 mb-4">Quick Movement Exercises</h2>
              <p className="mb-6 text-teal-600">
                These simple movements can help release tension and shift your focus away from stress.
              </p>

              <div className="space-y-6">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">Shoulder Rolls</h3>
                  <p className="text-teal-600 mb-2">
                    Roll your shoulders forward 5 times, then backward 5 times. Focus on the sensation.
                  </p>
                  <Button className="bg-teal-600 hover:bg-teal-700">Start 30-Second Timer</Button>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">Gentle Neck Stretches</h3>
                  <p className="text-teal-600 mb-2">
                    Slowly tilt your head to each shoulder, holding for 5 seconds each side.
                  </p>
                  <Button className="bg-teal-600 hover:bg-teal-700">Start 30-Second Timer</Button>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">Hand Clenching</h3>
                  <p className="text-teal-600 mb-2">
                    Clench your fists tightly for 5 seconds, then release and spread your fingers wide for 5 seconds.
                    Repeat 3 times.
                  </p>
                  <Button className="bg-teal-600 hover:bg-teal-700">Start 30-Second Timer</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sounds">
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-semibold text-teal-800 mb-4">Calming Sounds</h2>
              <p className="mb-6 text-teal-600">
                Listen to these soothing sounds to help calm your mind and reduce stress quickly.
              </p>

              <div className="space-y-6">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">Ocean Waves</h3>
                  <p className="text-teal-600 mb-2">
                    The rhythmic sound of ocean waves can help regulate breathing and induce calm.
                  </p>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Play Ocean Waves
                  </Button>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">Gentle Rain</h3>
                  <p className="text-teal-600 mb-2">
                    The soft patter of rainfall can be deeply relaxing and grounding.
                  </p>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Play Gentle Rain
                  </Button>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">Forest Sounds</h3>
                  <p className="text-teal-600 mb-2">
                    Birds, rustling leaves, and gentle breezes can transport you to a peaceful natural setting.
                  </p>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Play Forest Sounds
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

