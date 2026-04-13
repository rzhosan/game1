import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import styles from '@/styles/Home.module.css'

interface GameData {
  id: string
  title: string
  icon: string
  description: string
  path: string
}

const games: GameData[] = [
  {
    id: 'bug-arena',
    title: 'BUG ARENA',
    icon: '🐛',
    description: 'Crush the bugs!',
    path: '/games/bug-arena',
  },
  {
    id: 'falling-duck',
    title: 'FALLING DUCK',
    icon: '🦆',
    description: 'Save the duck!',
    path: '/games/falling-duck',
  },
  {
    id: 'rosti',
    title: 'ROSTI ADVENTURE',
    icon: '🍞',
    description: 'Toast adventure',
    path: '/games/rosti',
  },
  {
    id: 'crystals-finder',
    title: 'CRYSTALS FINDER',
    icon: '💎',
    description: 'Find the gems',
    path: '/games/crystals-finder',
  },
  {
    id: 'tap-like-pro',
    title: 'TAP LIKE A PRO',
    icon: '👆',
    description: 'Tap faster!',
    path: '/games/tap-like-a-pro',
  },
  {
    id: 'make-biggest-fire',
    title: 'MAKE THE BIGGEST FIRE',
    icon: '🔥',
    description: 'Grow your fire',
    path: '/games/make-the-biggest-fire-ever',
  },
  {
    id: 'bottle-bounce',
    title: 'BOTTLE BOUNCE',
    icon: '🍾',
    description: 'Bouncy Fun',
    path: '/games/bottle-bounce',
  },
  {
    id: 'tanks-fight',
    title: 'TANKS FIGHT',
    icon: '🤖',
    description: 'Rhythm & Motion',
    path: '/games/tanks-fight',
  },
  {
    id: 'ruin-the-brick',
    title: 'RUIN THE BRICK',
    icon: '⭐',
    description: 'Ultimate Challenge',
    path: '/games/ruin-the-brick',
  },
  {
    id: 'ping-pong',
    title: 'PING PONG',
    icon: '🏓',
    description: 'Classic Arcade',
    path: '/games/ping-pong',
  },
  {
    id: 'dino-run',
    title: 'DINO RUN',
    icon: '🦖',
    description: 'Prehistoric Chase',
    path: '/games/dino-run',
  },
]

export default function Home() {
  const { data: session } = useSession()
  const [currentPage, setCurrentPage] = useState(0)
  
  const GAMES_PER_PAGE = 6
  const totalPages = Math.ceil(games.length / GAMES_PER_PAGE)
  const startIndex = currentPage * GAMES_PER_PAGE
  const displayedGames = games.slice(startIndex, startIndex + GAMES_PER_PAGE)

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>🎮 MARK'S ARCADES 🎮</h1>
            <p className={styles.subtitle}>RETRO ARCADE GAMING PORTAL</p>
          </div>

          <div className={styles.userSection}>
            {session?.user && (
              <>
                <div className={styles.userInfo}>
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={40}
                      height={40}
                      className={styles.userAvatar}
                    />
                  )}
                  <div className={styles.userDetails}>
                    <p className={styles.userName}>{session.user.name}</p>
                    <p className={styles.userEmail}>{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className={styles.logoutButton}
                >
                  LOGOUT
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.paginationContainer}>
          <button
            onClick={handlePrevPage}
            className={styles.paginationButton}
            title="Previous page"
          >
            ← PREV
          </button>
          <span className={styles.pageIndicator}>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            className={styles.paginationButton}
            title="Next page"
          >
            NEXT →
          </button>
        </div>

        <div className={styles.gamesGrid}>
          {displayedGames.map((game) => (
            <Link href={game.path} key={game.id}>
              <div className={styles.gameCard}>
                <div className={styles.gameIcon}>{game.icon}</div>
                <h2 className={styles.gameTitle}>{game.title}</h2>
                <p className={styles.gameDescription}>{game.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          Protected with Server-Side Authentication | NextAuth.js ✨ | Session
          Management on Server
        </p>
      </footer>
    </div>
  )
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

  return {
    props: {
      session,
    },
  }
}
