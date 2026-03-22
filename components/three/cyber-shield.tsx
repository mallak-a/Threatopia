'use client'

import { useEffect, useRef, useState } from 'react'
import { Shield } from 'lucide-react'

export function CyberShield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }
    resize()
    window.addEventListener('resize', resize)

    // Particle system
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      color: string
    }

    const particles: Particle[] = []
    const particleCount = 100
    const colors = ['#3B82F6', '#60A5FA', '#93C5FD', '#1E3A5F']

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Shield parameters
    let shieldRotation = 0
    let pulsePhase = 0
    const centerX = () => canvas.width / 2
    const centerY = () => canvas.height / 2

    // Draw hexagon
    const drawHexagon = (x: number, y: number, radius: number, rotation: number, strokeColor: string, lineWidth: number, alpha: number) => {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = lineWidth
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rotation
        const px = x + radius * Math.cos(angle)
        const py = y + radius * Math.sin(angle)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.stroke()
      ctx.restore()
    }

    // Draw shield icon
    const drawShieldIcon = (x: number, y: number, size: number, alpha: number) => {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = '#3B82F6'
      ctx.beginPath()
      ctx.moveTo(x, y - size)
      ctx.lineTo(x + size * 0.8, y - size * 0.5)
      ctx.lineTo(x + size * 0.8, y + size * 0.3)
      ctx.quadraticCurveTo(x, y + size, x, y + size)
      ctx.quadraticCurveTo(x, y + size, x - size * 0.8, y + size * 0.3)
      ctx.lineTo(x - size * 0.8, y - size * 0.5)
      ctx.closePath()
      ctx.fill()
      
      // Inner shield highlight
      ctx.fillStyle = '#60A5FA'
      ctx.globalAlpha = alpha * 0.5
      ctx.beginPath()
      ctx.moveTo(x, y - size * 0.7)
      ctx.lineTo(x + size * 0.5, y - size * 0.35)
      ctx.lineTo(x + size * 0.5, y + size * 0.1)
      ctx.quadraticCurveTo(x, y + size * 0.6, x, y + size * 0.6)
      ctx.quadraticCurveTo(x, y + size * 0.6, x - size * 0.5, y + size * 0.1)
      ctx.lineTo(x - size * 0.5, y - size * 0.35)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    // Draw scanning line
    const drawScanLine = (x: number, y: number, radius: number, angle: number) => {
      ctx.save()
      const gradient = ctx.createLinearGradient(
        x, y,
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius
      )
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0)')
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.8)')
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius
      )
      ctx.stroke()
      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cx = centerX()
      const cy = centerY()
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.35

      // Draw background glow
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 1.5)
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)')
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)')
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        // Boundary check
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1

        // Connect nearby particles
        particles.forEach((p2) => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            ctx.beginPath()
            ctx.strokeStyle = '#3B82F6'
            ctx.globalAlpha = (1 - dist / 80) * 0.2
            ctx.lineWidth = 0.5
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        })
      })

      // Draw hexagonal rings
      const pulse = Math.sin(pulsePhase) * 0.1 + 1
      drawHexagon(cx, cy, baseRadius * 1.2 * pulse, shieldRotation, '#3B82F6', 2, 0.3)
      drawHexagon(cx, cy, baseRadius * pulse, -shieldRotation * 0.5, '#60A5FA', 2, 0.5)
      drawHexagon(cx, cy, baseRadius * 0.8 * pulse, shieldRotation * 0.3, '#93C5FD', 1.5, 0.4)

      // Draw scanning lines
      for (let i = 0; i < 3; i++) {
        const angle = shieldRotation + (Math.PI * 2 / 3) * i
        drawScanLine(cx, cy, baseRadius, angle)
      }

      // Draw central shield
      drawShieldIcon(cx, cy, baseRadius * 0.4, 0.9)

      // Draw data points around shield
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i + shieldRotation * 0.2
        const radius = baseRadius * 0.95
        const x = cx + Math.cos(angle) * radius
        const y = cy + Math.sin(angle) * radius
        
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#3B82F6'
        ctx.globalAlpha = 0.8 + Math.sin(pulsePhase + i) * 0.2
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Update animation values
      shieldRotation += 0.005
      pulsePhase += 0.03

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [isClient])

  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center">
        <div className="relative">
          <Shield className="h-24 w-24 text-primary/50 animate-pulse" />
          <div className="absolute inset-0 blur-xl bg-primary/20" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  )
}
