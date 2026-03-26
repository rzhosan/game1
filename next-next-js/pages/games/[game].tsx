import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import styles from '@/styles/Game.module.css'

interface GamePageProps {
  gameId: string
  gameTitle: string
  gameIcon: string
  gameFile: string
}

export default function GamePage({
  gameId,
  gameTitle,
  gameIcon,
  gameFile,
}: GamePageProps) {
  const { data: session } = useSession()

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← BACK TO ARCADE
        </Link>
        <h1 className={styles.gameTitle}>
          {gameIcon} {gameTitle}
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={styles.logoutButton}
        >
          LOGOUT
        </button>
      </header>

      <div className={styles.gameContainer}>
        {gameFile ? (
          <iframe
            src={`/${encodeURI(gameFile)}`}
            title={gameTitle}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '10px',
            }}
            allowFullScreen
          />
        ) : (
          <div className={styles.gameContent}>
            <p className={styles.loadingText}>
              Game content for: <strong>{gameTitle}</strong>
            </p>
            <p className={styles.instruction}>
              Embed your HTML game file here using iframe or React components
            </p>

            <div className={styles.placeholder}>
              <h2>🎮 {gameIcon} Game Placeholder</h2>
              <p>
                To add your game, create a component or embed an iframe here.
              </p>
              <p>Current Game ID: {gameId}</p>
            </div>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <p>Session Protected Game | Server-Side Authentication | NextAuth.js</p>
      </footer>
    </div>
  )
}

interface GameConfig {
  [key: string]: {
    title: string
    icon: string
    file: string
  }
}

const gameConfigs: GameConfig = {
  'bug-arena': { title: 'BUG ARENA', icon: '🐛', file: 'bug-arena.html' },
  'falling-duck': { title: 'FALLING DUCK', icon: '🦆', file: 'falling-duck.html' },
  rosti: { title: 'ROSTI ADVENTURE', icon: '🍞', file: 'rosti.html' },
  'crystals-finder': {
    title: 'CRYSTALS FINDER',
    icon: '💎',
    file: 'crystals-finder.html',
  },
  'tap-like-a-pro': { title: 'TAP LIKE A PRO', icon: '👆', file: 'tap-like-a-pro.html' },
  'make-the-biggest-fire-ever': {
    title: 'MAKE THE BIGGEST FIRE',
    icon: '🔥',
    file: 'make-the-biggest-fire-ever.html',
  },
  'bottle-bounce': { title: 'BOTTLE BOUNCE', icon: '🍾', file: 'butelka.html' },
  'tanks-fight': { title: 'TANKS FIGHT', icon: '🤖', file: 'tanciki f..html' },
  'ruin-the-brick': {
    title: 'RUIN THE BRICK',
    icon: '⭐',
    file: 'Game1 final.html',
  },
  'ping-pong': { title: 'PING PONG', icon: '🏓', file: 'ping-pong.sb3 final.html' },
  'dino-run': {
    title: 'DINO RUN',
    icon: '🦖',
    file: 'Projekt Scratch final.html',
  },
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const gameId = context.params?.game as string
  const gameConfig = gameConfigs[gameId]

  if (!gameConfig) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      gameId,
      gameTitle: gameConfig.title,
      gameIcon: gameConfig.icon,
      gameFile: gameConfig.file,
    },
  }
}
