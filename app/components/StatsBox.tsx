'use client'

import { Flame, Users, Skull } from "lucide-react"

interface StatsBoxProps {
  totalRoasts: number
  todayRoasts: number
  lastVictim: string
}

export default function StatsBox({
  totalRoasts,
  todayRoasts,
  lastVictim,
}: StatsBoxProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6 text-white border border-gray-700">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        
        <div className="flex flex-col items-center justify-center p-3 bg-gray-700 bg-opacity-50 rounded-lg">
          <Flame className="w-8 h-8 text-orange-400 mb-2" />
          <p className="text-sm text-gray-300">Total Akun Di-roasting</p>
          <p className="text-2xl md:text-3xl font-bold">
            {totalRoasts.toLocaleString('id-ID')}
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-3 bg-gray-700 bg-opacity-50 rounded-lg">
          <Users className="w-8 h-8 text-teal-400 mb-2" />
          <p className="text-sm text-gray-300">Roasting Hari Ini</p>
          <p className="text-2xl md:text-3xl font-bold">
            {todayRoasts.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-3 bg-gray-700 bg-opacity-50 rounded-lg">
          <Skull className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-sm text-gray-300">Korban Terakhir</p>
          <p className="text-2xl md:text-3xl font-bold truncate">
            {lastVictim}
          </p>
        </div>
      </div>
    </div>
  )
} 