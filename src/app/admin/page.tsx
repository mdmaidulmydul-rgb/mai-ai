'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Shield, LogOut, RefreshCw, Users, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [showKeys, setShowKeys] = useState({})

  useEffect(() => { checkAdmin() }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== ADMIN_EMAIL) { router.push('/login'); return }
    setAuthorized(true)
    fetchUsers()
  }

  const fetchUsers = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    if (data.users) setUsers(data.users)
    setLoading(false)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login') }
  const toggleKey = (id) => setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  const maskKey = (key) => key ? key.slice(0, 8) + '••••••••••••' : '-'

  if (!authorized) return <div className="min-h-screen flex items-center justify-center"><p className="text-white/50">যাচাই হচ্ছে...</p></div>

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/40 text-xs">MAI AI ব্যবস্থাপনা প্যানেল</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchUsers} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-red-400 transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/50 text-xs mb-1">মোট ইউজার</p>
          <p className="text-4xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/50 text-xs mb-1">আজকের রেজিস্ট্রেশন</p>
          <p className="text-4xl font-bold text-primary">
            {users.filter(u => new Date(u.created_at).toDateString() === new Date().toDateString()).length}
          </p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <Users className="w-5 h-5 text-white/60" />
          <h2 className="text-white font-semibold">রেজিস্ট্রেশন তালিকা</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-white/40">লোড হচ্ছে...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-white/40">কোনো ইউজার নেই</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/40 text-xs font-medium">নাম</th>
                  <th className="text-left p-4 text-white/40 text-xs font-medium">ইমেইল</th>
                  <th className="text-left p-4 text-white/40 text-xs font-medium">ফোন</th>
                  <th className="text-left p-4 text-white/40 text-xs font-medium">Groq API Key</th>
                  <th className="text-left p-4 text-white/40 text-xs font-medium">তারিখ</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-4 text-white text-sm font-medium">{user.full_name}</td>
                    <td className="p-4 text-white/70 text-sm">{user.email || '-'}</td>
                    <td className="p-4 text-white/70 text-sm">{user.phone || '-'}</td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2">
                        <code className="text-primary/80 text-xs bg-primary/10 px-2 py-1 rounded">
                          {showKeys[user.id] ? user.groq_api_key : maskKey(user.groq_api_key)}
                        </code>
                        <button onClick={() => toggleKey(user.id)} className="text-white/30 hover:text-white">
                          {showKeys[user.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-white/40 text-xs">{new Date(user.created_at).toLocaleDateString('bn-BD')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
