import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from 'fs';

export function GET(req: NextRequest){
    const directoryPath = path.join(process.cwd(), 'public', 'textures');
    const filenames = fs.readdirSync(directoryPath);
    return NextResponse.json({files : filenames},{status: 200});
}