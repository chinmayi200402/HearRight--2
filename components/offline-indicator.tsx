"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { WifiOff, Wifi } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)

      if (!online) {
        setShowOfflineMessage(true)
      } else if (showOfflineMessage) {
        // Show "back online" message briefly
        setTimeout(() => setShowOfflineMessage(false), 3000)
      }
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    updateOnlineStatus()

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [showOfflineMessage])

  if (!showOfflineMessage) return null

  return (
    <Card
      className={`fixed top-4 left-4 right-4 z-50 ${
        isOnline ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-orange-600" />}
          <span className={`text-sm font-medium ${isOnline ? "text-green-800" : "text-orange-800"}`}>
            {isOnline ? "Back online - data will sync" : "Offline mode - data saved locally"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
