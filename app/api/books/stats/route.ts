import { NextResponse } from "next/server"
import { getBookStats } from "@/lib/db"

export async function GET() {
  try {
    const stats = await getBookStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Failed to fetch book stats:", error)
    return NextResponse.json({ error: "Failed to fetch book stats" }, { status: 500 })
  }
}
