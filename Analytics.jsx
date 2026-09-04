import React, { useState, useEffect } from 'react'
import { getAnalyticsEvents, getDashboardStats } from './api.js'
import Chart from './Chart.jsx'
import DashboardCard from './DashboardCard.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import { formatNumber } from './utils.js'

export default function Analytics() {
  const [period, setPeriod] = useState(30)
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [period])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const [statsData, eventsData] = await Promise.all([
        getDashboardStats(),
        getAnalyticsEvents('page_view', period)
      ])
      
      setStats(statsData)
      setEvents(eventsData)
    } catch (error) {
      console.error('Analytics error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const date = new Date(event.created_at).toLocaleDateString('sw-TZ', { day: '2-digit', month: 'short' })
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(groupedEvents).map(([name, value]) => ({
    name,
    value
  }))

  const engagementData = [
    { name: 'Likes', value: stats?.likesToday || 0 },
    { name: 'Comments', value: stats?.commentsToday || 0 },
    { name: 'Downloads', value: stats?.downloadsToday || 0 }
  ]

  if (loading) {
    return <LoadingSpinner text="Inapakia Analytics..." />
  }

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex gap-2">
        {[
          { id: 7, label: '7 Days' },
          { id: 30, label: '30 Days' },
          { id: 90, label: '90 Days' }
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === p.id 
                ? 'bg-blue-900 text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Users" value={formatNumber(stats?.totalUsers)} icon="👥" color="#1e3a5f" />
        <DashboardCard title="Total Posts" value={formatNumber(stats?.totalPosts)} icon="📝" color="#f59e0b" />
        <DashboardCard title="Downloads Leo" value={formatNumber(stats?.downloadsToday)} icon="⬇️" color="#10b981" />
        <DashboardCard title="Likes Leo" value={formatNumber(stats?.likesToday)} icon="❤️" color="#ef4444" />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h4 className="font-semibold mb-4">📈 Page Views ({period} days)</h4>
          <Chart type="line" data={chartData} dataKey="value" xKey="name" color="#1e3a5f" />
        </div>
        
        <div className="dashboard-card">
          <h4 className="font-semibold mb-4">📊 Today's Engagement</h4>
          <Chart type="bar" data={engagementData} dataKey="value" xKey="name" color="#f59e0b" />
        </div>
      </div>
    </div>
  )
}