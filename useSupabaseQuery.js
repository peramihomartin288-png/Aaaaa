import { useState, useEffect } from 'react'
import supabase from './supabase.js'

export default function useSupabaseQuery(tableName, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { 
    filters = {}, 
    orderBy = null, 
    limit = null,
    single = false
  } = options

  useEffect(() => {
    fetchData()
  }, [tableName, JSON.stringify(filters)])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let query = supabase.from(tableName).select('*')
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })
      
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending !== false })
      }
      
      if (limit) {
        query = query.limit(limit)
      }
      
      const { data: result, error: queryError } = single 
        ? await query.single()
        : await query
      
      if (queryError) throw queryError
      
      setData(result)
    } catch (err) {
      setError(err)
      console.error(`Error fetching ${tableName}:`, err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchData()
  }

  return { data, loading, error, refetch }
}