"use client"

import { useEffect, useRef } from "react"

interface Circle {
  x: number
  y: number
  radius: number
  minRadius: number
  maxRadius: number
  growthRate: number
  baseGrowthRate: number
  growing: boolean
  opacity: number
  baseOpacity: number
  isPrimary: boolean // Blue or steel tone
  // Anti-flicker system
  lastStateChange: number
  stateChangeCount: number
  isStatic: boolean
  staticRadius: number
  // Glow effect
  glowIntensity: number
  glowDecay: number
}

interface Connection {
  circle1: number
  circle2: number
  lightPosition: number
  lightDirection: number // 1 or -1
  nextLightTime: number
  lightActive: boolean
  trail: { x: number; y: number; opacity: number }[] // Trail points
  isLongDistance: boolean // For styling long connections differently
}

export default function OrbBackground({ containerId }: { containerId?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const circlesRef = useRef<Circle[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get the section element to match its dimensions
    const section = document.getElementById(containerId || "how-it-works")
    if (!section) return

    // Set canvas dimensions
    const updateCanvasSize = () => {
      const rect = section.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }


    // Generate hexagonal lattice positions with increased spacing
    const generateHexagonalLatticePositions = (width: number, height: number, count: number) => {
      const positions: { x: number; y: number }[] = []

      // Increased hexagon spacing for fewer adjacent connections
      const hexRadius = Math.min(width, height) / 3.5 // Increased from /5 to /3.5
      const hexWidth = hexRadius * Math.sqrt(3)
      const hexHeight = hexRadius * 1.5

      // Calculate proper margins
      const marginX = hexRadius * 0.4
      const marginY = hexRadius * 0.4

      // Effective area after margins
      const effectiveWidth = width - marginX * 2
      const effectiveHeight = height - marginY * 2

      // Calculate how many hexagons fit - ensure minimum 3 rows
      const cols = Math.floor(effectiveWidth / hexWidth) + 1
      const rows = Math.max(3, Math.floor(effectiveHeight / hexHeight) + 1) // Minimum 3 rows

      // Center the grid within the effective area
      const offsetX = marginX + (effectiveWidth - (cols - 1) * hexWidth) / 2
      const offsetY = marginY + (effectiveHeight - (rows - 1) * hexHeight) / 2

      let positionCount = 0

      for (let row = 0; row < rows && positionCount < count; row++) {
        for (let col = 0; col < cols && positionCount < count; col++) {
          // Hexagonal offset: every other row is shifted
          const xOffset = (row % 2) * (hexWidth / 2)

          const x = offsetX + col * hexWidth + xOffset
          const y = offsetY + row * hexHeight

          // Reduced organic variation to maintain structure
          const variationX = (Math.random() - 0.5) * hexRadius * 0.1 // Reduced variation
          const variationY = (Math.random() - 0.5) * hexRadius * 0.1

          // Ensure positions stay within the safe area
          const finalX = Math.max(marginX, Math.min(width - marginX, x + variationX))
          const finalY = Math.max(marginY, Math.min(height - marginY, y + variationY))

          positions.push({ x: finalX, y: finalY })
          positionCount++
        }
      }

      return positions
    }

    // Create connections with increased minimum distances
    const createHexagonalConnections = (circles: Circle[]) => {
      const connections: Connection[] = []
      const localMaxDistance = Math.min(canvas.width, canvas.height) * 0.25 // Increased from 0.2
      const longMaxDistance = Math.min(canvas.width, canvas.height) * 0.7 // Increased from 0.6

      for (let i = 0; i < circles.length; i++) {
        // Find nearby circles for local connections
        const nearbyCircles: { index: number; distance: number }[] = []
        // Find distant circles for long-distance connections
        const distantCircles: { index: number; distance: number }[] = []

        for (let j = 0; j < circles.length; j++) {
          if (i === j) continue

          const dx = circles[i].x - circles[j].x
          const dy = circles[i].y - circles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance <= localMaxDistance) {
            nearbyCircles.push({ index: j, distance })
          } else if (distance <= longMaxDistance) {
            distantCircles.push({ index: j, distance })
          }
        }

        // Sort by distance
        nearbyCircles.sort((a, b) => a.distance - b.distance)
        distantCircles.sort((a, b) => a.distance - b.distance)

        // Create fewer local connections (1-3 per node instead of 2-4)
        const localConnections = Math.min(Math.floor(Math.random() * 3) + 1, nearbyCircles.length)
        for (let k = 0; k < localConnections; k++) {
          const j = nearbyCircles[k].index

          // Avoid duplicate connections AND self-connections
          const connectionExists = connections.some(
            (conn) => (conn.circle1 === i && conn.circle2 === j) || (conn.circle1 === j && conn.circle2 === i),
          )

          if (!connectionExists && i !== j) {
            // Add check to prevent self-connections
            const lightDelay = Math.random() * 2000 + 500 // Faster start: 0.5-2.5 seconds
            connections.push({
              circle1: i,
              circle2: j,
              lightPosition: 0, // Always start at 0
              lightDirection: 1, // Always start going forward (1 = circle1 to circle2)
              nextLightTime: timeRef.current + lightDelay,
              lightActive: false,
              trail: [],
              isLongDistance: false,
            })
          }
        }

        // Create long-distance connections (0-2 per node, less frequent)
        if (distantCircles.length > 0 && Math.random() > 0.5) {
          // Reduced frequency
          const longConnections = Math.min(Math.floor(Math.random() * 2) + 1, distantCircles.length, 2)
          for (let k = 0; k < longConnections; k++) {
            const randomIndex = Math.floor(Math.random() * Math.min(distantCircles.length, 5))
            const j = distantCircles[randomIndex].index

            // Avoid duplicate connections AND self-connections
            const connectionExists = connections.some(
              (conn) => (conn.circle1 === i && conn.circle2 === j) || (conn.circle1 === j && conn.circle2 === i),
            )

            if (!connectionExists && i !== j) {
              // Add check to prevent self-connections
              const lightDelay = Math.random() * 3000 + 1000 // Faster start for long-distance: 1-4 seconds
              connections.push({
                circle1: i,
                circle2: j,
                lightPosition: 0, // Always start at 0
                lightDirection: 1, // Always start going forward (1 = circle1 to circle2)
                nextLightTime: timeRef.current + lightDelay,
                lightActive: false,
                trail: [],
                isLongDistance: true,
              })
            }
          }
        }
      }

      return connections
    }

    // Initialize circles with anti-flicker system
    const initCircles = () => {
      const count = window.innerWidth < 768 ? 20 : 35 // Adjusted for increased spacing
      const circles: Circle[] = []

      // Generate hexagonal positions
      const positions = generateHexagonalLatticePositions(canvas.width, canvas.height, count)

      for (let i = 0; i < positions.length && i < count; i++) {
        const position = positions[i]
        const maxRadius = Math.random() * 60 + 80 // 80-140px
        const minRadius = Math.max(25, Math.random() * 20 + 30) // 30-50px, minimum 25
        const baseGrowthRate = Math.random() * 0.1 + 0.06 // 0.06-0.16
        const baseOpacity = Math.random() * 0.08 + 0.06 // 6%-14% opacity
        const isPrimary = Math.random() > 0.3 // 70% blue, 30% steel
        const startRadius = Math.max(minRadius, Math.random() * (maxRadius - minRadius) + minRadius)

        circles.push({
          x: position.x,
          y: position.y,
          radius: startRadius,
          minRadius,
          maxRadius,
          growthRate: baseGrowthRate,
          baseGrowthRate,
          growing: Math.random() > 0.5,
          opacity: baseOpacity,
          baseOpacity,
          isPrimary,
          // Anti-flicker system
          lastStateChange: 0,
          stateChangeCount: 0,
          isStatic: false,
          staticRadius: startRadius,
          // Glow effect
          glowIntensity: 0,
          glowDecay: 0.02,
        })
      }

      circlesRef.current = circles
      connectionsRef.current = createHexagonalConnections(circles)
    }

    // Create simple radial gradient with blue and steel colors
    const createSimpleGradient = (
      ctx: CanvasRenderingContext2D,
      circle: Circle,
      currentRadius: number,
    ): CanvasGradient => {
      // Ensure radius is always positive and at least 1
      const safeRadius = Math.max(1, currentRadius)

      const gradient = ctx.createRadialGradient(circle.x, circle.y, 0, circle.x, circle.y, safeRadius)

      if (circle.isPrimary) {
        // Soft blue tones (#3b82f6)
        gradient.addColorStop(0, `rgba(59, 130, 246, ${circle.opacity})`)
        gradient.addColorStop(0.7, `rgba(59, 130, 246, ${circle.opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(59, 130, 246, 0)`)
      } else {
        // Steel tones (cooler gray with slight blue tint)
        gradient.addColorStop(0, `rgba(100, 116, 139, ${circle.opacity})`) // Steel blue-gray
        gradient.addColorStop(0.7, `rgba(100, 116, 139, ${circle.opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(100, 116, 139, 0)`)
      }

      return gradient
    }

    // Draw connection lines with light crawls and trails
    const drawConnections = (ctx: CanvasRenderingContext2D, circles: Circle[], connections: Connection[]) => {
      connections.forEach((connection) => {
        const circle1 = circles[connection.circle1]
        const circle2 = circles[connection.circle2]

        if (!circle1 || !circle2) return

        // Draw connection line (slightly more visible for long-distance connections)
        ctx.beginPath()
        ctx.moveTo(circle1.x, circle1.y)
        ctx.lineTo(circle2.x, circle2.y)
        const lineOpacity = connection.isLongDistance ? 0.015 : 0.025 // Reduced from 0.02/0.04
        ctx.strokeStyle = `rgba(59, 130, 246, ${lineOpacity})`
        ctx.lineWidth = connection.isLongDistance ? 0.5 : 1
        ctx.stroke()

        // Draw light crawl if active
        if (connection.lightActive) {
          const dx = circle2.x - circle1.x
          const dy = circle2.y - circle1.y

          // Calculate current light position
          const lightX = circle1.x + dx * connection.lightPosition
          const lightY = circle1.y + dy * connection.lightPosition

          // Update light position - 15% slower than before
          const speed = connection.lightDirection * 0.051 // Reduced from 0.06 (15% slower)
          connection.lightPosition += speed

          // Add current position to trail more frequently for smoother trail
          if (
            connection.trail.length === 0 ||
            Math.abs(lightX - connection.trail[0].x) > 3 ||
            Math.abs(lightY - connection.trail[0].y) > 3
          ) {
            connection.trail.unshift({ x: lightX, y: lightY, opacity: 1.0 })
          }

          // Adjust trail length for slower speed
          const maxTrailLength = connection.isLongDistance ? 8 : 6
          if (connection.trail.length > maxTrailLength) {
            connection.trail = connection.trail.slice(0, maxTrailLength)
          }

          // Update trail opacity (fade over time)
          connection.trail.forEach((point, index) => {
            point.opacity = Math.max(0, 1.0 - index * 0.25)
          })

          // Draw trail (from oldest to newest) - smaller and dimmer
          connection.trail.reverse().forEach((point, index) => {
            if (point.opacity > 0) {
              // Draw trail points - smaller and fainter
              const baseSize = connection.isLongDistance ? 3 : 2
              const trailSize = baseSize + point.opacity * (connection.isLongDistance ? 6 : 4)
              const trailGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, trailSize)
              trailGradient.addColorStop(0, `rgba(59, 130, 246, ${point.opacity * 0.28})`) // Reduced from 0.35
              trailGradient.addColorStop(0.3, `rgba(59, 130, 246, ${point.opacity * 0.14})`) // Reduced from 0.18
              trailGradient.addColorStop(0.7, `rgba(59, 130, 246, ${point.opacity * 0.04})`) // Reduced from 0.06
              trailGradient.addColorStop(1, `rgba(59, 130, 246, 0)`)

              ctx.beginPath()
              ctx.fillStyle = trailGradient
              ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2)
              ctx.fill()
            }
          })
          connection.trail.reverse() // Restore original order

          // Draw smaller, fainter main light
          const lightSize = connection.isLongDistance ? 8 : 6 // Keep same size
          const lightGradient = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, lightSize)
          lightGradient.addColorStop(0, `rgba(59, 130, 246, 0.3)`) // Reduced from 0.4
          lightGradient.addColorStop(0.2, `rgba(59, 130, 246, 0.18)`) // Reduced from 0.25
          lightGradient.addColorStop(0.5, `rgba(59, 130, 246, 0.06)`) // Reduced from 0.08
          lightGradient.addColorStop(1, `rgba(59, 130, 246, 0)`)

          ctx.beginPath()
          ctx.fillStyle = lightGradient
          ctx.arc(lightX, lightY, lightSize, 0, Math.PI * 2)
          ctx.fill()

          // Smaller, more subtle brighter core
          const coreSize = connection.isLongDistance ? 2.5 : 1.8 // Keep same size
          const coreGradient = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, coreSize)
          coreGradient.addColorStop(0, `rgba(255, 255, 255, 0.2)`) // Reduced from 0.25
          coreGradient.addColorStop(0.5, `rgba(59, 130, 246, 0.15)`) // Reduced from 0.2
          coreGradient.addColorStop(1, `rgba(59, 130, 246, 0.04)`) // Reduced from 0.06

          ctx.beginPath()
          ctx.fillStyle = coreGradient
          ctx.arc(lightX, lightY, coreSize, 0, Math.PI * 2)
          ctx.fill()

          // Check if light has reached the end - proper boundary checking for both directions
          if (
            (connection.lightDirection > 0 && connection.lightPosition >= 1.0) ||
            (connection.lightDirection < 0 && connection.lightPosition <= 0.0)
          ) {
            connection.lightActive = false

            // Determine which node received the light
            const targetCircleIndex = connection.lightDirection > 0 ? connection.circle2 : connection.circle1
            connection.trail = [] // Clear trail when light finishes

            // Trigger glow effect on the receiving node
            if (circles[targetCircleIndex]) {
              circles[targetCircleIndex].glowIntensity = 0.3 // Start with 30% glow intensity
            }

            // 30% chance for cascading effect - send out two lights from the receiving node
            if (Math.random() < 0.3) {
              // Find all connections from the target circle (excluding self-connections and current connection)
              const cascadeConnections = connectionsRef.current.filter(
                (conn) =>
                  (conn.circle1 === targetCircleIndex || conn.circle2 === targetCircleIndex) &&
                  !conn.lightActive &&
                  conn !== connection &&
                  conn.circle1 !== conn.circle2, // Prevent self-connections in cascades
              )

              // Activate up to 2 random connections immediately
              const connectionsToActivate = cascadeConnections
                .sort(() => Math.random() - 0.5) // Shuffle
                .slice(0, 2) // Take up to 2

              connectionsToActivate.forEach((cascadeConn) => {
                cascadeConn.lightActive = true
                // Set proper direction: if target is circle1, go forward (1), if target is circle2, go backward (-1)
                cascadeConn.lightDirection = cascadeConn.circle1 === targetCircleIndex ? 1 : -1
                // Set starting position based on direction
                cascadeConn.lightPosition = cascadeConn.lightDirection > 0 ? 0 : 1
                cascadeConn.trail = []
              })
            }

            // Schedule next light crawl with much faster timing
            const baseDelay = connection.isLongDistance ? 6000 : 2400 // Increased by 20%
            const variableDelay = connection.isLongDistance ? 4500 : 2400 // Increased by 20%
            const nextDelay = Math.random() * variableDelay + baseDelay
            connection.nextLightTime = timeRef.current + nextDelay
          }
        }

        // Check if it's time to start a new light crawl
        if (!connection.lightActive && timeRef.current >= connection.nextLightTime) {
          connection.lightActive = true
          connection.lightDirection = Math.random() > 0.5 ? 1 : -1 // Random direction
          // Set starting position based on direction
          connection.lightPosition = connection.lightDirection > 0 ? 0 : 1
          connection.trail = [] // Clear any existing trail
        }
      })
    }

    // Animation function with anti-flicker system
    const animate = () => {
      if (!ctx) return
      timeRef.current = Date.now()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections first (behind circles)
      drawConnections(ctx, circlesRef.current, connectionsRef.current)

      circlesRef.current.forEach((circle, i) => {
        // Anti-flicker system: check if node should become static
        if (!circle.isStatic) {
          // Reset counter every 3 seconds
          if (timeRef.current - circle.lastStateChange > 3000) {
            circle.stateChangeCount = 0
          }

          // If changing state too frequently (more than 6 times in 3 seconds), make it static
          if (circle.stateChangeCount > 6) {
            circle.isStatic = true
            circle.staticRadius = (circle.minRadius + circle.maxRadius) / 2 // Set to middle size
            circle.radius = circle.staticRadius
          }
        }

        // Handle static nodes
        if (circle.isStatic) {
          circle.radius = circle.staticRadius
          // Occasionally allow static nodes to become dynamic again
          if (Math.random() < 0.0005) {
            // Very low chance per frame
            circle.isStatic = false
            circle.stateChangeCount = 0
            circle.lastStateChange = timeRef.current
          }
        } else {
          // Normal growth/shrink logic for non-static nodes
          // Ensure radius never goes below minimum
          circle.radius = Math.max(circle.minRadius, circle.radius)

          // Handle growth/shrink logic
          if (circle.growing) {
            circle.radius += circle.growthRate // Continue growing
            if (circle.radius >= circle.maxRadius) {
              circle.growing = false // Hit max size, start shrinking
              // Track state change
              circle.stateChangeCount++
              circle.lastStateChange = timeRef.current
            }
          } else {
            // Shrinking
            circle.radius -= circle.growthRate
            if (circle.radius <= circle.minRadius) {
              circle.radius = circle.minRadius // Ensure it doesn't go below minimum
              circle.growing = true
              // Track state change
              circle.stateChangeCount++
              circle.lastStateChange = timeRef.current
              // Reset growth rate with subtle variation
              circle.baseGrowthRate = Math.random() * 0.1 + 0.06
              circle.growthRate = circle.baseGrowthRate
              // Minimal opacity variation
              circle.baseOpacity = Math.random() * 0.08 + 0.06
              circle.opacity = circle.baseOpacity
            }
          }
        }

        // Only draw if radius is positive
        if (circle.radius > 0) {
          // Update glow decay
          if (circle.glowIntensity > 0) {
            circle.glowIntensity = Math.max(0, circle.glowIntensity - circle.glowDecay)
          }

          // Draw circle with simple gradient
          ctx.beginPath()
          const simpleGradient = createSimpleGradient(ctx, circle, circle.radius)
          ctx.fillStyle = simpleGradient
          ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
          ctx.fill()

          // Draw glow effect if active
          if (circle.glowIntensity > 0) {
            const glowRadius = circle.radius * 1.5
            const glowGradient = ctx.createRadialGradient(circle.x, circle.y, 0, circle.x, circle.y, glowRadius)
            const glowColor = circle.isPrimary ? "59, 130, 246" : "100, 116, 139"
            glowGradient.addColorStop(0, `rgba(${glowColor}, ${circle.glowIntensity * 0.4})`)
            glowGradient.addColorStop(0.5, `rgba(${glowColor}, ${circle.glowIntensity * 0.2})`)
            glowGradient.addColorStop(1, `rgba(${glowColor}, 0)`)

            ctx.beginPath()
            ctx.fillStyle = glowGradient
            ctx.arc(circle.x, circle.y, glowRadius, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Initialize
    updateCanvasSize()
    initCircles()
    animate()

    // Handle resize
    const handleResize = () => {
      updateCanvasSize()
      initCircles()
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: 1 }}
    />
  )
}
