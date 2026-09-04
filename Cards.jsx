import React, { useState, useEffect } from 'react'
import { getCardsByType, deleteCard } from './api.js'
import Tabs from './Tabs.jsx'
import DataTable from './DataTable.jsx'
import CardForm from './CardForm.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import Modal from './Modal.jsx'
import { formatDate, showToast } from './utils.js'

const cardTabs = [
  { id: 'watakatifu', label: 'Watakatifu', icon: '👼' },
  { id: 'bible_verse', label: 'Bible Verse', icon: '📖' },
  { id: 'masomo', label: 'Masomo', icon: '⛪' },
  { id: 'wimbo', label: 'Wimbo wa Siku', icon: '🎵' }
]

export default function Cards() {
  const [activeTab, setActiveTab] = useState('watakatifu')
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [viewingCard, setViewingCard] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [cardToDelete, setCardToDelete] = useState(null)

  useEffect(() => {
    loadCards()
  }, [activeTab])

  const loadCards = async () => {
    setLoading(true)
    try {
      const data = await getCardsByType(activeTab)
      setCards(data)
    } catch (error) {
      showToast('Imeshindikana kupata cards', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!cardToDelete) return
    
    try {
      await deleteCard(cardToDelete.id)
      showToast('Card imefutwa', 'success')
      loadCards()
    } catch (error) {
      showToast('Imeshindikana kufuta card', 'error')
    }
  }

  const getTitle = (row) => {
    if (activeTab === 'watakatifu') return row.jina
    if (activeTab === 'bible_verse') return row.kichwa
    if (activeTab === 'masomo') return row.jina_la_dominika
    if (activeTab === 'wimbo') return row.jina_la_wimbo
    return row.title
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (row) => <span className="font-semibold">{getTitle(row)}</span>
    },
    {
      key: 'start_date',
      label: 'Start Date',
      render: (row) => formatDate(row.cards?.start_date || row.start_date)
    },
    {
      key: 'end_date',
      label: 'End Date',
      render: (row) => row.cards?.end_date ? formatDate(row.cards.end_date) : 'Mpaka sasa'
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`badge ${row.cards?.is_active !== false ? 'badge-success' : 'badge-gray'}`}>
          {row.cards?.is_active !== false ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => setViewingCard(row)}
            className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"
          >
            👁️
          </button>
          <button
            onClick={() => {
              setEditingCard(row)
              setShowForm(true)
            }}
            className="px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition"
          >
            ✏️
          </button>
          <button
            onClick={() => {
              setCardToDelete(row)
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
    return <LoadingSpinner text="Inapakia Cards..." />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Cards Management</h3>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingCard(null)
            setShowForm(true)
          }}
        >
          ➕ Add New Card
        </button>
      </div>
      
      <Tabs 
        tabs={cardTabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <DataTable columns={columns} data={cards} emptyMessage="Hakuna cards bado" />

      {/* Card Form Modal */}
      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)}
        title={editingCard ? 'Edit Card' : 'Add New Card'}
        maxWidth="600px"
      >
        <CardForm 
          cardType={activeTab}
          editingCard={editingCard}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            loadCards()
          }}
        />
      </Modal>

      {/* View Card Modal */}
      <Modal 
        isOpen={!!viewingCard} 
        onClose={() => setViewingCard(null)}
        title="Card Details"
        maxWidth="600px"
      >
        {viewingCard && (
          <div className="space-y-4">
            {activeTab === 'watakatifu' && (
              <>
                {viewingCard.picha_url && (
                  <img 
                    src={viewingCard.picha_url} 
                    alt={viewingCard.jina}
                    className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
                  />
                )}
                <h4 className="text-xl font-bold text-center">{viewingCard.jina}</h4>
                <div>
                  <h5 className="font-semibold text-sm">📜 Historia</h5>
                  <p className="text-sm text-gray-600">{viewingCard.historia}</p>
                </div>
                {viewingCard.miujiza && (
                  <div>
                    <h5 className="font-semibold text-sm">✨ Miujiza</h5>
                    <p className="text-sm text-gray-600">{viewingCard.miujiza}</p>
                  </div>
                )}
                <div>
                  <h5 className="font-semibold text-sm">🙏 Sala</h5>
                  <p className="text-sm text-gray-600">{viewingCard.sala}</p>
                </div>
              </>
            )}
            
            {activeTab === 'bible_verse' && (
              <>
                <h4 className="text-xl font-bold text-center">{viewingCard.kichwa}</h4>
                <p className="text-center text-sm text-gray-500">{viewingCard.rejea}</p>
                <blockquote className="bg-gray-50 p-4 rounded-lg italic text-sm">
                  "{viewingCard.mstari}"
                </blockquote>
                {viewingCard.funzo && (
                  <div>
                    <h5 className="font-semibold text-sm">📖 Funzo</h5>
                    <p className="text-sm text-gray-600">{viewingCard.funzo}</p>
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'masomo' && (
              <>
                <h4 className="text-xl font-bold text-center">{viewingCard.jina_la_dominika}</h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-sm">Somo la 1</h5>
                    <p className="text-sm">{viewingCard.somo_la_1}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-sm">🎵 Wimbo wa Katikati</h5>
                    <p className="text-sm">{viewingCard.wimbo_wa_katikati}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-sm">Somo la 2</h5>
                    <p className="text-sm">{viewingCard.somo_la_2}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-sm">Halleluya</h5>
                    <p className="text-sm">{viewingCard.shangilio}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-sm">📖 Injili</h5>
                    <p className="text-sm">{viewingCard.injili}</p>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'wimbo' && (
              <>
                <h4 className="text-xl font-bold text-center">{viewingCard.jina_la_wimbo}</h4>
                {viewingCard.audio_url && (
                  <audio controls className="w-full">
                    <source src={viewingCard.audio_url} />
                  </audio>
                )}
                {viewingCard.video_url && (
                  <video controls className="w-full rounded-lg">
                    <source src={viewingCard.video_url} />
                  </video>
                )}
                {viewingCard.description && (
                  <p className="text-sm text-gray-600">{viewingCard.description}</p>
                )}
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Futa Card"
        message="Una uhakika unataka kufuta hii card?"
        confirmText="Futa"
      />
    </div>
  )
}