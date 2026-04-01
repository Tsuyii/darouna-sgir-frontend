import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../lib/auth'

const ROLE_META = {
  syndic:   { icon: 'business_center', label: 'Syndic' },
  resident: { icon: 'home',            label: 'Resident' },
  gardien:  { icon: 'security',        label: 'Gardien' },
} as const

type Role = keyof typeof ROLE_META

export default function Register() {
  const { role } = useParams<{ role: string }>()
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const meta = ROLE_META[(role as Role) ?? 'resident'] ?? ROLE_META.resident

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.register(name, email, password, phone, role ?? 'resident')
      // Auto-login after successful registration
      await login(email, password)
      navigate(`/${role}`, { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
      {/* Background blobs */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-1/2 bg-primary-container/5 rounded-bl-full blur-[120px]" />
      <div className="fixed bottom-0 left-0 -z-10 w-1/4 h-1/3 bg-tertiary-container/5 rounded-tr-full blur-[100px]" />

      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 pt-12 pb-4">
        <button
          onClick={() => navigate(`/login/${role}`)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          <span className="text-sm font-semibold">Back</span>
        </button>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-black text-primary tracking-tighter font-headline">Darouna</span>
          <div className="h-0.5 w-6 bg-gradient-to-r from-[#064E3B] to-[#10B981] rounded-full" />
        </div>
        <div className="w-16" />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full py-8">
        {/* Role badge */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#064E3B] to-[#10B981] flex items-center justify-center shadow-lg shadow-emerald-900/20 glass-glow">
            <span
              className="material-symbols-outlined text-4xl text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {meta.icon}
            </span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold font-headline tracking-tight text-on-background">
              Create account
            </h1>
            <p className="text-on-surface-variant text-sm mt-1 font-medium">
              Joining as <span className="text-primary font-bold">{meta.label}</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl text-on-surface-variant/50">
                person
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:border-primary/40 focus:outline-none text-on-surface placeholder:text-on-surface-variant/40 font-medium transition-colors ambient-depth"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl text-on-surface-variant/50">
                mail
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:border-primary/40 focus:outline-none text-on-surface placeholder:text-on-surface-variant/40 font-medium transition-colors ambient-depth"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl text-on-surface-variant/50">
                phone
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+213 6XX XXX XXX"
                className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:border-primary/40 focus:outline-none text-on-surface placeholder:text-on-surface-variant/40 font-medium transition-colors ambient-depth"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl text-on-surface-variant/50">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="w-full pl-12 pr-12 py-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:border-primary/40 focus:outline-none text-on-surface placeholder:text-on-surface-variant/40 font-medium transition-colors ambient-depth"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-error-container/20 rounded-xl border border-error/10">
              <span className="material-symbols-outlined text-error text-xl">error</span>
              <p className="text-sm text-on-error-container font-medium">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#064E3B] to-[#10B981] text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 glass-glow hover:brightness-110 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                Creating account…
              </>
            ) : (
              <>
                Create Account
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm font-medium text-on-surface-variant">
          Already have an account?{' '}
          <Link to={`/login/${role}`} className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  )
}
