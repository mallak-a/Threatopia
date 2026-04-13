"use client"

import { useState } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { Trophy, Medal, Award, Search, Crown, TrendingUp, Users, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/services/api"
import { useAuthStore } from "@/lib/stores/auth-store"
import type { LeaderboardEntry } from "@/lib/types"

const fetcher = async () => {
  const response = await api.leaderboard.getGlobal()
  return response.data ?? []
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-500" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />
    default:
      return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
  }
}

function getRankBg(rank: number) {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50"
    case 2:
      return "bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-400/50"
    case 3:
      return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/50"
    default:
      return "bg-card border-border"
  }
}

export default function LeaderboardPage() {
  const { user } = useAuthStore()
  const { data: leaderboard, isLoading } = useSWR("leaderboard", fetcher)
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState("all-time")

  const filteredLeaderboard = leaderboard?.filter((entry) =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentUserRank = leaderboard?.findIndex((e) => e.userId === user?.id)
  const currentUserEntry = currentUserRank !== undefined && currentUserRank >= 0 ? leaderboard?.[currentUserRank] : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">
          Compete with security professionals worldwide
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Rank</p>
                <p className="text-2xl font-bold text-foreground">
                  {currentUserRank !== undefined && currentUserRank >= 0 ? `#${currentUserRank + 1}` : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Points</p>
                <p className="text-2xl font-bold text-foreground">
                  {currentUserEntry?.points.toLocaleString() ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Challenges Done</p>
                <p className="text-2xl font-bold text-foreground">
                  {currentUserEntry?.level ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Players</p>
                <p className="text-2xl font-bold text-foreground">
                  {leaderboard?.length.toLocaleString() ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-time">All Time</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="today">Today</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="global" className="space-y-4">
        <TabsList>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="country">By Country</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-4">
          {/* Top 3 Podium */}
          {!isLoading && filteredLeaderboard && filteredLeaderboard.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Second Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="order-2 md:order-1"
              >
                <Card className={`${getRankBg(2)} border-2 h-full`}>
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <Medal className="h-12 w-12 text-gray-400" />
                    </div>
                    <Avatar className="h-16 w-16 mx-auto mb-3 ring-4 ring-gray-400/50">
                      <AvatarImage src={filteredLeaderboard[1].avatar} />
                      <AvatarFallback>{filteredLeaderboard[1].name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg text-foreground">{filteredLeaderboard[1].name}</h3>
                    <Badge variant="secondary" className="mt-2">Level {filteredLeaderboard[1].level}</Badge>
                    <p className="text-2xl font-bold text-primary mt-3">
                      {filteredLeaderboard[1].points.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* First Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="order-1 md:order-2"
              >
                <Card className={`${getRankBg(1)} border-2 h-full`}>
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <Crown className="h-16 w-16 text-yellow-500" />
                    </div>
                    <Avatar className="h-20 w-20 mx-auto mb-3 ring-4 ring-yellow-500/50">
                      <AvatarImage src={filteredLeaderboard[0].avatar} />
                      <AvatarFallback>{filteredLeaderboard[0].name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-xl text-foreground">{filteredLeaderboard[0].name}</h3>
                    <Badge className="mt-2 bg-yellow-500/20 text-yellow-600 border-yellow-500/50">
                      Level {filteredLeaderboard[0].level}
                    </Badge>
                    <p className="text-3xl font-bold text-primary mt-3">
                      {filteredLeaderboard[0].points.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Third Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="order-3"
              >
                <Card className={`${getRankBg(3)} border-2 h-full`}>
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <Award className="h-12 w-12 text-amber-600" />
                    </div>
                    <Avatar className="h-16 w-16 mx-auto mb-3 ring-4 ring-amber-600/50">
                      <AvatarImage src={filteredLeaderboard[2].avatar} />
                      <AvatarFallback>{filteredLeaderboard[2].name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg text-foreground">{filteredLeaderboard[2].name}</h3>
                    <Badge variant="secondary" className="mt-2">Level {filteredLeaderboard[2].level}</Badge>
                    <p className="text-2xl font-bold text-primary mt-3">
                      {filteredLeaderboard[2].points.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Full Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle>Rankings</CardTitle>
              <CardDescription>Complete leaderboard with all participants</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-muted" />
                      <div className="w-10 h-10 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted rounded" />
                      </div>
                      <div className="h-6 w-20 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredLeaderboard?.map((entry, index) => (
                    <motion.div
                      key={entry.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                        entry.userId === user?.id ? "bg-primary/5 border-primary/20" : "bg-card"
                      }`}
                    >
                      <div className="w-8 flex justify-center">
                        {getRankIcon(index + 1)}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback>{entry.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground truncate">
                            {entry.name}
                            {entry.userId === user?.id && (
                              <span className="text-xs text-primary ml-2">(You)</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">Rank #{entry.rank}</Badge>
                          <span>Level {entry.level}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary">
                          {entry.points.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="country">
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Country Rankings Coming Soon</h3>
              <p className="text-muted-foreground">
                Compare your skills with players from your country
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category">
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Category Rankings Coming Soon</h3>
              <p className="text-muted-foreground">
                See who excels in specific security domains
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
