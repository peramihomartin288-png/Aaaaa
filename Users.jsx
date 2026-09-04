import React, { useState, useEffect } from 'react'
import { getAllUsers, toggleUserStatus, deleteUser, getUserDetails } from './api.js'
import DataTable from './DataTable.jsx'
import SearchBar from './SearchBar.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import Modal from './Modal.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import Pagination from './Pagination.jsx'
import { formatDate, getInitials, getAvatarColor, showToast } from './utils.js'

export default function Users() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    if (search) {
      setFilteredUsers(
        users.filter(u => 
          u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          u.phone?.includes(search) ||
          u.parokia?.toLowerCase().includes(search.toLowerCase()) ||
          u.jimbo?.toLowerCase().includes(search.toLowerCase())
        )
      )
    } else {
      setFilteredUsers(users)
    }
    setCurrentPage(1)
  }, [search, users])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getAllUsers()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      showToast('Imeshindikana kupata users', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleViewUser = async (user) => {
    try {
      const details = await getUserDetails(user.id)
      setSelectedUser(user)
      setUserDetails(details)
    } catch (error) {
      showToast('Imeshindikana kupata user details', 'error')
    }
  }

  const handleToggleStatus = async (user) => {
    try {
      await toggleUserStatus(user.id, !user.is_active)
      showToast(
        user.is_active ? 'User amebaniwa' : 'User ameruhusiwa',
        'success'
      )
      loadUsers()
    } catch (error) {
      showToast('Imeshindikana kubadilisha status', 'error')
    }
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    
    try {
      await deleteUser(userToDelete.id)
      showToast('User amefutwa', 'success')
      loadUsers()
    } catch (error) {
      showToast('Imeshindikana kufuta user', 'error')
    }
  }

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const columns = [
    {
      key: 'avatar',
      label: '',
      render: (row) => (
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ background: getAvatarColor(row.full_name) }}
        >
          {getInitials(row.full_name)}
        </div>
      )
    },
    { key: 'full_name', label: 'Jina' },
    { key: 'phone', label: 'Phone' },
    { key: 'parokia', label: 'Parokia' },
    { key: 'jimbo', label: 'Jimbo' },
    {
      key: 'created_at',
      label: 'Alijiunga',
      render: (row) => formatDate(row.created_at)
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`badge ${row.is_active ? 'badge-success' : 'badge-error'}`}>
          {row.is_active ? 'Active' : 'Banned'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleViewUser(row) }}
            className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"
          >
            👁️
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleStatus(row) }}
            className={`px-2 py-1 text-xs rounded transition ${
              row.is_active 
                ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' 
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {row.is_active ? '🚫' : '✅'}
          </button>
          <button
            onClick={(e) => { 
              e.stopPropagation() 
              setUserToDelete(row)
              setShowDeleteConfirm(true)
            }}
            className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition"
          >
            🗑️
          </button>
        </div>
      )
    }
  ]

  if (loading) {
    return <LoadingSpinner text="Inapakia Users..." />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <SearchBar 
          placeholder="Tafuta kwa jina, phone, parokia..."
          value={search}
          onChange={setSearch}
        />
        <p className="text-sm text-gray-500">
          Jumla: {filteredUsers.length} users
        </p>
      </div>
      
      <DataTable columns={columns} data={paginatedUsers} />
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
      />

      {/* User Details Modal */}
      <Modal 
        isOpen={!!selectedUser} 
        onClose={() => setSelectedUser(null)}
        title="User Details"
        maxWidth="550px"
      >
        {userDetails?.user && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: getAvatarColor(userDetails.user.full_name) }}
              >
                {getInitials(userDetails.user.full_name)}
              </div>
              <div>
                <h4 className="text-lg font-bold">{userDetails.user.full_name}</h4>
                <p className="text-sm text-gray-500">{userDetails.user.phone || 'No phone'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Parokia</p>
                <p className="font-semibold text-sm">{userDetails.user.parokia || '-'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Jimbo</p>
                <p className="font-semibold text-sm">{userDetails.user.jimbo || '-'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xl font-bold text-blue-700">{userDetails.stats.posts}</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xl font-bold text-red-600">{userDetails.stats.likes}</p>
                <p className="text-xs text-gray-500">Likes</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xl font-bold text-green-600">{userDetails.stats.comments}</p>
                <p className="text-xs text-gray-500">Comments</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-xl font-bold text-orange-600">{userDetails.stats.downloads}</p>
                <p className="text-xs text-gray-500">Downloads</p>
              </div>
            </div>
            
            {userDetails.points && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">🏆 Points</h5>
                <div className="flex justify-between text-sm">
                  <span>Total: <strong>{userDetails.points.total_points}</strong></span>
                  <span>Streak: <strong>{userDetails.points.current_streak} days</strong></span>
                  <span>Longest: <strong>{userDetails.points.longest_streak} days</strong></span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Futa User"
        message={`Una uhakika unataka kumfuta ${userToDelete?.full_name}?`}
        confirmText="Futa"
      />
    </div>
  )
}