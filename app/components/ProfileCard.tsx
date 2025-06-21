'use client'

import { motion } from 'framer-motion'
import { Users, UserPlus, Image as ImageIcon, Shield, CheckCircle } from 'lucide-react'
import Image from 'next/image'

interface ProfileData {
  username: string
  fullName: string
  bio: string
  followers: number
  following: number
  posts: number
  profilePic: string
  isPrivate: boolean
  isVerified: boolean
}

interface ProfileCardProps {
  profile: ProfileData
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const statItems = [
    { icon: ImageIcon, label: 'postingan', value: formatNumber(profile.posts) },
    { icon: Users, label: 'pengikut', value: formatNumber(profile.followers) },
    { icon: UserPlus, label: 'mengikuti', value: formatNumber(profile.following) }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        {/* Profile Picture */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="relative flex-shrink-0"
        >
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg ring-2 ring-primary-500/50">
            <Image
              src={profile.profilePic}
              alt={profile.fullName}
              width={112}
              height={112}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          {profile.isVerified && (
            <div className="absolute bottom-0 right-0 bg-primary-500 rounded-full p-1.5 border-2 border-white dark:border-gray-800">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          )}
        </motion.div>

        {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 mb-1"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {profile.fullName}
            </h2>
            {profile.isPrivate && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                <Shield className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                <span>Private</span>
              </div>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-secondary-500 dark:text-secondary-400 text-lg mb-3 font-mono"
          >
            @{profile.username}
          </motion.p>

          {profile.bio && (
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 dark:text-gray-300 mb-4 max-w-prose"
            >
              {profile.bio}
            </motion.p>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 text-sm"
          >
            {statItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                <div>
                  <span className="font-bold text-gray-800 dark:text-white">
                    {item.value}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
} 