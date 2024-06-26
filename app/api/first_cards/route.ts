import { card } from "@/app/[gameId]/page";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const supabase = createClient()
    const gameId = req.nextUrl.searchParams.get("gameId")
    if (!gameId) {
        return NextResponse.json({ message: "No game id" }, { status: 400 });
    }
    const { data, error } = await supabase.from("games").select().eq("id", gameId)
    if (error || !data) {
        return NextResponse.json({ message: "error" }, { status: 500 });
    }
    const deckId = data[0].deckId
    const { data: deck, error: deckError } = await supabase.from("cards").select().eq("deckId", deckId).order("index")
    if (deckError || !deck) {
        return NextResponse.json({ message: "error" }, { status: 500 });
    }
    
    const returnDeck:card[] = deck.slice(0, 3)
    returnDeck.forEach(card => {
        card.played = true
        card.to = "player"
        card.deck = 0
        card.double = false
    })
    returnDeck[1].to = "dealer"
    return NextResponse.json(returnDeck, { status: 200 });
}