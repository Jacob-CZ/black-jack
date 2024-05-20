import { NextRequest, NextResponse } from "next/server";

export function POST(req: NextRequest) {
    const body = req.json()
    console.log(body)
    return NextResponse.json({ message: "Hello" })
}