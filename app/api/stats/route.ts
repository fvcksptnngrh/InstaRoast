import { NextRequest, NextResponse } from 'next/server'

// In-memory storage (in production, use database)
let roastStats = {
  totalRoasts: 145,
  todayRoasts: 23,
  topRoaster: "cristiano",
  averageRating: 4.8,
  lastUpdated: new Date().toISOString()
}

export async function GET() {
  try {
    // Update today's count based on current date
    const today = new Date().toDateString()
    const lastUpdate = new Date(roastStats.lastUpdated).toDateString()
    
    if (today !== lastUpdate) {
      roastStats.todayRoasts = 0
      roastStats.lastUpdated = new Date().toISOString()
    }

    return NextResponse.json(roastStats)
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil statistik' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username diperlukan' },
        { status: 400 }
      )
    }

    // Update stats
    roastStats.totalRoasts += 1
    roastStats.todayRoasts += 1
    roastStats.lastUpdated = new Date().toISOString()

    // Simple logic to update top roaster (in production, use more sophisticated logic)
    if (roastStats.totalRoasts % 10 === 0) {
      roastStats.topRoaster = username
    }

    return NextResponse.json({
      success: true,
      stats: roastStats,
      message: `Berhasil menambah roast untuk ${username}!`
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Gagal memperbarui statistik' },
      { status: 500 }
    )
  }
} 