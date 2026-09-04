import React, { useState, useEffect } from 'react'
import { getDashboardStats, getRecentActivity } from './api.js'
import { getCloudinaryUsage, getUploadCareUsage } from './media.js'
import supabase from './supabase.js'
import DashboardCard from './DashboardCard.jsx'
import StorageCard from './StorageCard.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import { formatDate, formatTime, formatBytes, formatNumber } from './utils.js'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [supabaseUsage, setSupabaseUsage] = useState(null)
  const [cloudinaryUsage, setCloudinaryUsage] = useState(null)
  const [uploadcareUsage, setUploadcareUsage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    try {
      const [statsData, activityData, supabaseData, cloudData, uploadData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(10),
        getSupabaseUsage(),
        getCloudinaryUsage(),
        getUploadCareUsage()
      ])
      
      setStats(statsData)
      setRecentActivity(activityData)
      setSupabaseUsage(supabaseData)
      setCloudinaryUsage(cloudData)
      setUploadcareUsage(uploadData)
    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSupabaseUsage = async () => {
    try {
      // Get database size estimate
      const [usersCount, postsCount, mediaCount] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('media_assets').select('*', { count: 'exact', head: true })
      ])
      
      // Estimate storage (rough)
      const estimatedBytes = (usersCount.count || 0) * 1000 + (postsCount.count || 0) * 5000 + (mediaCount.count || 0) * 100000
      
      return {
        usedBytes: estimatedBytes,
        totalBytes: 1000000000, // 1GB free tier
        itemCount: (usersCount.count || 0) + (postsCount.count || 0) + (mediaCount.count || 0)
      }
    } catch (error) {
      return null
    }
  }

  if (loading) {
    return <LoadingSpinner text="Inapakia Dashboard..." />
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Total Users" 
          value={formatNumber(stats?.totalUsers)} 
          icon="👥"
          color="#1e3a5f"
        />
        <DashboardCard 
          title="Total Posts" 
          value={formatNumber(stats?.totalPosts)} 
          icon="📝"
          color="#f59e0b"
        />
        <DashboardCard 
          title="Downloads Leo" 
          value={formatNumber(stats?.downloadsToday)} 
          icon="⬇️"
          color="#10b981"
        />
        <DashboardCard 
          title="Likes Leo" 
          value={formatNumber(stats?.likesToday)} 
          icon="❤️"
          color="#ef4444"
        />
      </div>

      {/* Storage Monitoring */}
      <div>
        <h3 className="text-lg font-bold mb-4">📊 Storage Monitoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StorageCard 
            providerName="Supabase"
            icon="🗄️"
            usedBytes={supabaseUsage?.usedBytes || 0}
            totalBytes={supabaseUsage?.totalBytes || 1000000000}
            percentage={((supabaseUsage?.usedBytes || 0) / (supabaseUsage?.totalBytes || 1000000000)) * 100}
          />
          
          <StorageCard 
            providerName="Cloudinary"
            icon="☁️"
            usedBytes={cloudinaryUsage?.storage?.usage || 0}
            totalBytes={cloudinaryUsage?.storage?.limit || 1}
            percentage={cloudinaryUsage?.storage?.used_percent || 0}
          />
          
          <StorageCard 
            providerName="UploadCare"
            icon="📤"
            usedBytes={uploadcareUsage?.used || 0}
            totalBytes={uploadcareUsage?.total || 1}
            percentage={((uploadcareUsage?.used || 0) / (uploadcareUsage?.total || 1)) * 100}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-card">
        <h3 className="text-lg font-bold mb-4">🕐 Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-gray-400 text-center py-6">Hakuna activity bado</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {activity.event_type === 'like' ? '❤️' : 
                     activity.event_type === 'comment' ? '💬' : 
                     activity.event_type === 'download' ? '⬇️' : 
                     activity.event_type === 'registration' ? '👤' : '📄'}
                  </span>
                  <div>
                    <p className="text-sm font-semibold capitalize">{activity.event_type}</p>
                    <p className="text-xs text-gray-500">
                      {activity.users?.full_name || 'Unknown User'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs">{formatDate(activity.created_at)}</p>
                  <p className="text-xs text-gray-400">{formatTime(activity.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="dashboard-card hover:shadow-lg transition text-center cursor-pointer">
          <span className="text-3xl block mb-2">📝</span>
          <span className="font-semibold text-sm">Create Post</span>
        </button>
        <button className="dashboard-card hover:shadow-lg transition text-center cursor-pointer">
          <span className="text-3xl block mb-2">🎴</span>
          <span className="font-semibold text-sm">Add Daily Card</span>
        </button>
        <button className="dashboard-card hover:shadow-lg transition text-center cursor-pointer">
          <span className="text-3xl block mb-2">🔔</span>
          <span className="font-semibold text-sm">Send Notification</span>
        </button>
      </div>
    </div>
  )
}