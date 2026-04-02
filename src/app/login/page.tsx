'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('ইমেইল ও পাসওয়ার্ড দিন'); return }
    setLoading(true)
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: form.email, password: form.password,
    })
    if (authError) { setError('ইমেইল বা পাসওয়ার্ড সঠিক নয়'); setLoading(false); return }
    if (data.user && !data.user.email_confirmed_at) {
      setError('ইমেইল ভেরিফাই করুন প্রথমে।'); setLoading(false); return
    }
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">MAI AI তে লগইন</h1>
          <p className="text-white/50 text-sm mt-1">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/70 text-sm mb-1.5 block">ইমেইল</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="example@gmail.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="text-white/70 text-sm mb-1.5 block">পাসওয়ার্ড</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-3 font-semibold hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </button>
          <p className="text-center text-white/40 text-sm">অ্যাকাউন্ট নেই? <Link href="/register" className="text-primary hover:underline">রেজিস্ট্রেশন করুন</Link></p>
        </form>
      </div>
    </div>
  )
}
