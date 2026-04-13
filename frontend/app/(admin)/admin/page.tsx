"use client"

import useSWR from "swr"
import { motion } from "framer-motion"
import { 
  Users, 
  Flag, 
  Trophy, 
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/services/api"

const statsCards = [
  {
    title: "Total Users",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Active Challenges",
    icon: Flag,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Submissions Today",
    icon: Trophy,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Success Rate",
    icon: TrendingUp,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
]

export default function AdminDashboardPage() {
  const { data: challenges } = useSWR("admin-challenges", () => api.challenges.getAll())
  const { data: leaderboard } = useSWR("admin-leaderboard", () => api.leaderboard.getGlobal())

  const stats = [
    { value: leaderboard?.length || 0, suffix: "" },
    { value: challenges?.length || 0, suffix: "" },
    { value: 156, suffix: "" },
    { value: 67.8, suffix: "%" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage the Threatopia platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {stats[index].value.toLocaleString()}{stats[index].suffix}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { type: "success", message: "CyberNinja solved SQL Injection 101", time: "2 min ago" },
              { type: "warning", message: "Failed login attempt for user@example.com", time: "5 min ago" },
              { type: "success", message: "New user registered: SecureHacker42", time: "12 min ago" },
              { type: "info", message: "Challenge 'Buffer Overflow Advanced' updated", time: "25 min ago" },
              { type: "success", message: "DataDefender reached Elite rank", time: "1 hour ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`p-1 rounded-full ${
                  activity.type === "success" ? "bg-green-500/20" :
                  activity.type === "warning" ? "bg-yellow-500/20" :
                  "bg-primary/20"
                }`}>
                  {activity.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : activity.type === "warning" ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Activity className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Challenge Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-accent" />
              Challenge Statistics
            </CardTitle>
            <CardDescription>Breakdown by category and difficulty</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* By Category */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">By Category</h4>
              <div className="space-y-2">
                {[
                  { category: "Web Exploitation", count: 12, percentage: 30 },
                  { category: "Cryptography", count: 8, percentage: 20 },
                  { category: "Forensics", count: 10, percentage: 25 },
                  { category: "Reverse Engineering", count: 6, percentage: 15 },
                  { category: "Network Security", count: 4, percentage: 10 },
                ].map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.category}</span>
                      <span className="font-medium text-foreground">{item.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Difficulty */}
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">By Difficulty</h4>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">
                  Easy: 15
                </Badge>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50">
                  Medium: 18
                </Badge>
                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/50">
                  Hard: 10
                </Badge>
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/50">
                  Expert: 5
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Performers
            </CardTitle>
            <CardDescription>This month&apos;s leaders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard?.slice(0, 5).map((user, index) => (
                <div key={user.userId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? "bg-yellow-500/20 text-yellow-500" :
                    index === 1 ? "bg-gray-400/20 text-gray-400" :
                    index === 2 ? "bg-amber-600/20 text-amber-600" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.challengesCompleted} challenges</p>
                  </div>
                  <p className="font-bold text-primary">{user.totalPoints.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              System Health
            </CardTitle>
            <CardDescription>Platform status and metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { service: "API Server", status: "Operational", uptime: "99.9%" },
              { service: "Database", status: "Operational", uptime: "99.8%" },
              { service: "Challenge Engine", status: "Operational", uptime: "99.7%" },
              { service: "Flag Validator", status: "Operational", uptime: "100%" },
            ].map((service) => (
              <div key={service.service} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium text-foreground">{service.service}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">
                    {service.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{service.uptime}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
