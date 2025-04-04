import { Card } from "@/components/ui/card"
import { Heart, Shield, Sparkles } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-teal-800 mb-8 text-center">About Serenity</h1>

        <div className="max-w-3xl mx-auto">
          <Card className="p-8 bg-white mb-8">
            <h2 className="text-2xl font-semibold text-teal-800 mb-4">Our Mission</h2>
            <p className="text-teal-600 mb-6">
              Serenity was created with a simple but powerful mission: to provide accessible, immediate support for
              those experiencing stress and anxiety. We believe that everyone deserves tools to help manage their mental
              wellbeing, available whenever and wherever they need them.
            </p>
            <p className="text-teal-600">
              Our AI companion and quick relief techniques are designed to complement professional mental health care,
              offering in-the-moment support when you need it most.
            </p>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-teal-800 mb-2">Compassionate</h3>
                <p className="text-teal-600">
                  We approach every interaction with empathy and understanding, creating a safe space for you to express
                  yourself.
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-teal-800 mb-2">Private</h3>
                <p className="text-teal-600">
                  Your privacy matters. We prioritize the security and confidentiality of all your interactions with our
                  platform.
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-teal-800 mb-2">Innovative</h3>
                <p className="text-teal-600">
                  We continuously improve our AI and techniques based on the latest research in mental health and
                  wellbeing.
                </p>
              </div>
            </Card>
          </div>

          <Card className="p-8 bg-white">
            <h2 className="text-2xl font-semibold text-teal-800 mb-4">Important Disclaimer</h2>
            <p className="text-teal-600 mb-4">
              Serenity is designed to provide support for everyday stress and mild anxiety. It is not a replacement for
              professional mental health care.
            </p>
            <p className="text-teal-600 mb-4">
              If you are experiencing severe distress, thoughts of harming yourself or others, or any mental health
              crisis, please contact a mental health professional, call a crisis hotline, or go to your nearest
              emergency room immediately.
            </p>
            <p className="text-teal-600 font-medium">
              Remember: It&apos;s okay to ask for help, and professional support is available.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

