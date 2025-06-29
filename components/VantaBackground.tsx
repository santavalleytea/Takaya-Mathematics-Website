'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<any>(null)

  useEffect(() => {
    if (!vantaEffect) {
      import('vanta/src/vanta.net').then((VANTA) => {
        const effect = VANTA.default({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          touchSensitivity: 0.2,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x444444,
          backgroundColor: 0x000000,
        })
        setVantaEffect(effect)
      })
    }

    return () => {
      if (vantaEffect?.destroy) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div
      ref={vantaRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  )
}
