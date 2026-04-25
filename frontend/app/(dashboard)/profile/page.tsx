"use client"

import { useEffect, useState } from "react"
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
  TrendingUp,
  Phone,
  Globe
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
import { getAuthHeaders, updateContactInfo } from "@/lib/services/api"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTRIES } from "@/lib/constants/countries"
import type { User as UserType } from "@/lib/types"

const getPhonePart = (fullPhone?: string, countryName?: string) => {
  if (!fullPhone) return ""
  const countryObj = COUNTRIES.find(c => c.name === countryName)
  if (countryObj && fullPhone.startsWith(countryObj.dialCode + ' ')) {
    return fullPhone.substring(countryObj.dialCode.length + 1)
  }
  if (countryObj && fullPhone.startsWith(countryObj.dialCode)) {
    return fullPhone.substring(countryObj.dialCode.length).trim()
  }
  return fullPhone
}

export default function ProfilePage() {
  const authStore = useAuthStore()
  const { user, profile, updateUser, setPreviewAvatar, previewAvatar } = authStore
  const [isEditing, setIsEditing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [cropSourceUrl, setCropSourceUrl] = useState<string | null>(null)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: user?.name || "",
    email: user?.email || "",
    phonePart: getPhonePart(user?.phoneNumber, user?.country),
    country: user?.country || "",
    bio: "Cybersecurity enthusiast passionate about CTF challenges and ethical hacking.",
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  const BACKEND_BASE_URL = API_URL.replace(/\/api$/, '')

  const normalizeAvatarUrl = (url?: string) => {
    if (!url) return undefined
    if (url.startsWith('http')) return url
    const cleanUrl = url.startsWith('/') ? url : `/${url}`
    return `${BACKEND_BASE_URL}${cleanUrl}`
  }

  const displayAvatar = previewAvatar || normalizeAvatarUrl(user?.avatar)

  const stats = {
    totalPoints: profile?.points || 0,
    challengesCompleted: profile?.completedChallenges?.length || 0,
    rank: profile?.level ? `Level ${profile.level}` : "Novice",
    joinDate: "January 2024",
    streak: profile?.streakDays || 0,
    badges: profile?.badges || ["First Blood", "Week Warrior", "SQL Master", "Crypto Ninja"],
  }

  const recentActivity = [
    { challenge: "SQL Injection 101", points: 100, date: "2 hours ago", status: "completed" },
    { challenge: "XSS Advanced", points: 200, date: "Yesterday", status: "completed" },
    { challenge: "Buffer Overflow", points: 300, date: "2 days ago", status: "in-progress" },
    { challenge: "JWT Vulnerabilities", points: 150, date: "3 days ago", status: "completed" },
  ]

  // Container and crop constants
  const CONTAINER_W = 600
  const CONTAINER_H = 320
  const CROP_DIAMETER = 192

  // Calculate the drawn image dimensions (object-contain fit) for a given zoom
  const getDrawnSize = (imgW: number, imgH: number, z: number) => {
    if (imgW === 0 || imgH === 0) return { drawW: 0, drawH: 0 }
    const imgAspect = imgW / imgH
    const contAspect = CONTAINER_W / CONTAINER_H
    let drawW: number, drawH: number
    if (imgAspect > contAspect) {
      drawW = CONTAINER_W
      drawH = CONTAINER_W / imgAspect
    } else {
      drawH = CONTAINER_H
      drawW = CONTAINER_H * imgAspect
    }
    return { drawW: drawW * z, drawH: drawH * z }
  }

  // Compute minimum zoom so the image always covers the crop circle
  const getMinZoom = (imgW: number, imgH: number) => {
    if (imgW === 0 || imgH === 0) return 0.5
    const { drawW, drawH } = getDrawnSize(imgW, imgH, 1)
    const minZoomW = CROP_DIAMETER / drawW
    const minZoomH = CROP_DIAMETER / drawH
    return Math.max(minZoomW, minZoomH, 0.5)
  }

  // Clamp pan so the crop circle stays inside the image
  const clampPan = (pan: { x: number; y: number }, imgW: number, imgH: number, z: number) => {
    const { drawW, drawH } = getDrawnSize(imgW, imgH, z)
    const maxPanX = Math.max(0, (drawW - CROP_DIAMETER) / 2)
    const maxPanY = Math.max(0, (drawH - CROP_DIAMETER) / 2)
    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, pan.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, pan.y)),
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setCropSourceUrl(url)
    setRotation(0)
    setZoom(1)
    setPanPosition({ x: 0, y: 0 })
    setCropDialogOpen(true)
    setUploadMessage(null)

    // Load the image to get its natural dimensions
    const img = new Image()
    img.onload = () => {
      console.log('Image dimensions:', img.naturalWidth, img.naturalHeight)
      setImageSize({ w: img.naturalWidth, h: img.naturalHeight })
      // Default to zoom 1 (fitted to container)
      setZoom(1)
    }
    img.onerror = () => console.log('Image failed to load')

    img.src = url

    }
  }

  const cancelCrop = () => {
    setCropDialogOpen(false)
    setSelectedFile(null)
    setCropSourceUrl(null)
    setRotation(0)
    setZoom(1)
    setPanPosition({ x: 0, y: 0 })
    setImageSize({ w: 0, h: 0 })
    const fileInput = document.getElementById('profile-photo-input') as HTMLInputElement
    if (fileInput) fileInput.value = ''
    setPreviewAvatar(null)
  }

  const closeCropDialog = () => {
    setCropDialogOpen(false)
    setRotation(0)
    setZoom(1)
    setPanPosition({ x: 0, y: 0 })
    setImageSize({ w: 0, h: 0 })
    setCropSourceUrl(null)
  }

  const rotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360)
    // Re-clamp pan after rotation (effective image bounds may change)
    setPanPosition((prev) => clampPan(prev, imageSize.w, imageSize.h, zoom))
  }
  const rotateRight = () => {
    setRotation((prev) => (prev + 90) % 360)
    setPanPosition((prev) => clampPan(prev, imageSize.w, imageSize.h, zoom))
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const rawPan = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }
    setPanPosition(clampPan(rawPan, imageSize.w, imageSize.h, zoom))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomChange = (newZoom: number) => {
    const minZ = getMinZoom(imageSize.w, imageSize.h)
    // Allow zooming out slightly past minZ if requested, but clamp to 0.1 minimum
    const clampedZoom = Math.max(0.1, Math.min(10, newZoom))
    setZoom(clampedZoom)
    // Re-clamp pan with new zoom
    setPanPosition((prev) => clampPan(prev, imageSize.w, imageSize.h, clampedZoom))
  }

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Zoom sensitivity: adjust based on wheel delta
    // Use a small factor for smooth zooming with touchpad/mouse
    const delta = -e.deltaY * 0.001
    const newZoom = zoom + delta
    handleZoomChange(newZoom)
  }

  const handleCrop = () => {
    if (!selectedFile || !cropSourceUrl) return

    const image = new Image()
    image.src = cropSourceUrl
    image.onload = () => {
      // Container dimensions (matches the dialog preview area)
      const containerW = 600 // approximate rendered width of max-w-2xl dialog content
      const containerH = 320 // h-80 = 20rem = 320px
      const cropDiameter = 192 // w-48 h-48 = 12rem = 192px
      const outputSize = 1024 // high resolution output canvas size

      const scaleFactor = outputSize / cropDiameter

      // Step 1: Render the full scene onto a temp canvas matching the container * at high resolution
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = containerW * scaleFactor
      tempCanvas.height = containerH * scaleFactor
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) return

      // Calculate how the image fits in the container (object-contain behavior)
      const imgAspect = image.width / image.height
      const contAspect = containerW / containerH
      let drawW: number, drawH: number
      if (imgAspect > contAspect) {
        drawW = containerW
        drawH = containerW / imgAspect
      } else {
        drawH = containerH
        drawW = containerH * imgAspect
      }

      // Center position in container (logical coordinates)
      const centerX = containerW / 2
      const centerY = containerH / 2

      tempCtx.save()
      // Scale up the entire context so our logical coordinates map to high-res pixels
      tempCtx.scale(scaleFactor, scaleFactor)
      
      // Move to the center of the container, apply pan
      tempCtx.translate(centerX + panPosition.x, centerY + panPosition.y)
      // Apply rotation and zoom
      tempCtx.rotate((rotation * Math.PI) / 180)
      tempCtx.scale(zoom, zoom)
      // Draw image centered at origin
      tempCtx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH)
      tempCtx.restore()

      // Step 2: Extract the circular crop area from the center of the temp canvas
      const canvas = document.createElement('canvas')
      canvas.width = outputSize
      canvas.height = outputSize
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Clip to circle
      ctx.beginPath()
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      // Draw the cropped region from the high-res temp canvas
      const highResCenterX = centerX * scaleFactor
      const highResCenterY = centerY * scaleFactor
      const highResCropRadius = outputSize / 2

      ctx.drawImage(
        tempCanvas,
        highResCenterX - highResCropRadius, // source x
        highResCenterY - highResCropRadius, // source y
        outputSize, // source width
        outputSize, // source height
        0, // dest x
        0, // dest y
        outputSize, // dest width
        outputSize // dest height
      )

      canvas.toBlob((blob) => {
        if (!blob) return
        const croppedFile = new File([blob], selectedFile.name, { type: 'image/png' })
        setSelectedFile(croppedFile)
        const url = URL.createObjectURL(blob)
        setPreviewAvatar(url)
        closeCropDialog()
      }, 'image/png')
    }
  }

  useEffect(() => {
    return () => {
      if (previewAvatar && previewAvatar.startsWith('blob:')) {
        URL.revokeObjectURL(previewAvatar)
      }
    }
  }, [previewAvatar])

  const handleCameraClick = () => {
    const fileInput = document.getElementById('profile-photo-input') as HTMLInputElement
    fileInput?.click()
  }

  const handleSave = async () => {
    setIsUploading(true)
    setUploadMessage(null)
    let uploadSucceeded = true
    
    // Use a local copy to track updates and avoid stale state from the closure
    let currentUser = user ? { ...user } : null

    // Handle profile photo upload
    if (selectedFile) {
      const token = localStorage.getItem('threatopia_token')
      console.log('Profile upload auth token present:', Boolean(token), 'token sample:', token?.slice(0, 20))

      if (!token) {
        setUploadMessage('Authentication token missing. Please log in again.')
        setIsUploading(false)
        return
      }

      if (token.startsWith('mock_jwt_')) {
        setUploadMessage('Demo token detected. Please log in again after the backend is available.')
        setIsUploading(false)
        return
      }

      const formDataUpload = new FormData()
      formDataUpload.append('profilePhoto', selectedFile)
      
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/users/upload-profile-photo`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataUpload,
        })
        
        if (response.ok) {
          const data = await response.json()
          // Update the local tracking object with the new avatar
          if (currentUser) {
            currentUser.avatar = data.url
            // Update the store immediately for other components
            updateUser({ ...currentUser })
          }
          setUploadMessage('Profile photo uploaded successfully!')
          console.log('Profile photo uploaded:', data.url)
        } else {
          uploadSucceeded = false
          const errorData = await response.text().then((text) => {
            try {
              return JSON.parse(text)
            } catch {
              return { error: text || 'Upload failed' }
            }
          })
          const message = errorData?.error || response.statusText || 'Upload failed'
          setUploadMessage(`Failed to upload: ${message} (${response.status})`)
          console.error('Failed to upload profile photo', response.status, response.statusText, errorData)
        }
      } catch (error) {
        uploadSucceeded = false
        setUploadMessage('Error uploading profile photo')
        console.error('Error uploading profile photo:', error)
      }
    }

    // Update other profile data (contact info)
    const selectedCountry = COUNTRIES.find(c => c.name === formData.country)
    const fullPhoneNumber = selectedCountry ? `${selectedCountry.dialCode} ${formData.phonePart}` : formData.phonePart

    const result = await updateContactInfo({
      phoneNumber: fullPhoneNumber,
      country: formData.country,
    })

    if (result.success && result.data) {
      // Merge backend result with our tracked user to ensure avatar is preserved
      // result.data should have the latest data from the backend
      const finalUser: UserType = { 
        ...result.data, 
        avatar: result.data.avatar || currentUser?.avatar 
      }
      updateUser(finalUser)
      currentUser = finalUser
    }

    setIsUploading(false)

    // Only clear state and exit edit mode on success
    if (uploadSucceeded) {
      setIsEditing(false)
      setSelectedFile(null)
      setPreviewAvatar(null)
      setRotation(0)
      setZoom(1)
      setPanPosition({ x: 0, y: 0 })
    }
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
          disabled={isUploading}
          className="gap-2"
        >
          {isEditing ? (
            <>
              {isUploading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
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
                <Avatar className="h-64 w-64 ring-4 ring-primary/30 shadow-2xl shadow-primary/10">
                  <AvatarImage src={displayAvatar} className="object-cover" />
                  <AvatarFallback className="text-6xl font-bold bg-primary text-primary-foreground">
                    {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <button 
                      onClick={handleCameraClick}
                      className="absolute bottom-3 right-3 p-3.5 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-xl"
                    >
                      <Camera className="h-6 w-6" />
                    </button>
                    <input
                      id="profile-photo-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </>
                )}
                <Dialog open={cropDialogOpen} onOpenChange={(open) => { if (!open) cancelCrop(); else setCropDialogOpen(open) }}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Crop profile photo</DialogTitle>
                      <DialogDescription>
                        Drag to move the photo, adjust rotation and zoom, then crop the image before upload.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div
                        className="relative h-80 w-full overflow-hidden rounded-2xl bg-slate-950 cursor-move select-none"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                      >
                        {cropSourceUrl ? (
                          <img
                            src={cropSourceUrl}
                            alt="Preview"
                            className="absolute"
                            style={{
                              width: getDrawnSize(imageSize.w, imageSize.h, 1).drawW,
                              height: getDrawnSize(imageSize.w, imageSize.h, 1).drawH,
                              top: '50%',
                              left: '50%',
                              transform: `translate(calc(-50% + ${panPosition.x}px), calc(-50% + ${panPosition.y}px)) rotate(${rotation}deg) scale(${zoom})`,
                              transformOrigin: 'center',
                            }}
                            draggable={false}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                            Choose a photo to preview the crop.
                          </div>
                        )}
                        {/* Dark overlay with circular cutout using CSS mask */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            maskImage: 'radial-gradient(circle 96px at center, transparent 95px, black 97px)',
                            WebkitMaskImage: 'radial-gradient(circle 96px at center, transparent 95px, black 97px)',
                          }}
                        />
                        {/* Circular crop border */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-48 h-48 rounded-full border-2 border-white/80 shadow-lg" />
                        </div>
                        {/* Instructions overlay */}
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          Drag to reposition • Use controls below
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <Button variant="outline" size="sm" onClick={rotateLeft}>Rotate left</Button>
                        <Button variant="outline" size="sm" onClick={rotateRight}>Rotate right</Button>
                        <div className="space-y-2">
                          <Label htmlFor="zoom">Zoom ({Math.round(zoom * 100)}%)</Label>
                          <input
                            id="zoom"
                            type="range"
                            min={getMinZoom(imageSize.w, imageSize.h)}
                            max={3}
                            step={0.05}
                            value={zoom}
                            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={cancelCrop}>Cancel</Button>
                      <Button onClick={handleCrop}>Crop & Continue</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <h2 className="mt-4 text-xl font-bold text-foreground">{user?.name}</h2>
              <Badge className="mt-2" variant="secondary">{stats.rank}</Badge>
              
              {uploadMessage && (
                <p className={`mt-2 text-sm ${uploadMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {uploadMessage}
                </p>
              )}
              
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
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => setFormData({ ...formData, country: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c.code} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <div className="flex gap-2">
                        <div className="w-24 bg-muted/50 border border-input rounded-md flex items-center justify-center text-sm text-muted-foreground select-none">
                          {formData.country ? COUNTRIES.find(c => c.name === formData.country)?.dialCode : '+00'}
                        </div>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                          <Input
                            id="phoneNumber"
                            type="tel"
                            value={formData.phonePart}
                            onChange={(e) => setFormData({ ...formData, phonePart: e.target.value })}
                            disabled={!isEditing || !formData.country}
                            className="pl-10"
                          />
                        </div>
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