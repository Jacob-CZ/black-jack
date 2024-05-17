"use client"

import { useRouter } from "next/navigation"
import { use, useEffect } from "react"

export default function Home() {
	const router = useRouter()
	useEffect(() => {
		createGame()
	},[])
	const createGame = async () => {
		const res = await fetch("/api/create_game",{method:"POST"})
		const data = await res.json()
		if (data.message === "error") {
			console.error(data.message)
			return
		}
		router.push(`/${data.id}`)
	}
	return (
		<main className="w-full h-screen">
			<button onClick={createGame}>create game</button>
		</main>
	)
}
