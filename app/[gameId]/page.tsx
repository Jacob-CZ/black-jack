"use client"

import { Canvas } from "@react-three/fiber"
import Image from "next/image"
import Card from "@/components/Card"
import { OrbitControls } from "@react-three/drei"
import { useEffect, useState } from "react"
import { useSpring, animated } from "@react-spring/three"
import BoxButton from "@/components/Button"
interface card {
    file: string | null
    played: boolean
    to: "dealer" | "player" | null
    double: boolean | null
}

export default function Game() {
    const [files, setFiles] = useState<string[]>([])
    const [cards, setCards] = useState<card[]>([])
    const [playerIndex, setPlayerIndex] = useState<number>(0)
    const [dealerIndex, setDealerIndex] = useState<number>(0)
    const [playIndex, setPlayIndex] = useState<number>(0)
    useEffect(() => {
        fetch('/api/get_textures').then((res) => res.json()).then((data) => {
            const files = data.files as string[]
            setFiles(files)
            const cards: card[] = files.map((file, index) => ({
                file: file,
                played: false,
                to: null,
                double: false
            }))
            setCards(cards)
        })

    }, [])
    const playPlayerCard = (double:boolean) => {
        const cardlocal = cards
        const playerCard = cardlocal[playIndex]
        playerCard.to = "player"
        playerCard.played = true
        playerCard.file = files[11]
        playerCard.double = double
        setCards([...cardlocal])
        setPlayerIndex(playerIndex + 1)
        setPlayIndex(playIndex + 1)
    }
    const playDealerCard = () => {
        const cardlocal = cards
        const dealerCard = cardlocal[playIndex]
        dealerCard.to = "dealer"
        dealerCard.played = true
        dealerCard.file = files[11]
        setDealerIndex(dealerIndex + 1)
        setPlayIndex(playIndex + 1)
    }
    return (
        <main className="w-full h-screen">
            <Canvas camera={{ position: [-1, 5, 15] }}>
                <OrbitControls />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 15, 10]} angle={0.3} />
                <animated.group rotation={[0, 0, - Math.PI * 0.5]} position={[1, 0, 0]}>
                    {cards.map((card, i) => (
                        <animated.group key={i}  >
                            <Card playerIndex={playerIndex} dealerIndex={dealerIndex} index={playIndex} i={i} card={card} position={[0, i * 0.02, 0]} rotation={[0, 0, - Math.PI * 0.25]} />
                        </animated.group>
                    )
                    )}
                </animated.group>
                <BoxButton onClick={() => { playPlayerCard(false) }} position={[0, -1, 12]} rotation={[-0.5 * Math.PI, 0, 0]} />
                <BoxButton onClick={() => { playDealerCard() }} position={[2, -1, 12]} rotation={[-0.5 * Math.PI, 0, 0]} />
                <BoxButton onClick={() => { playPlayerCard(true) }} position={[4, -1, 12]} rotation={[-0.5 * Math.PI, 0, 0]} />
            </Canvas>
        </main>
    )
}
