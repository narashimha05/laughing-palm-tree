import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Heart, Wind, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100">
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-teal-800 mb-4">Serenity</h1>
          <p className="text-lg text-teal-600 max-w-2xl mx-auto">
            Your personal AI stress companion, here to help you find calm in the chaos of everyday life.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
            <div className="flex flex-col items-center text-center h-full">
              <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-semibold text-teal-800 mb-4">Companion</h2>
              <p className="text-teal-600 mb-6 flex-grow">
                Have a meaningful conversation with your AI companion. Share your thoughts, feelings, and concerns in a
                safe space.
              </p>
              <Link href="/companion" className="w-full">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Start a Conversation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
            <div className="flex flex-col items-center text-center h-full">
              <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                <Wind className="h-8 w-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-semibold text-teal-800 mb-4">Quick Relief</h2>
              <p className="text-teal-600 mb-6 flex-grow">
                Need immediate stress relief? Access quick techniques and exercises to help you calm down in moments of
                anxiety.
              </p>
              <Link href="/quick-relief" className="w-full">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Find Relief Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
            <div className="flex flex-col items-center text-center h-full">
              <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-semibold text-teal-800 mb-4">Analytics</h2>
              <p className="text-teal-600 mb-6 flex-grow">
                Track your progress and gain insights from your sessions. Visualize your mood trends and usage patterns
                over time.
              </p>
              <Link href="/dashboard" className="w-full">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-teal-600">
            Remember, you&#39;re not alone. We&#39;re here to support you on your journey to better mental wellbeing.
          </p>
        </div>
      </main>
    </div>
  )
}

