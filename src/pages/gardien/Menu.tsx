import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import api from '../../lib/api'

const LANGS = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
]

export default function GardienMenu() {
  const { user } = useAuthStore()
  const { i18n } = useTranslation()

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwError, setPwError] = useState('')

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'G'

  async function handleChangePassword() {
    if (!currentPw || !newPw) return
    setPwLoading(true)
    setPwError('')
    try {
      await api.post('/api/v1/auth/change-password', {
        currentPassword: currentPw,
        newPassword: newPw,
      })
      setPwSuccess(true)
      setCurrentPw('')
      setNewPw('')
      setTimeout(() => {
        setPwSuccess(false)
        setShowPasswordForm(false)
      }, 2000)
    } catch (e: any) {
      setPwError(e?.response?.data?.message ?? 'Failed to update password.')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="px-6 pb-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-headline text-2xl font-black text-primary tracking-tight">More</h2>
        <p className="text-on-surface-variant text-sm font-medium">Profile, settings, and preferences</p>
      </div>

      {/* Profile card */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 ambient-depth flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ background: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)' }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-base text-on-surface truncate">{user?.name ?? 'Gardien'}</p>
          <p className="text-sm text-on-surface-variant truncate">{user?.email ?? ''}</p>
          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary-container/20 text-on-primary-container mt-1.5 inline-block">
            Caretaker
          </span>
        </div>
      </div>

      {/* Language switcher */}
      <div className="bg-surface-container-lowest rounded-2xl ambient-depth overflow-hidden">
        <div className="px-5 pt-4 pb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-on-surface-variant">language</span>
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Language</p>
        </div>
        <div className="flex">
          {LANGS.map((lang, idx) => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                idx > 0 ? 'border-l border-surface-container-high' : ''
              } ${
                i18n.language === lang.code
                  ? 'text-white'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              style={
                i18n.language === lang.code
                  ? { background: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)' }
                  : {}
              }
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div className="bg-surface-container-lowest rounded-2xl ambient-depth overflow-hidden">
        <button
          onClick={() => setShowPasswordForm((v) => !v)}
          className="w-full px-5 py-4 flex items-center gap-3 hover:bg-surface-container transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined">lock</span>
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm text-on-surface">Change Password</p>
            <p className="text-xs text-on-surface-variant">Update your account password</p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-sm">
            {showPasswordForm ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {showPasswordForm && (
          <div className="px-5 pb-5 space-y-3 border-t border-surface-container">
            {pwSuccess && (
              <div className="mt-3 bg-tertiary-container/20 text-on-tertiary-container text-sm font-medium px-4 py-2 rounded-xl">
                Password updated successfully!
              </div>
            )}
            {pwError && (
              <div className="mt-3 bg-error-container/20 text-error text-sm font-medium px-4 py-2 rounded-xl">
                {pwError}
              </div>
            )}
            <div className="pt-3 space-y-1.5">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Current Password
              </label>
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={pwLoading || !currentPw || !newPw}
              className="w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60 active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)' }}
            >
              {pwLoading ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        )}
      </div>

      {/* About */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 ambient-depth space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">About</p>
        <div>
          {[
            { label: 'Application', value: 'Darouna S.G.I.R.' },
            { label: 'Version',     value: '2.0.0' },
            { label: 'Role',        value: 'Caretaker (Gardien)' },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between py-3 border-b border-surface-container last:border-0"
            >
              <span className="text-sm text-on-surface-variant">{row.label}</span>
              <span className="text-sm font-semibold text-on-surface">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
