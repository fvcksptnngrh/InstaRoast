'use client'

import { motion } from 'framer-motion'
import { Users, Flame, TrendingUp, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

interface StatsBoxProps {
  totalRoasts: number
  todayRoasts: number
  topRoaster: string
  averageRating: number
}

export default function StatsBox({ 
  totalRoasts = 145, 
  todayRoasts = 23, 
  topRoaster = "cristiano", 
  averageRating = 4.8 
}: StatsBoxProps) {
  const [count, setCount] = useState(0)
  const [todayCount, setTodayCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(totalRoasts)
      setTodayCount(todayRoasts)
    }, 500)

    return () => clearTimeout(timer)
  }, [totalRoasts, todayRoasts])

  const stats = [
    {
      icon: Users,
      label: "Total Di-Roast",
      value: count,
      suffix: " orang",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Flame,
      label: "Hari Ini",
      value: todayCount,
      suffix: " roast",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: TrendingUp,
      label: "Top Roaster",
      value: topRoaster,
      suffix: "",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Zap,
      label: "Rating Rata-rata",
      value: averageRating,
      suffix: "/5.0",
      color: "from-yellow-500 to-orange-600"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          📊 Statistik Roast
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Lihat berapa banyak orang yang sudah kita roast! 🔥
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              {stat.suffix}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl text-white text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className="w-5 h-5" />
          <span className="font-bold text-lg">🔥 Hot Streak! 🔥</span>
        </div>
        <p className="text-sm opacity-90">
          {todayCount} roast hari ini! Teruskan semangat roasting! 💪
        </p>
      </motion.div>
    </motion.div>
  )
} 