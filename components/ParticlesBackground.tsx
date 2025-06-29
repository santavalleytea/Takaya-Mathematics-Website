'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    particlesJS?: {
      load: (
        tagId: string,
        path: string,
        callback?: () => void
      ) => void
    }
  }
}

export default function ParticlesBackground() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'
    script.onload = () => {
      window.particlesJS?.load('particles-js', '/particles.json', () => {
        console.log('particles.js loaded')
      })
    }
    document.body.appendChild(script)
  }, [])

  return <div id="particles-js" className="fixed top-0 left-0 w-full h-full -z-10" />
}
