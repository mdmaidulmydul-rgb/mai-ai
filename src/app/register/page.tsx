'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const [step, setStep] = useState('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: '', phone: '', name: '', password: '' })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.name || !form.password) {
      setError('সব ঘর পূরণ করুন')
      return
    }
    if (form.password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে')
      return
    }
    setLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name, phone: form.phone },
          emailRedirectTo: window.location.origin + '/login'
        }
      })
      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: form.name,
          phone: form.phone
        })
      }
      setStep('verify')
    } catch (err) {
      setError('একটি সমস্যা হয়েছে, আবার চেষ্টা করুন')
    }
    setLoading(false)
  }

  if (step === 'verify') return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">ইমেইল ভেরিফাই করুন</h2>
        <p className="text-white/60 mb-4">
          <span className="text-primary font-medium">{form.email}</span> এ একটি ভেরিফিকেশন লিংক পাঠানো হয়েছে।
        </p>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
          <p className="text-white/50 text-sm">📧 ইমেইল না পেলে Spam folder চেক করুন</p>
        </div>
        <Link href="/login" className="text-primary hover:underline text-sm">লগইন পেজে যান →</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">MAI AI তে যোগ দিন</h1>
          <p className="text-white/50 text-sm mt-1">নতুন অ্যাকাউন্ট তৈরি করুন</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/70 text-sm mb-1.5 block">আপনার নাম</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="MD Maidul Islam"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="text-white/70 text-sm mb-1.5 block">ইমেইল</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="text-white/70 text-sm mb-1.5 block">ফোন নম্বর (ঐচ্ছিক)</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange}
              placeholder="+8801XXXXXXXXX"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="text-white/70 text-sm mb-1.5 block">পাসওয়ার্ড</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                onChange={handleChange} placeholder="কমপক্ষে ৬ অক্ষর"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 text-sm" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-3 font-semibold hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? 'রেজিস্ট্রেশন হচ্ছে...' : 'রেজিস্ট্রেশন করুন'}
          </button>
          <p className="text-center text-white/40 text-sm">
            আগে থেকে অ্যাকাউন্ট আছে?{' '}
            <Link href="/login" className="text-primary hover:underline">লগইন করুন</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
