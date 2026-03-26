# How to Add Your Games to Next.js

Your existing HTML games need to be integrated into the Next.js application. Here are 3 methods:

## Method 1: Embed as Static HTML (Easiest) ⭐

This is the quickest way to add your games without any code changes.

### Steps:

1. **Copy HTML files to public folder**
   ```bash
   # From game1 root, copy your game files:
   cp bug-arena.html next-next-js/public/games/
   cp falling-duck.html next-next-js/public/games/
   cp rosti.html next-next-js/public/games/
   cp crystals-finder.html next-next-js/public/games/
   # ... etc
   ```

2. **Create `public/games` folder**
   ```bash
   mkdir -p next-next-js/public/games
   ```

3. **Copy required assets**
   ```bash
   # Copy any images, audio, or data files your games use
   cp background.png next-next-js/public/games/
   cp rosti.pck next-next-js/public/games/
   cp rosti.wasm next-next-js/public/games/
   cp *.worklet.js next-next-js/public/games/
   # ... etc
   ```

4. **Update game page to embed HTML**
   
   Edit `pages/games/[game].tsx`:
   ```tsx
   export default function GamePage({ gameId, gameTitle, gameIcon }: GamePageProps) {
     const { data: session } = useSession()

     const gameFiles: { [key: string]: string } = {
       'bug-arena': '/games/bug-arena.html',
       'falling-duck': '/games/falling-duck.html',
       'rosti': '/games/rosti.html',
       'crystals-finder': '/games/crystals-finder.html',
       // ... etc
     }

     return (
       <div className={styles.pageContainer}>
         {/* ... header ... */}
         
         <div className={styles.gameContainer}>
           <iframe
             src={gameFiles[gameId]}
             style={{
               width: '100%',
               height: '100%',
               border: 'none',
               borderRadius: '10px'
             }}
             title={gameTitle}
             sandbox="allow-same-origin allow-scripts allow-pointer-lock"
           />
         </div>

         {/* ... footer ... */}
       </div>
     )
   }
   ```

5. **Adjust CSS for game container**
   
   Edit `styles/Game.module.css`:
   ```css
   .gameContainer {
     flex: 1;
     padding: 20px;
     display: flex;
     justify-content: center;
     align-items: stretch;
     min-height: 600px;  /* Minimum height for games */
   }

   .gameContent {
     width: 100%;
     height: 100%;
   }
   ```

### Advantages:
- ✅ No code changes needed
- ✅ Games work exactly as before
- ✅ Fastest implementation
- ✅ Keep all game assets together

### Disadvantages:
- ⚠️ Games run in iframe (slight performance impact)
- ⚠️ Cannot run fullscreen easily
- ⚠️ Cannot share state with React

---

## Method 2: React Component Wrapper

Convert your games to React components for better integration.

### Steps:

1. **Create components folder**
   ```bash
   mkdir -p next-next-js/components/games
   ```

2. **Create game component**
   
   Create `components/games/BugArena.tsx`:
   ```tsx
   import { useEffect, useRef } from 'react'

   export default function BugArena() {
     const containerRef = useRef<HTMLDivElement>(null)

     useEffect(() => {
       // Load your game script here
       const script = document.createElement('script')
       script.src = '/games/bug-arena.js'
       script.async = true
       if (containerRef.current) {
         containerRef.current.appendChild(script)
       }

       return () => {
         // Cleanup if needed
       }
     }, [])

     return (
       <div 
         ref={containerRef} 
         style={{ 
           width: '100%', 
           height: '100%',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center'
         }}
       >
         <canvas id="gameCanvas" />
       </div>
     )
   }
   ```

3. **Update game page to use component**
   
   Edit `pages/games/[game].tsx`:
   ```tsx
   import BugArena from '@/components/games/BugArena'
   import FallingDuck from '@/components/games/FallingDuck'
   import Rosti from '@/components/games/Rosti'
   // ... other imports

   const gameComponents: { [key: string]: React.FC } = {
     'bug-arena': BugArena,
     'falling-duck': FallingDuck,
     'rosti': Rosti,
     // ... etc
   }

   export default function GamePage({ gameId, gameTitle, gameIcon }: GamePageProps) {
     const GameComponent = gameComponents[gameId]

     return (
       <div className={styles.pageContainer}>
         {/* ... header ... */}
         
         <div className={styles.gameContainer}>
           <GameComponent />
         </div>

         {/* ... footer ... */}
       </div>
     )
   }
   ```

### Advantages:
- ✅ Better React integration
- ✅ Better performance
- ✅ Can access React context
- ✅ Better error handling

### Disadvantages:
- ⚠️ Requires refactoring game code
- ⚠️ More development time
- ⚠️ Need to handle canvas/WebGL setup

---

## Method 3: Hybrid (Recommended for Complex Games)

Use iframes for existing games, components for new games.

### Setup:

1. **Keep existing games as iframes** (Method 1)
2. **Create components for new games** (Method 2)
3. **Mix both approaches**

```tsx
// pages/games/[game].tsx

const gameComponents: { [key: string]: React.FC | string } = {
  'bug-arena': '/games/bug-arena.html',           // iframe
  'falling-duck': FallingDuck,                    // component
  'rosti': '/games/rosti.html',                   // iframe
  'crystals-finder': CrystalsFinder,              // component
}

export default function GamePage({ gameId }: GamePageProps) {
  const game = gameComponents[gameId]
  const isComponent = typeof game !== 'string'
  const GameComponent = isComponent ? game : null

  return (
    <>
      {isComponent ? (
        <GameComponent />
      ) : (
        <iframe src={game} style={{ width: '100%', height: '100%' }} />
      )}
    </>
  )
}
```

---

## File Structure After Adding Games

```
next-next-js/
├── public/
│   ├── games/
│   │   ├── bug-arena.html
│   │   ├── falling-duck.html
│   │   ├── rosti.html
│   │   ├── rosti.wasm
│   │   ├── rosti.pck
│   │   ├── *.worklet.js
│   │   └── ... other game files
│   ├── background.png
│   └── favicon.ico
│
├── components/
│   └── games/
│       ├── BugArena.tsx
│       ├── FallingDuck.tsx
│       └── ... new components
│
└── pages/
    └── games/
        └── [game].tsx
```

---

## Adding Games One by One

### Step 1: Add game file to public/games
```bash
cp falling-duck.html next-next-js/public/games/
```

### Step 2: Update GAMES array in pages/index.tsx or pages/games/[game].tsx

### Step 3: Test the game

### Step 4: Repeat for each game

---

## Troubleshooting Game Issues

### Game doesn't load in iframe

**Problem**: iframe shows blank or error

**Solutions**:
1. Check HTML file path is correct
2. Check `sandbox` attributes allow needed features:
   ```tsx
   sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-fullscreen"
   ```
3. Check browser console for errors (F12)
4. Try Method 2 (component wrapper)

### Game plays but looks wrong

**Problem**: Game stretched or aspect ratio wrong

**Solutions**:
1. Add CSS to game container:
   ```css
   .gameContainer {
     aspect-ratio: 16 / 9;  /* or whatever ratio your game uses */
   }
   ```
2. Or set fixed height:
   ```css
   .gameContainer {
     min-height: 600px;
   }
   ```

### Game assets (images, audio, fonts) not loading

**Problem**: "404 Not Found" for game resources

**Solutions**:
1. Copy assets to `public/games` folder:
   ```bash
   cp -r game-assets/* next-next-js/public/games/
   ```
2. Update asset paths in HTML:
   ```html
   <!-- OLD -->
   <img src="background.png" />
   
   <!-- NEW (if using iframe) -->
   <img src="/games/background.png" />
   
   <!-- Or use absolute path -->
   <img src="https://yourdomain.com/games/background.png" />
   ```

### Game scripts don't work (especially custom worklets)

**Problem**: Error loading `.worklet.js` or similar

**Solutions**:
1. Copy audio worklet files:
   ```bash
   cp rosti.audio.worklet.js next-next-js/public/games/
   cp rosti.audio.position.worklet.js next-next-js/public/games/
   ```
2. Update paths in HTML:
   ```html
   <!-- OLD -->
   <script>
     audioContext.audioWorklet.addModule('rosti.audio.worklet.js')
   </script>
   
   <!-- NEW -->
   <script>
     audioContext.audioWorklet.addModule('/games/rosti.audio.worklet.js')
   </script>
   ```

### WebAssembly (*.wasm) files not loading

**Problem**: "Failed to fetch WebAssembly binary"

**Solutions**:
1. Copy .wasm files:
   ```bash
   cp rosti.wasm next-next-js/public/games/
   ```
2. Update game code:
   ```js
   // OLD
   const response = await fetch('rosti.wasm')
   
   // NEW
   const response = await fetch('/games/rosti.wasm')
   ```

---

## Quick Checklist for Adding Games

- [ ] Copy game HTML to `public/games/`
- [ ] Copy all game assets (images, audio, WASM, etc)
- [ ] Update asset paths in game HTML
- [ ] Add game to game list in pages
- [ ] Test game loads
- [ ] Test game plays correctly
- [ ] Test on mobile (if needed)
- [ ] Check admin panel works (if exists)

---

## Example: Adding All Games

```bash
# Create games folder
mkdir -p next-next-js/public/games

# Copy all HTML games
cp bug-arena.html next-next-js/public/games/
cp butelka.html next-next-js/public/games/
cp crystals-finder.html next-next-js/public/games/
cp falling-duck.html next-next-js/public/games/
cp make-the-biggest-fire-ever.html next-next-js/public/games/
cp rosti.html next-next-js/public/games/
cp tap-like-a-pro.html next-next-js/public/games/

# Copy assets
cp background.png next-next-js/public/games/
cp *.worklet.js next-next-js/public/games/
cp *.pck next-next-js/public/games/
cp *.wasm next-next-js/public/games/
cp *.png next-next-js/public/games/

# Start dev server
cd next-next-js
npm run dev
```

Then update `pages/games/[game].tsx` to embed these files.

---

## Full Game Embedding Example

Complete example for `pages/games/[game].tsx`:

```tsx
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

const gameMap: Record<string, { title: string; icon: string; file: string }> = {
  'bug-arena': { 
    title: 'BUG ARENA', 
    icon: '🐛',
    file: '/games/bug-arena.html'
  },
  'falling-duck': { 
    title: 'FALLING DUCK', 
    icon: '🦆',
    file: '/games/falling-duck.html'
  },
  'rosti': { 
    title: 'ROSTI ADVENTURE', 
    icon: '🍞',
    file: '/games/rosti.html'
  },
  'crystals-finder': { 
    title: 'CRYSTALS FINDER', 
    icon: '💎',
    file: '/games/crystals-finder.html'
  },
  'tap-like-a-pro': { 
    title: 'TAP LIKE A PRO', 
    icon: '👆',
    file: '/games/tap-like-a-pro.html'
  },
  'make-the-biggest-fire-ever': { 
    title: 'MAKE THE BIGGEST FIRE', 
    icon: '🔥',
    file: '/games/make-the-biggest-fire-ever.html'
  },
}

export default function GamePage({ 
  gameId, 
  gameTitle, 
  gameIcon, 
  gameFile 
}: GamePageProps) {
  const { data: session } = useSession()

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← BACK
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
        <iframe
          src={gameFile}
          title={gameTitle}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '10px',
          }}
          sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-fullscreen"
        />
      </div>

      <footer className={styles.footer}>
        <p>Protected Game | Server-Side Authentication</p>
      </footer>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<GamePageProps> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: { destination: '/login', permanent: false },
    }
  }

  const gameId = context.params?.game as string
  const gameConfig = gameMap[gameId]

  if (!gameConfig) {
    return { notFound: true }
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
```

That's it! Your games are now integrated into Next.js! 🎮
