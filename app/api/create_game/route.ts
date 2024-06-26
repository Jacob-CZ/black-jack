import { card } from "@/app//[gameId]/page"
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server"
const cards : card[] = []
const suits: ("hearts" | "diamonds" | "clubs" | "spades")[] = ["hearts", "diamonds", "clubs", "spades"];
const values: any[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king", "ace"];
interface Card {
    suit: "hearts" | "diamonds" |  "clubs" | "spades" | null
    value: number | "ace" | "jack" | "queen" | "king" | null
}
const deck: Card[] = suits.flatMap(suit => values.map(value => ({ suit, value })));
export async function POST() {
	const supabase = createClient()
	const gameRes = await supabase.from("games").insert({}).select()
	if (gameRes.error || !gameRes.data) {
		console.error(gameRes.error)
		return NextResponse.json({ message: "error" }, { status: 500 })
	}
	const deckId = gameRes.data[0].deckId
	// const res = await fetch("https://api.random.org/json-rpc/4/invoke", {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify({
	// 		jsonrpc: "2.0",
	// 		method: "generateDecimalFractions",
	// 		params: {
	// 			apiKey: "02a6893d-aec9-4c58-a692-41395874c737",
	// 			n: 52*4,
	// 			decimalPlaces: 4,
	// 			replacement: true,
	// 			pregeneratedRandomization: null,
	// 		},
	// 		id: 796,
	// 	}),
	// })
	// const data = await res.json()
	// const randoms = data.result.random.data
    // if (!randoms) {
    //     return NextResponse.json({ message: "No randoms" }, { status: 500 })
    // }
	const array = Array.from({ length: 52 }, (_, i) => i + 1)
	const fourDeck = Array.from({ length: 4 }, () => [...array]).flat()
	const shuffleDeck = () => {
		for (let i = 0; i < fourDeck.length-1; i++) {
			let shuffle = Math.floor(Math.random() * fourDeck.length)
			let temp = fourDeck[i]
			fourDeck[i] = fourDeck[shuffle]
			fourDeck[shuffle] = temp
		}
	}
    shuffleDeck()
    fourDeck.forEach((card, index) => {
        cards.push({
            double: false,
            deck: 0,
            suit: deck[card-1].suit,
            value: deck[card-1].value,
            played: false,
            to: null,
            index: index,
			deckId: deckId
        })
    })
	const {error} = await supabase.from("cards").insert([...cards])
	if (error) {
		console.error(error)
		return NextResponse.json({ message: "error" }, { status: 500 })
	}
	return NextResponse.json({ id: gameRes.data[0].id }, { status: 200 })
}
