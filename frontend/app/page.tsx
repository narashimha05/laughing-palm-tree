"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Heart, Wind, BarChart3, Waves, Stars } from "lucide-react"
import { useState, useEffect } from "react"

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  
  // Animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-cyan-50 to-blue-50 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-teal-200 mix-blend-multiply opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-200 mix-blend-multiply opacity-20 blur-3xl" style={{animationDuration: '15s', animationName: 'pulse', animationIterationCount: 'infinite'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-cyan-200 mix-blend-multiply opacity-20 blur-3xl animate-pulse" style={{animationDuration: '12s'}}></div>
      </div>

      <main className="container mx-auto px-4 py-24 relative z-10">
        <div className={`mb-16 text-center transition-all duration-700 ${scrolled ? 'opacity-80 scale-95' : 'opacity-100'}`}>
          <div className="inline-block mb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 mx-auto flex items-center justify-center shadow-lg">
              <Waves className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6">Serenity</h1>
          <p className="text-xl text-teal-600 max-w-2xl mx-auto leading-relaxed font-light">
            Your personal AI stress companion, here to help you find calm in the chaos of everyday life.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {/* <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-6 rounded-xl text-lg shadow-md hover:shadow-xl transition-all duration-300">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button> */}
            <Link href="/about">
            <Button variant="outline" className="cursor-pointer border-teal-400 text-teal-600 hover:bg-teal-50 hover:text-slate-500 px-8 py-6 rounded-xl text-lg">
              Learn More
            </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Heart className="h-8 w-8 text-white" />,
              title: "Companion",
              description: "Have a meaningful conversation with your AI companion. Share your thoughts, feelings, and concerns in a safe space.",
              cta: "Start a Conversation",
              href: "/companion",
              gradient: "from-pink-400 to-rose-500",
              delay: "0ms"
            },
            {
              icon: <Wind className="h-8 w-8 text-white" />,
              title: "Quick Relief",
              description: "Need immediate stress relief? Access quick techniques and exercises to help you calm down in moments of anxiety.",
              cta: "Find Relief Now",
              href: "/quick-relief",
              gradient: "from-teal-400 to-cyan-500",
              delay: "150ms"
            },
            {
              icon: <BarChart3 className="h-8 w-8 text-white" />,
              title: "Analytics",
              description: "Track your progress and gain insights from your sessions. Visualize your mood trends and usage patterns over time.",
              cta: "View Dashboard",
              href: "/analytics",
              gradient: "from-violet-400 to-indigo-500",
              delay: "300ms"
            }
          ].map((feature, index) => (
            <Card key={index} className="p-8 hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm rounded-2xl border-0 group" style={{transitionDelay: feature.delay, animationDelay: feature.delay}}>
              <div className="flex flex-col items-center text-center h-full ">
                <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300 `}>
                  {feature.icon}
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{feature.title}</h2>
                <p className="text-gray-600 mb-8 flex-grow">
                  {feature.description}
                </p>
                <Link href={feature.href} className="w-full">
                  <Button className={`w-full bg-gradient-to-r ${feature.gradient} hover:shadow-lg text-white rounded-xl py-6`}>
                    {feature.cta}
                    <ArrowRight className="ml-2 h-4 w-4 animate-bounce-x" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-24 text-center relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent"></div>
          <div className="py-12">
            <Stars className="h-8 w-8 text-teal-500 mx-auto mb-4" />
            <p className="text-xl text-teal-600 font-light italic">
            &quot;Remember, you&quot;re not alone. We&quot;re here to support you on your journey to better mental wellbeing.&quot;
            </p>
            <div className="mt-8 flex gap-4 justify-center">
              <span className="inline-block h-2 w-2 rounded-full bg-teal-300"></span>
              <span className="inline-block h-2 w-2 rounded-full bg-cyan-300"></span>
              <span className="inline-block h-2 w-2 rounded-full bg-blue-300"></span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}