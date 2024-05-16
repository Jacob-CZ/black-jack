import { NextResponse } from "next/server"

export async function POST(){
    const res = await fetch("https://api.random.org/json-rpc/4/invoke",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "generateIntegers",
            "params": {
                "apiKey": "248cff88-d0f8-4b78-b009-0d110d291d4c",
                "n": 10,
                "min": 1,
                "max": 10,
                "replacement": true,
                "base": 10,
                "pregeneratedRandomization": null
            },
            "id": 17196
        })
    })
    const data = await res.json()
    console.log(data.result.random.data)
    return NextResponse.json({message: "Hello World"}, {status: 200})
}