import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Download, Share2, X } from 'lucide-react'
import {
  blobToShareFile,
  buildShareText,
  exportElementAsBlob,
  exportElementAsPng,
  KURSOKO_SHARE_URL,
} from '../../utils/shareExport'
import ShareCard from './ShareCard'
import { resultsGhostBtn, resultsPrimaryBtn } from './resultsClasses'

function ButtonSpinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/25 border-t-current"
      aria-hidden="true"
    />
  )
}

function ShareResultModal({ open, onClose, archetype, topCareer, combination }) {
  const titleId = useId()
  const cardRef = useRef(null)
  const closeButtonRef = useRef(null)
  const [sharing, setSharing] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !sharing && !downloading) onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose, sharing, downloading])

  useEffect(() => {
    if (!open) {
      setStatusMessage('')
      setSharing(false)
      setDownloading(false)
    }
  }, [open])

  const showStatus = (message) => {
    setStatusMessage(message)
    window.setTimeout(() => setStatusMessage(''), 3000)
  }

  const handleShare = async () => {
    setSharing(true)
    setStatusMessage('')

    try {
      const exportResult = await exportElementAsBlob(cardRef.current)
      if (!exportResult.ok) {
        showStatus('Could not create share image.')
        return
      }

      const text = buildShareText({ archetype, topCareer, combination })
      const file = blobToShareFile(exportResult.blob, `kursoko-${archetype.id}.png`)
      const sharePayload = {
        title: `My KursoKo result: ${archetype.name}`,
        text: `${text}\n\n${KURSOKO_SHARE_URL}`,
        files: [file],
      }

      if (navigator.canShare?.(sharePayload)) {
        await navigator.share(sharePayload)
        showStatus('Shared!')
        return
      }

      if (navigator.share) {
        await navigator.share({
          title: sharePayload.title,
          text: sharePayload.text,
        })
        showStatus('Shared!')
        return
      }

      await exportElementAsPng(cardRef.current, `kursoko-${archetype.id}.png`)
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        showStatus('Card saved · caption copied!')
      } else {
        showStatus('Card saved!')
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        showStatus('Share cancelled or failed.')
      }
    } finally {
      setSharing(false)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    setStatusMessage('')

    try {
      const result = await exportElementAsPng(cardRef.current, `kursoko-${archetype.id}.png`)
      showStatus(result.ok ? 'Share card downloaded!' : 'Could not export image.')
    } catch {
      showStatus('Could not export image.')
    } finally {
      setDownloading(false)
    }
  }

  if (!open || typeof document === 'undefined') return null

  const busy = sharing || downloading

  return createPortal(
    <div className="share-result-modal-root">
      <button
        type="button"
        className="share-result-modal-backdrop"
        aria-label="Close share preview"
        onClick={busy ? undefined : onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="share-result-modal"
      >
        <div className="share-result-modal__header">
          <div>
            <h2 id={titleId} className="share-result-modal__title">
              Share your result
            </h2>
            <p className="share-result-modal__subtitle">
              Preview your card · post to stories or save for later
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className={`${resultsGhostBtn} share-result-modal__close`}
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="share-result-modal__preview">
          <ShareCard
            cardRef={cardRef}
            archetype={archetype}
            topCareer={topCareer}
            combination={combination}
            className="share-card-export--preview"
          />
        </div>

        {statusMessage ? (
          <p className="share-result-modal__status" role="status">
            {statusMessage}
          </p>
        ) : null}

        <div className="share-result-modal__actions">
          <button
            type="button"
            className={resultsPrimaryBtn}
            onClick={handleShare}
            disabled={busy}
          >
            {sharing ? <ButtonSpinner /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
            {sharing ? 'Sharing…' : 'Share'}
          </button>
          <button
            type="button"
            className={resultsGhostBtn}
            onClick={handleDownload}
            disabled={busy}
          >
            {downloading ? <ButtonSpinner /> : <Download className="h-4 w-4" aria-hidden="true" />}
            {downloading ? 'Saving…' : 'Download card'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ShareResultModal
