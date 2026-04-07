// @ts-nocheck
import { getProviders } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import styles from '@/styles/Login.module.css'

export default function LoginPage({
  providers,
}: {
  providers: Record<string, any>
}) {
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h1 className={styles.title}>🎮 MARK'S ARCADES 🎮</h1>
          <p className={styles.subtitle}>SERVER-SIDE AUTHENTICATION</p>
        </div>

        <div className={styles.loginContent}>
          <h2 className={styles.heading}>SIGN IN</h2>
          <p className={styles.description}>
            Choose your authentication method
          </p>

          <div className={styles.providersGrid}>
            {Object.values(providers || {}).map((provider: any) => (
              <form
                key={provider.name}
                method="post"
                action="/api/auth/signin"
                style={{ margin: 0 }}
              >
                <input type="hidden" name="provider" value={provider.id} />
                <input type="hidden" name="callbackUrl" value="/" />
                <button
                  type="submit"
                  className={styles.providerButton}
                  title={`Sign in with ${provider.name}`}
                >
                  <span className={styles.providerIcon}>
                    {provider.id === 'github' && '🐙'}
                    {provider.id === 'google' && '🔵'}
                    {provider.id === 'credentials' && '✉️'}
                  </span>
                  <span className={styles.providerName}>
                    Sign in with {provider.name}
                  </span>
                </button>
              </form>
            ))}

            <form
              method="post"
              action="/api/auth/signin"
              style={{ margin: 0 }}
            >
              <input type="hidden" name="provider" value="guest" />
              <input type="hidden" name="callbackUrl" value="/" />
              <button
                type="submit"
                className={styles.providerButton}
                title="Sign in as Guest"
              >
                <span className={styles.providerIcon}>👤</span>
                <span className={styles.providerName}>Sign in as Guest</span>
              </button>
            </form>
          </div>

          <div className={styles.divider}>OR</div>

          <form
            method="post"
            action="/api/auth/signin"
            className={styles.emailForm}
          >
            <input type="hidden" name="provider" value="credentials" />
            <input type="hidden" name="callbackUrl" value="/" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className={styles.emailInput}
            />
            <button type="submit" className={styles.submitButton}>
              SIGN IN
            </button>
          </form>
        </div>

        <div className={styles.footer}>
          <p>Server-side authentication powered by NextAuth.js</p>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If user is already logged in, redirect to home
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const providers = await getProviders()

  return {
    props: {
      providers: providers || {},
    },
  }
}
