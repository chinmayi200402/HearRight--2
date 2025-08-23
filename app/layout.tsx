import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { PWAInstall } from "@/components/pwa-install"
import { OfflineIndicator } from "@/components/offline-indicator"
import "./globals.css"

export const metadata: Metadata = {
  title: "HearRight - App-Based Audiometer",
  description: "Screen hearing in minutes. Anywhere. Professional audiometry testing made accessible.",
  generator: "HearRight",
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {children}
        <PWAInstall />
        <OfflineIndicator />

        {/* Medical disclaimer footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-amber-50 border-t border-amber-200 px-4 py-2 text-xs text-amber-800 text-center">
          ⚠️ HearRight is a screening tool and not a substitute for a clinical diagnostic audiometer. Results depend on
          device/headphone calibration and environment.
        </footer>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
