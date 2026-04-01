import { useState, useEffect, ReactNode } from 'react'
import styles from '@/styles/EndSessionDialog.module.css'

interface EndSessionDialogProps {
  isOpen: boolean
  onCancel: () => void
  onEnd: () => void
  onClose: () => void
}

export default function EndSessionDialog({
  isOpen,
  onCancel,
  onEnd,
  onClose,
}: EndSessionDialogProps): ReactNode {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2 className={styles.title}>Czy na pewno chcesz zakończyć sesję?</h2>
        <p className={styles.message}>Aby powrócić, zaloguj się ponownie.</p>
        
        <div className={styles.buttons}>
          <button 
            className={`${styles.button} ${styles.cancel}`}
            onClick={onCancel}
            type="button"
          >
            Anuluj
          </button>
          <button 
            className={`${styles.button} ${styles.end}`}
            onClick={onEnd}
            type="button"
          >
            Zakończ
          </button>
          <button 
            className={`${styles.button} ${styles.close}`}
            onClick={onClose}
            type="button"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  )
}
