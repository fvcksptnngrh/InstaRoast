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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 card-shadow"
    >
      <div className="flex items-start gap-6">
        {/* Profile Picture */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="relative"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
            <Image
              src={profile.profilePic}
              alt={profile.fullName}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          {profile.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </motion.div>

        {/* Profile Info */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mb-2"
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
              {profile.fullName}
            </h2>
            {profile.isPrivate && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                <Shield className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                <span className="text-xs text-gray-600 dark:text-gray-300">Private</span>
              </div>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-300 mb-4"
          >
            @{profile.username}
          </motion.p>

          {profile.bio && (
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-700 dark:text-gray-200 mb-4"
            >
              {profile.bio}
            </motion.p>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-6"
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="font-semibold text-gray-800 dark:text-white">
                {formatNumber(profile.posts)}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-300">postingan</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="font-semibold text-gray-800 dark:text-white">
                {formatNumber(profile.followers)}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-300">pengikut</span>
            </div>
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="font-semibold text-gray-800 dark:text-white">
                {formatNumber(profile.following)}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-300">mengikuti</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
} 