/**
 * Admin Page
 * Main admin dashboard with navigation to admin features
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FeatureManagement } from '@/components/admin'

type AdminTab = 'features' | 'users' | 'analytics'

export default function AdminPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AdminTab>('features')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/select-child')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-xl">←</span>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage MathFoundry settings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('features')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'features'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Feature Management
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>
        {activeTab === 'features' && <FeatureManagement />}
        {activeTab === 'users' && (
          <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <span className="text-4xl">👥</span>
              <h3 className="mt-4 font-semibold text-gray-900">User Management</h3>
              <p className="mt-2 text-gray-500">Coming soon - manage users and subscriptions</p>
            </div>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <span className="text-4xl">📊</span>
              <h3 className="mt-4 font-semibold text-gray-900">Analytics Dashboard</h3>
              <p className="mt-2 text-gray-500">Coming soon - view platform metrics</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
