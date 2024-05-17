"use client"

import { Canvas } from "@react-three/fiber"
import Image from "next/image"
import Card from "@/components/Card"
import { OrbitControls } from "@react-three/drei"
import { use, useEffect, useState } from "react"
import { useSpring, animated } from "@react-spring/three"
import BoxButton from "@/components/Button"
import { is } from "@react-three/fiber/dist/declarations/src/core/utils"
export interface card {
	suit: "hearts" | "diamonds" | "clubs" | "spades" | null
	value: number | "ace" | "jack" | "queen" | "king" | null
	played: boolean
	to: "dealer" | "player" | null
	deck: number
	double: boolean | null
	index: number
}

export default function Game() {
	const [cards, setCards] = useState<card[]>([])
	const [playerIndex, setPlayerIndex] = useState<number[]>([0])
	const [dealerIndex, setDealerIndex] = useState<number>(0)
	const [playIndex, setPlayIndex] = useState<number>(0)
	useEffect(() => {
		const nullCards = Array.from({ length: 52 * 4 }, (_, i) => i + 1)
		const cards: card[] = nullCards.map((file, index) => ({
			suit: null,
			value: null,
			played: false,
			to: null,
			deck: 0,
			double: false,
			index: index,
		}))
		setCards(cards)
	}, [])
	useEffect(() => {
        if(playIndex !== 0 || cards.length === 0){
            return
        }



	}, [cards])
	const isDeckDoubled = (deck: number): boolean => {
		return cards.some((card) => card.deck === deck && card.double)
	}
	const playPlayerCard = (double: boolean, deckNumber: number) => {
        console.log(deckNumber)
		if (isDeckDoubled(deckNumber)) {
			return
		}
		const cardlocal = cards
		const playerCard = cardlocal[playIndex]
		playerCard.to = "player"
		playerCard.played = true
		playerCard.double = double
		playerCard.deck = deckNumber
		setCards([...cardlocal])
		const playerIndexLocal = playerIndex
		playerIndexLocal[deckNumber] += 1
		console.log(playerIndexLocal)
		setPlayerIndex(playerIndexLocal)
		setPlayIndex(playIndex + 1)
	}
	const playDealerCard = () => {
		const cardlocal = cards
		console.log(cardlocal)
		const dealerCard = cardlocal[playIndex]
		dealerCard.to = "dealer"
		dealerCard.played = true
		setDealerIndex(dealerIndex + 1)
		setPlayIndex(playIndex + 1)
	}
	const getLastPlayedCard = (deck: number): card | null => {
		const playedCards = cards.filter(
			(card) => card.deck === deck && card.played
		)
		return playedCards[playedCards.length - 1] || null
	}
	const findFirstZero = (array: number[]): number => {
		return array.findIndex((element) => element === 0)
	}

	const split = (deck: number) => {
		const lastPlayedCard = getLastPlayedCard(deck)
		if (lastPlayedCard) {
			const cardlocal = cards
			const localPlayerIndex = playerIndex
			const card = cardlocal[lastPlayedCard.index]
			if (localPlayerIndex[card.deck] == 1 || card.double) {
				return
			}
			localPlayerIndex.push(0)
			const firstZero = findFirstZero(localPlayerIndex)
			if (firstZero === -1) {
				return
			}
			localPlayerIndex[card.deck] -= 1
			localPlayerIndex[firstZero] += 1
			setPlayerIndex([...localPlayerIndex])
			card.deck = firstZero
			setCards([...cardlocal])
		}
	}
	return (
		<main className="w-full h-screen">
			<Canvas camera={{ position: [-1, 5, 15] }}>
				<OrbitControls />
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 15, 10]} angle={0.3} />
				<animated.group
					rotation={[0, 0, -Math.PI * 0.5]}
					position={[1, 0, 0]}
				>
					{cards.map((card, i) => (
						<animated.group key={i}>
							<Card
								playerIndex={playerIndex}
								dealerIndex={dealerIndex}
								index={playIndex}
								i={i}
								card={card}
								position={[0, i * 0.02, 0]}
								rotation={[0, 0, -Math.PI * 0.25]}
							/>
						</animated.group>
					))}
				</animated.group>
				<BoxButton
					onClick={() => {
						playDealerCard()
					}}
					position={[0, -0.7, 4]}
					rotation={[-0.5 * Math.PI, 0, 0]}
				/>
				{playerIndex.map((index, i) => (
					<group key={i} position={[i * 6, 0, 0]}>
						<BoxButton
							onClick={() => {
								playPlayerCard(false, i)
							}}
							position={[-5, -0.7, 16]}
							rotation={[-0.5 * Math.PI, 0, 0]}
						/>
						<BoxButton
							onClick={() => {
								playPlayerCard(true, i)
							}}
							position={[-3, -0.7, 16]}
							rotation={[-0.5 * Math.PI, 0, 0]}
						/>
						<BoxButton
							onClick={() => {
								split(i)
							}}
							position={[-1, -0.7, 16]}
							rotation={[-0.5 * Math.PI, 0, 0]}
						/>
					</group>
				))}
			</Canvas>
		</main>
	)
}
