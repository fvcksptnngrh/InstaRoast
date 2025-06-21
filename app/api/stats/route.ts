import { redis } from '@/app/lib/redis'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const lastResetDate = await redis.get('stats:lastResetDate');

    // Jika tanggal terakhir reset bukan hari ini, reset counter harian
    if (lastResetDate !== today) {
      await redis.set('stats:todayRoasts', 0);
      await redis.set('stats:lastResetDate', today);
      console.log(`Daily roast count reset for ${today}`);
    }

    // Ambil semua data dari Redis
    const [totalRoasts, todayRoasts, lastVictim] = await Promise.all([
      redis.get('stats:totalRoasts'),
      redis.get('stats:todayRoasts'),
      redis.get('stats:lastVictim'),
    ]);

    // Beri nilai default jika data belum ada di database
    const stats = {
      totalRoasts: Number(totalRoasts) || 0,
      todayRoasts: Number(todayRoasts) || 0,
      lastVictim: lastVictim || 'Belum ada',
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Stats API GET Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil statistik dari database.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json({ error: 'Username diperlukan' }, { status: 400 });
    }

    // Gunakan pipeline untuk efisiensi
    const pipe = redis.pipeline();
    pipe.incr('stats:totalRoasts');
    pipe.incr('stats:todayRoasts');
    pipe.set('stats:lastVictim', username);
    await pipe.exec();

    console.log(`Stats updated for user: ${username}`);

    // Ambil data terbaru setelah diupdate untuk dikirim kembali
    const [totalRoasts, todayRoasts, lastVictim] = await Promise.all([
      redis.get('stats:totalRoasts'),
      redis.get('stats:todayRoasts'),
      redis.get('stats:lastVictim'),
    ]);

    const updatedStats = {
      totalRoasts: Number(totalRoasts),
      todayRoasts: Number(todayRoasts),
      lastVictim: lastVictim,
    };

    return NextResponse.json({
      success: true,
      stats: updatedStats,
    });

  } catch (error) {
    console.error('Stats API POST Error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui statistik di database.' }, { status: 500 });
  }
} 