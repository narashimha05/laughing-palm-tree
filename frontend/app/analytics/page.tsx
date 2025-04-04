"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, Download, Activity, Clock, Brain, Mic, TrendingUp, Heart, Smile, Frown, Meh } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"

// Mock data for the charts
const dailyMoodData = [
  { date: "Apr 1", score: 6.2, speechMinutes: 4.5 },
  { date: "Apr 2", score: 5.8, speechMinutes: 3.2 },
  { date: "Apr 3", score: 7.3, speechMinutes: 5.8 },
  { date: "Apr 4", score: 6.5, speechMinutes: 2.3 },
  { date: "Apr 5", score: 8.2, speechMinutes: 7.5 },
  { date: "Apr 6", score: 7.8, speechMinutes: 4.2 },
  { date: "Apr 7", score: 8.5, speechMinutes: 6.8 },
  { date: "Apr 8", score: 7.9, speechMinutes: 5.5 },
  { date: "Apr 9", score: 7.2, speechMinutes: 4.8 },
  { date: "Apr 10", score: 8.0, speechMinutes: 6.2 },
  { date: "Apr 11", score: 7.5, speechMinutes: 5.1 },
  { date: "Apr 12", score: 8.3, speechMinutes: 7.2 },
  { date: "Apr 13", score: 8.7, speechMinutes: 8.5 },
  { date: "Apr 14", score: 8.4, speechMinutes: 6.9 },
]

const emotionRadarData = [
  { emotion: "Calm", user: 7, average: 5 },
  { emotion: "Happy", user: 6, average: 5 },
  { emotion: "Anxious", user: 4, average: 6 },
  { emotion: "Stressed", user: 3, average: 7 },
  { emotion: "Energetic", user: 8, average: 4 },
  { emotion: "Tired", user: 5, average: 6 },
]

const weekdayUsageData = [
  { day: "Monday", sessions: 5, minutes: 25 },
  { day: "Tuesday", sessions: 4, minutes: 18 },
  { day: "Wednesday", sessions: 6, minutes: 32 },
  { day: "Thursday", sessions: 3, minutes: 15 },
  { day: "Friday", sessions: 4, minutes: 22 },
  { day: "Saturday", sessions: 7, minutes: 38 },
  { day: "Sunday", sessions: 6, minutes: 30 },
]

const timeOfDayData = [
  { time: "Morning", sessions: 12, percentage: 28 },
  { time: "Afternoon", sessions: 15, percentage: 36 },
  { time: "Evening", sessions: 10, percentage: 24 },
  { time: "Night", sessions: 5, percentage: 12 },
]

const COLORS = ["#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4"]
const MOOD_COLORS = {
  great: "#0d9488",
  good: "#14b8a6",
  neutral: "#94a3b8",
  poor: "#f97316",
  bad: "#ef4444",
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("2weeks")

  // Calculate averages and totals
  const averageMood = (dailyMoodData.reduce((acc, day) => acc + day.score, 0) / dailyMoodData.length).toFixed(1)
  const totalSpeechMinutes = dailyMoodData.reduce((acc, day) => acc + day.speechMinutes, 0).toFixed(1)
  const totalSessions = dailyMoodData.length
  const speechTrend = (dailyMoodData[dailyMoodData.length - 1].speechMinutes / dailyMoodData[0].speechMinutes - 1) * 100
  const moodTrend = (dailyMoodData[dailyMoodData.length - 1].score / dailyMoodData[0].score - 1) * 100

  // Mood distribution
  const moodDistribution = [
    { name: "Great (8-10)", value: dailyMoodData.filter((d) => d.score >= 8).length, color: MOOD_COLORS.great },
    {
      name: "Good (7-8)",
      value: dailyMoodData.filter((d) => d.score >= 7 && d.score < 8).length,
      color: MOOD_COLORS.good,
    },
    {
      name: "Neutral (5-7)",
      value: dailyMoodData.filter((d) => d.score >= 5 && d.score < 7).length,
      color: MOOD_COLORS.neutral,
    },
    {
      name: "Poor (3-5)",
      value: dailyMoodData.filter((d) => d.score >= 3 && d.score < 5).length,
      color: MOOD_COLORS.poor,
    },
    { name: "Bad (0-3)", value: dailyMoodData.filter((d) => d.score < 3).length, color: MOOD_COLORS.bad },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-teal-700 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Wellness Journey</h1>
            <p className="text-teal-100">Insights and analytics from your stress companion sessions</p>
          </div>

          <div className="flex items-center gap-4">
            <Tabs defaultValue="2weeks" className="w-[240px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week" onClick={() => setTimeRange("week")}>
                  Week
                </TabsTrigger>
                <TabsTrigger value="2weeks" onClick={() => setTimeRange("2weeks")}>
                  2 Weeks
                </TabsTrigger>
                <TabsTrigger value="month" onClick={() => setTimeRange("month")}>
                  Month
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 border-0 text-white shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-teal-100">Average Mood</CardDescription>
                <Heart className="h-5 w-5 text-teal-200" />
              </div>
              <div className="flex items-end gap-2">
                <CardTitle className="text-4xl">{averageMood}</CardTitle>
                <span className="text-sm text-teal-200 mb-1">/10</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-teal-100 flex items-center">
                {moodTrend >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">{moodTrend.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1 text-red-400 transform rotate-180" />
                    <span className="text-red-400 font-medium">{Math.abs(moodTrend).toFixed(1)}%</span>
                  </>
                )}
                <span className="ml-1">since first session</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-0 text-white shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-teal-100">Total Speaking Time</CardDescription>
                <Mic className="h-5 w-5 text-teal-200" />
              </div>
              <div className="flex items-end gap-2">
                <CardTitle className="text-4xl">{totalSpeechMinutes}</CardTitle>
                <span className="text-sm text-teal-200 mb-1">minutes</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-teal-100 flex items-center">
                {speechTrend >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">{speechTrend.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1 text-red-400 transform rotate-180" />
                    <span className="text-red-400 font-medium">{Math.abs(speechTrend).toFixed(1)}%</span>
                  </>
                )}
                <span className="ml-1">since first session</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-0 text-white shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-teal-100">Total Sessions</CardDescription>
                <Activity className="h-5 w-5 text-teal-200" />
              </div>
              <CardTitle className="text-4xl">{totalSessions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-teal-100">
                <span className="text-emerald-400 font-medium">4.2</span> sessions per week on average
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-0 text-white shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-teal-100">Mood Distribution</CardDescription>
                <div className="flex space-x-1">
                  <Smile className="h-4 w-4 text-emerald-400" />
                  <Meh className="h-4 w-4 text-teal-200" />
                  <Frown className="h-4 w-4 text-orange-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {moodDistribution.map((mood, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="h-16 w-3 rounded-full"
                      style={{
                        backgroundColor: mood.color,
                        height: `${(mood.value / totalSessions) * 100}%`,
                        minHeight: "4px",
                        maxHeight: "60px",
                      }}
                    ></div>
                    <span className="text-xs mt-1 text-teal-100">{mood.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/10 border-0 text-white shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Mood & Speech Trends</CardTitle>
                  <CardDescription className="text-teal-100">
                    Track your emotional wellbeing and expression
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyMoodData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="date"
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 10]}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, "dataMax + 2"]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length && payload[0].value !== undefined && payload[1]?.value !== undefined) {
                          return (
                            <div className="bg-teal-900 p-3 border border-teal-700 shadow-lg rounded-lg">
                              <div className="text-sm text-white font-medium mb-1">{payload[0].payload.date}</div>
                              <div className="text-sm text-teal-200">
                                Mood: <span className="text-white font-medium">{payload[0].value}/10</span>
                              </div>
                              <div className="text-sm text-teal-200">
                                Speech: <span className="text-white font-medium">{payload[1].value} min</span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="score"
                      stroke="#5eead4"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#0d9488", strokeWidth: 2, stroke: "#5eead4" }}
                      activeDot={{ r: 6, fill: "#0d9488", strokeWidth: 2, stroke: "#5eead4" }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="speechMinutes"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3, fill: "#64748b", strokeWidth: 2, stroke: "#94a3b8" }}
                      activeDot={{ r: 5, fill: "#64748b", strokeWidth: 2, stroke: "#94a3b8" }}
                    />
                    <Legend
                      formatter={(value) => (
                        <span className="text-teal-100">{value === "score" ? "Mood Score" : "Speech Minutes"}</span>
                      )}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-0 text-white shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Emotional Profile</CardTitle>
                  <CardDescription className="text-teal-100">Your emotional state compared to average</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={emotionRadarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="emotion" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 10]}
                      tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 10 }}
                    />
                    <Radar name="You" dataKey="user" stroke="#5eead4" fill="#5eead4" fillOpacity={0.6} />
                    <Radar name="Average User" dataKey="average" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                    <Legend formatter={(value) => <span className="text-teal-100">{value}</span>} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-teal-900 p-3 border border-teal-700 shadow-lg rounded-lg">
                              <div className="text-sm text-white font-medium mb-1">{payload[0].payload.emotion}</div>
                              <div className="text-sm text-teal-200">
                                You: <span className="text-white font-medium">{payload[0].value}/10</span>
                              </div>
                              <div className="text-sm text-teal-200">
                                Average: <span className="text-white font-medium">{payload[1].value}/10</span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/10 border-0 text-white shadow-xl">
            <CardHeader>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-teal-200" />
                <div>
                  <CardTitle className="text-xl">Weekly Usage Pattern</CardTitle>
                  <CardDescription className="text-teal-100">When you use the app most during the week</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekdayUsageData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="day"
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-teal-900 p-3 border border-teal-700 shadow-lg rounded-lg">
                              <div className="text-sm text-white font-medium mb-1">{payload[0].payload.day}</div>
                              <div className="text-sm text-teal-200">
                                Sessions: <span className="text-white font-medium">{payload[0].payload.sessions}</span>
                              </div>
                              <div className="text-sm text-teal-200">
                                Total time:{" "}
                                <span className="text-white font-medium">{payload[0].payload.minutes} min</span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="sessions" fill="#5eead4" radius={[4, 4, 0, 0]}>
                      {weekdayUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`rgba(94, 234, 212, ${0.5 + entry.sessions / 10})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-0 text-white shadow-xl">
            <CardHeader>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-teal-200" />
                <div>
                  <CardTitle className="text-xl">Time of Day Usage</CardTitle>
                  <CardDescription className="text-teal-100">When you typically engage with the app</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeOfDayData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="percentage"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: "rgba(255,255,255,0.3)", strokeWidth: 1 }}
                    >
                      {timeOfDayData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-teal-900 p-3 border border-teal-700 shadow-lg rounded-lg">
                              <div className="text-sm text-white font-medium mb-1">{payload[0].name}</div>
                              <div className="text-sm text-teal-200">
                                Sessions: <span className="text-white font-medium">{payload[0].payload.sessions}</span>
                              </div>
                              <div className="text-sm text-teal-200">
                                Percentage: <span className="text-white font-medium">{payload[0].value}%</span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card className="bg-white/10 border-0 text-white shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-xl">AI-Generated Insights</CardTitle>
            <CardDescription className="text-teal-100">Personalized observations based on your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-teal-800/50 rounded-lg border border-teal-700/50">
                <h3 className="font-medium text-teal-100 mb-2 flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-emerald-400" />
                  Mood Improvement
                </h3>
                <p className="text-white/90">
                  Your mood has been steadily improving over the past two weeks, with a notable 18% increase. The most
                  significant improvements occur after weekend sessions, suggesting that weekend relaxation combined
                  with the app provides the best results.
                </p>
              </div>

              <div className="p-4 bg-teal-800/50 rounded-lg border border-teal-700/50">
                <h3 className="font-medium text-teal-100 mb-2 flex items-center">
                  <Mic className="mr-2 h-4 w-4 text-emerald-400" />
                  Speech Patterns
                </h3>
                <p className="text-white/90">
                  You tend to be most verbally expressive on Saturdays (8.5 minutes on average), which correlates with
                  your highest mood scores. There&apos;s a strong positive correlation (0.78) between your speaking time and
                  mood improvement, suggesting that expressing yourself more leads to better emotional outcomes.
                </p>
              </div>

              <div className="p-4 bg-teal-800/50 rounded-lg border border-teal-700/50">
                <h3 className="font-medium text-teal-100 mb-2 flex items-center">
                  <Brain className="mr-2 h-4 w-4 text-emerald-400" />
                  Emotional Profile
                </h3>
                <p className="text-white/90">
                  Your emotional profile shows higher levels of calm and energy compared to the average user, while
                  experiencing lower levels of stress and anxiety. This positive balance suggests that your coping
                  strategies are working effectively. Consider leveraging your natural energy to further reduce stress
                  during challenging periods.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

