import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import '@/styles/globals.css'
import EndSessionDialog from '@/components/EndSessionDialog'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('Key pressed:', event.key, 'Code:', event.code)
      if (event.key === 'End' || event.code === 'End') {
        event.preventDefault()
        console.log('End key detected, opening dialog')
        setIsDialogOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [])

  const handleCancel = () => {
    setIsDialogOpen(false)
  }

  const handleEnd = () => {
    setIsDialogOpen(false)
    window.location.href = 'about:blank'
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    window.close()
  }

  return (
    <SessionProvider session={session}>
      <EndSessionDialog
        isOpen={isDialogOpen}
        onCancel={handleCancel}
        onEnd={handleEnd}
        onClose={handleClose}
      />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
