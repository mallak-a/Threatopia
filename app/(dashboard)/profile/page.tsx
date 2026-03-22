"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Target, 
  Shield, 
  Edit2,
  Camera,
  Save,
  Flag,
  Award,
  TrendingUp
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useAuthStore } from "@/lib/stores/auth-store"

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: "Cybersecurity enthusiast passionate about CTF challenges and ethical hacking.",
  })

  const stats = {
    totalPoints: user?.totalPoints || 0,
    challengesCompleted: user?.challengesCompleted || 0,
    rank: user?.rank || "Novice",
    joinDate: "January 2024",
    streak: 7,
    badges: ["First Blood", "Week Warrior", "SQL Master", "Crypto Ninja"],
  }

  const recentActivity = [
    { challenge: "SQL Injection 101", points: 100, date: "2 hours ago", status: "completed" },
    { challenge: "XSS Advanced", points: 200, date: "Yesterday", status: "completed" },
    { challenge: "Buffer Overflow", points: 300, date: "2 days ago", status: "in-progress" },
    { challenge: "JWT Vulnerabilities", points: 150, date: "3 days ago", status: "completed" },
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Would call API to update profile
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and view your progress
          </p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="gap-2"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:row-span-2">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user?.username?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <h2 className="mt-4 text-xl font-bold text-foreground">{user?.username}</h2>
              <Badge className="mt-2" variant="secondary">{stats.rank}</Badge>
              
              <p className="mt-4 text-sm text-muted-foreground">
                {formData.bio}
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Joined {stats.joinDate}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Trophy className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
                <p className="text-2xl font-bold text-foreground">{stats.totalPoints.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Points</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Target className="h-5 w-5 mx-auto text-green-500 mb-1" />
                <p className="text-2xl font-bold text-foreground">{stats.challengesCompleted}</p>
                <p className="text-xs text-muted-foreground">Challenges</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <TrendingUp className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-2xl font-bold text-foreground">{stats.streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Award className="h-5 w-5 mx-auto text-purple-500 mb-1" />
                <p className="text-2xl font-bold text-foreground">{stats.badges.length}</p>
                <p className="text-xs text-muted-foreground">Badges</p>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-foreground mb-3">Earned Badges</h3>
              <div className="flex flex-wrap gap-2">
                {stats.badges.map((badge) => (
                  <Badge key={badge} variant="outline" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Progress Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Rank Progress</CardTitle>
                  <CardDescription>Your journey to the next rank</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current: {stats.rank}</span>
                      <span className="text-muted-foreground">Next: Advanced</span>
                    </div>
                    <Progress value={65} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      1,750 / 2,500 points to next rank
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills Breakdown</CardTitle>
                  <CardDescription>Your expertise across categories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { skill: "Web Exploitation", level: 75, color: "bg-primary" },
                    { skill: "Cryptography", level: 45, color: "bg-accent" },
                    { skill: "Forensics", level: 60, color: "bg-green-500" },
                    { skill: "Reverse Engineering", level: 30, color: "bg-purple-500" },
                    { skill: "Network Security", level: 55, color: "bg-orange-500" },
                  ].map((item) => (
                    <div key={item.skill} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">{item.skill}</span>
                        <span className="text-muted-foreground">{item.level}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${item.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.level}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest challenge attempts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                      >
                        <div className={`p-2 rounded-lg ${
                          activity.status === "completed" ? "bg-green-500/20" : "bg-yellow-500/20"
                        }`}>
                          <Flag className={`h-4 w-4 ${
                            activity.status === "completed" ? "text-green-500" : "text-yellow-500"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{activity.challenge}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                            {activity.status === "completed" ? `+${activity.points}` : "In Progress"}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Update your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your password regularly</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
