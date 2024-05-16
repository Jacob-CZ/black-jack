"use client"

import { Canvas } from "@react-three/fiber"
import Image from "next/image"
import Card from "../components/Card"
import { OrbitControls, TransformControls, useTexture } from "@react-three/drei"
import { useEffect, useState } from "react"
import { getFileNames } from "./utils"
import { useSpring, animated } from "@react-spring/three"
import BoxButton from "@/components/Button"
interface card {
  file: string
  played: boolean
  to: "dealer" | "player" | null
  index: Number
}

export default function Home() {
  const { x } = useSpring({ from: { x: 0 }, to: { x: 1 }, loop: true, config: { mass: 1, tension: 100, friction: 10 } })
  const [files, setFiles] = useState<string[]>([])
  const [cards, setCards] = useState<card[]>([])
  const [dealer, setDealer] = useState<boolean>(false)
  const [playIndex, setPlayIndex] = useState<number>(0) 
  useEffect(() => {
    fetch('/api/get_textures').then((res) => res.json()).then((data) => {
      const files = data.files as string[]
      const cards: card[] = files.map((file, index) => ({
        file: file,
        played: false,
        to: "player",
        index: index
      }))
      setCards(cards)
      
    })
  }, [])
  return (
    <main className="w-full h-screen">
      <Canvas camera={{position:[-1,5,15]}}>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} />
        <animated.group rotation={[0, 0, - Math.PI * 0.5]} position={[1,0,0]}>
          {cards.map((card, i) => (
            <animated.group key={i}  >
              <Card index={playIndex} dealer={dealer} i={i} card={card} position={[0, i * 0.02, 0]} rotation={[0, 0, - Math.PI * 0.25]} >
              </Card>
            </animated.group>
          )
          )}
        </animated.group>
        <BoxButton onClick={() => {setPlayIndex(playIndex +1)}} />

      </Canvas>
      <button onClick={() => setFiles(files.slice(0, -1))}>Stop</button>
      <button onClick={() => setDealer(true)}>Start</button>
      <button onClick={() => {setPlayIndex(playIndex +1)}}> play next</button>
      <button onClick={() => {fetch("api/create_game",{method:"POST"})}}> play previous</button>

    </main>
  )
}
