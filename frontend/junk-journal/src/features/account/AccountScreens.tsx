import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Check, Image, KeyRound, Lock, LogIn, LogOut, Mail, MailCheck, Send, Sparkles, User as UserIcon } from 'lucide-react'
import {
  AuthForm,
  AuthLayout,
  Banner,
  Button,
  Checkbox,
  ConfirmDialog,
  DangerZone,
  PageHeader,
  PasswordField,
  PasswordStrength,
  TextField,
  TextLink,
  useToast,
} from '../../components'
import { AppPage } from '../shared/AppPage'
import { useAuth } from '../../hooks/useAuth'
import { useLinkProps } from '../../hooks/useLinkProps'
import { paths } from '../../routes/paths'
import { currentUser, currentUserName } from '../../services/mockData'
import s from '../shared/screens.module.css'

/* ---------- 1.1 Sign in ---------- */
export function SignInScreen({ wrongCredentials = false }: { wrongCredentials?: boolean }) {
  const { signIn } = useAuth()
  const link = useLinkProps()
  const [email, setEmail] = useState('mira@example.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // The GuestOnly guard redirects once signed in (back to the page the user wanted).
  async function submit() {
    setLoading(true)
    await signIn()
  }

  return (
    <AuthLayout accent="welcome back!" title="Sign in to your journal" lead="Pick up where you left off.">
      <AuthForm onSubmit={submit}>
        {wrongCredentials && (
          <Banner kind="error" title="That email and password don’t match">
            Check them and try again, or reset your password.
          </Banner>
        )}
        <TextField label="Email" type="email" autoComplete="email" leadingIcon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordField label="Password" autoComplete="current-password" leadingIcon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className={s.rowBetween}>
          <Checkbox label="Keep me signed in" defaultChecked />
          <TextLink {...link(paths.forgotPassword)}>Forgot password?</TextLink>
        </div>
        <Button type="submit" variant="primary" icon={LogIn} fullWidth loading={loading}>
          Sign in
        </Button>
        <p className={s.small} style={{ textAlign: 'center' }}>
          New here? <TextLink {...link(paths.signUp)}>Create an account</TextLink>
        </p>
      </AuthForm>
    </AuthLayout>
  )
}

/* ---------- 1.2 Create account ---------- */
export function CreateAccountScreen({ emailTaken = false }: { emailTaken?: boolean }) {
  const { signIn } = useAuth()
  const link = useLinkProps()
  const [password, setPassword] = useState('')

  // Signing in triggers the GuestOnly redirect to the dashboard.
  async function submit() {
    await signIn()
  }

  return (
    <AuthLayout accent="nice to meet you" title="Start your journal" lead="Make notebooks, stickers and tapes that are all yours.">
      <AuthForm onSubmit={submit}>
        <TextField label="Name" autoComplete="name" leadingIcon={UserIcon} defaultValue={currentUserName} />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          leadingIcon={Mail}
          defaultValue={currentUser.email}
          error={emailTaken ? 'That email already has an account. Sign in instead?' : undefined}
        />
        <PasswordField
          label="Password"
          autoComplete="new-password"
          leadingIcon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helper="At least 8 characters, with one number."
        />
        {password && <PasswordStrength password={password} />}
        <Checkbox label="I agree to the terms and privacy policy" defaultChecked />
        <Button type="submit" variant="primary" icon={Sparkles} fullWidth>
          Create account
        </Button>
        <p className={s.small} style={{ textAlign: 'center' }}>
          Already have an account? <TextLink {...link(paths.signIn)}>Sign in</TextLink>
        </p>
      </AuthForm>
    </AuthLayout>
  )
}

/* ---------- 1.3 Forgot password ---------- */
export function ForgotPasswordScreen({ sent: initiallySent = false }: { sent?: boolean }) {
  const link = useLinkProps()
  const [sent, setSent] = useState(initiallySent)
  if (sent) {
    return (
      <AuthLayout accent="on its way" title="Check your inbox" lead={`We sent a reset link to ${currentUser.email}. It expires in 30 minutes.`}>
        <div className={s.stack}>
          <Banner title="Didn’t get it?">Check your spam folder, or send the link again.</Banner>
          <Button icon={MailCheck}>Resend link</Button>
          {/* Mock only: stands in for the link in the email. */}
          <TextLink {...link(paths.resetPassword())}>Open the reset link (demo)</TextLink>
          <p className={s.small}>
            <TextLink {...link(paths.signIn)}>Back to sign in</TextLink>
          </p>
        </div>
      </AuthLayout>
    )
  }
  return (
    <AuthLayout accent="it happens!" title="Forgot your password?" lead="Enter your email and we’ll send you a link to choose a new one.">
      <AuthForm onSubmit={() => setSent(true)}>
        <TextField label="Email" type="email" autoComplete="email" leadingIcon={Mail} defaultValue={currentUser.email} />
        <Button type="submit" variant="primary" icon={Send} fullWidth>
          Send reset link
        </Button>
        <p className={s.small} style={{ textAlign: 'center' }}>
          <ArrowLeft size={14} aria-hidden /> <TextLink {...link(paths.signIn)}>Back to sign in</TextLink>
        </p>
      </AuthForm>
    </AuthLayout>
  )
}

/* ---------- 1.4 Reset password ---------- */
export function ResetPasswordScreen({ expired = false }: { expired?: boolean }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [password, setPassword] = useState('Kyoto2026!')
  const [confirm, setConfirm] = useState('Kyoto2026!')
  if (expired) {
    return (
      <AuthLayout accent="oh no" title="This link has expired" lead="Reset links last 30 minutes. Ask for a new one and we’ll send it right away.">
        <div className={s.stack}>
          <Banner kind="error" title="Link expired or already used" />
          <Button variant="primary" icon={Send} fullWidth onClick={() => navigate(paths.forgotPassword)}>
            Send a new link
          </Button>
        </div>
      </AuthLayout>
    )
  }
  const mismatch = !!confirm && confirm !== password
  return (
    <AuthLayout accent="fresh start" title="Choose a new password">
      <AuthForm
        onSubmit={() => {
          if (mismatch) return
          toast.show({ kind: 'success', message: 'Password saved. Sign in with your new password.' })
          navigate(paths.signIn, { replace: true })
        }}
      >
        <PasswordField label="New password" autoComplete="new-password" leadingIcon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} />
        <PasswordStrength password={password} />
        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          leadingIcon={Lock}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={mismatch ? 'The passwords don’t match.' : undefined}
        />
        <Button type="submit" variant="primary" icon={Check} fullWidth>
          Save password
        </Button>
      </AuthForm>
    </AuthLayout>
  )
}

/* ---------- 1.5 Account settings ---------- */
export function AccountSettingsScreen() {
  const toast = useToast()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function leave() {
    await signOut()
    navigate(paths.signIn, { replace: true })
  }

  return (
    <AppPage>
      <PageHeader title="Account settings" size="h1" />
      <div className={s.twoCol}>
        <div className={`${s.stackLg} ${s.grow}`}>
          <section className={s.panel} aria-labelledby="profile-title">
            <h2 id="profile-title" className={s.panelTitle}>
              Profile
            </h2>
            <div className={s.row}>
              <span
                aria-hidden
                style={{ display: 'grid', placeItems: 'center', width: 64, height: 64, borderRadius: '50%', background: 'var(--color-green)', color: 'var(--color-cream)', border: '3px solid var(--color-yellow)', font: '700 22px/1 var(--font-ui)' }}
              >
                {currentUser.initials}
              </span>
              <Button icon={Image}>Change photo</Button>
            </div>
            <div className={s.grid2}>
              <TextField label="Name" defaultValue={currentUserName} />
              <TextField label="Email" type="email" defaultValue={currentUser.email} />
            </div>
            <div className={s.row} style={{ justifyContent: 'flex-end' }}>
              <Button variant="primary" icon={Check} onClick={() => toast.show({ kind: 'success', message: 'Profile saved.' })}>
                Save changes
              </Button>
            </div>
          </section>
          <section className={s.panel} aria-labelledby="password-title">
            <h2 id="password-title" className={s.panelTitle}>
              Password
            </h2>
            <div className={s.grid2}>
              <PasswordField label="Current password" autoComplete="current-password" defaultValue="••••••••" />
              <PasswordField label="New password" autoComplete="new-password" />
            </div>
            <div className={s.row} style={{ justifyContent: 'flex-end' }}>
              <Button icon={KeyRound}>Update password</Button>
            </div>
          </section>
        </div>
        <div className={s.sideCol}>
          <section className={s.panel} aria-labelledby="session-title">
            <h2 id="session-title" className={s.panelTitle}>
              Session
            </h2>
            <p className={s.small}>Signed in on this computer.</p>
            <Button icon={LogOut} onClick={leave}>
              Sign out
            </Button>
          </section>
          <DangerZone
            title="Delete account"
            body="Removes every notebook, sticker and tape. This can’t be undone."
            actionLabel="Delete account"
            onAction={() => setConfirmDelete(true)}
          />
        </div>
      </div>
      <ConfirmDialog
        open={confirmDelete}
        title="Delete your account?"
        body="Every notebook, page, sticker, tape and upload will be permanently deleted."
        confirmLabel="Delete account"
        onConfirm={async () => {
          setConfirmDelete(false)
          await leave()
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </AppPage>
  )
}
