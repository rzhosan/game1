import React from 'react'
import styles from '@/styles/EndSessionDialog.module.css'

interface EndSessionDialogProps {
  isOpen: boolean
  onCancel: () => void
  onEnd: () => void
  onClose: () => void
}

const EndSessionDialog: React.FC<EndSessionDialogProps> = ({
  isOpen,
  onCancel,
  onEnd,
  onClose,
}): React.ReactElement | null => {
  if (!isOpen) return null

  const buttonsContent = (
    <>
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
    </>
  )

  const dialogContent = (
    <>
      <h2 className={styles.title}>Czy na pewno chcesz zakończyć sesję?</h2>
      <p className={styles.message}>Aby powrócić, zaloguj się ponownie.</p>
      <div className={styles.buttons}>
        {buttonsContent}
      </div>
    </>
  )

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        {dialogContent}
      </div>
    </div>
  ) as React.ReactElement
}

export default EndSessionDialog
