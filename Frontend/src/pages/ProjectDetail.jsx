import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getProject } from '../api/index'
import { useThreeBackground, useScrollReveal } from '../hooks/usePageEffects'
import { GithubIcon, ExternalIcon, StarIcon } from '../components/ProjectIcons'
import styles from './Projects.module.css'

const formatDate = iso =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

const SWIPE_THRESHOLD = 50   // px of horizontal finger movement that counts as a swipe

// Full-screen viewer. Rendered in a portal on <body> because the gallery sits inside a
// `.fi` wrapper whose `transform` would otherwise trap `position: fixed` inside it.
function Lightbox({ images, index, name, onClose, onPrev, onNext }) {
  const touchStartX = useRef(null)
  const multiple = images.length > 1

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && multiple) onPrev()
      else if (e.key === 'ArrowRight' && multiple) onNext()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'   // stop the page scrolling behind the viewer
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [multiple, onClose, onPrev, onNext])

  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = e => {
    if (touchStartX.current === null || !multiple) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (dx > SWIPE_THRESHOLD) onPrev()
    else if (dx < -SWIPE_THRESHOLD) onNext()
  }

  const stop = handler => e => { e.stopPropagation(); handler() }

  return createPortal(
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} screenshots`}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button type="button" className={styles.lbClose} onClick={stop(onClose)} aria-label="Close" autoFocus>×</button>

      {multiple && (
        <button type="button" className={`${styles.lbNav} ${styles.lbPrev}`} onClick={stop(onPrev)} aria-label="Previous image">‹</button>
      )}

      <figure className={styles.lbFigure} onClick={e => e.stopPropagation()}>
        <img key={index} src={images[index].image} alt={`${name} screenshot ${index + 1}`} className={styles.lbImage} />
        {multiple && (
          <figcaption className={styles.lbCounter}><strong>{index + 1}</strong> / {images.length}</figcaption>
        )}
      </figure>

      {multiple && (
        <button type="button" className={`${styles.lbNav} ${styles.lbNext}`} onClick={stop(onNext)} aria-label="Next image">›</button>
      )}
    </div>,
    document.body
  )
}

function Gallery({ images, name }) {
  const [active, setActive] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const count = images.length

  const showPrev   = useCallback(() => setActive(i => (i - 1 + count) % count), [count])
  const showNext   = useCallback(() => setActive(i => (i + 1) % count), [count])
  const closeViewer = useCallback(() => setViewerOpen(false), [])

  if (count === 0) {
    return (
      <div className={styles.gallery}>
        <div className={styles.mainImage}><span className={styles.coverIco}>{'</>'}</span></div>
      </div>
    )
  }

  return (
    <div className={styles.gallery}>
      <button
        type="button"
        className={`${styles.mainImage} ${styles.zoomable}`}
        onClick={() => setViewerOpen(true)}
        aria-label="Open image in full screen"
      >
        <img src={images[active].image} alt={`${name} screenshot ${active + 1}`} />
        <span className={styles.zoomHint} aria-hidden="true">⤢</span>
      </button>

      {viewerOpen && (
        <Lightbox
          images={images}
          index={active}
          name={name}
          onClose={closeViewer}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}

      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className={i === active ? `${styles.thumb} ${styles.thumbActive}` : styles.thumb}
              onClick={() => setActive(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-pressed={i === active}
            >
              <img src={img.image} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProjectDetail() {
  const canvasRef = useRef(null)
  const { id }    = useParams()
  const location  = useLocation()
  const backTo    = `/projects${location.state?.from || ''}`   // keeps the list's page + search

  const [result, setResult] = useState(null)   // { id, status: 'ready' | 'notfound' | 'error', data }

  useThreeBackground(canvasRef)
  useScrollReveal([result])

  useEffect(() => {
    const controller = new AbortController()
    getProject(id, { signal: controller.signal })
      .then(res => setResult({ id, status: 'ready', data: res.data }))
      .catch(err => {
        if (err.code === 'ERR_CANCELED') return
        setResult({ id, status: err.response?.status === 404 ? 'notfound' : 'error' })
      })
    return () => controller.abort()
  }, [id])

  const loading = result?.id !== id
  const project = !loading && result.status === 'ready' ? result.data : null
  const title   = project ? project.name : loading ? 'Loading…' : 'Project not found'

  let content
  if (loading) {
    content = (
      <div className={styles.detail} aria-busy="true">
        <div className={`${styles.mainImage} ${styles.skBlock}`} />
        <div className={styles.info}>
          <div className={`${styles.skLine} ${styles.short}`} />
          <div className={styles.skLine} />
          <div className={styles.skLine} />
          <div className={`${styles.skLine} ${styles.mid}`} />
        </div>
      </div>
    )
  } else if (!project) {
    content = (
      <div className={styles.empty}>
        <div className={styles.emptyIco}>{'</>'}</div>
        <h3>{result.status === 'notfound' ? 'This project isn’t available' : 'Couldn’t load this project'}</h3>
        <p>
          {result.status === 'notfound'
            ? 'It may have been removed or hidden. Take a look at the other projects instead.'
            : 'Something went wrong while reaching the server. Please try again in a moment.'}
        </p>
        <Link to={backTo} className="btn-out">← Back to projects</Link>
      </div>
    )
  } else {
    const tags = (project.tags || []).filter(t => t.toLowerCase() !== (project.language || '').toLowerCase())
    content = (
      <div className={styles.detail}>
        <div className="fi">
          <Gallery key={project.id} images={project.images} name={project.name} />
        </div>

        <aside className={`${styles.info} fi d1`}>
          {project.is_featured && <span className={styles.featured}>★ Featured</span>}
          <h2 className={styles.infoTitle}>About this project</h2>
          <p className={styles.fullDesc}>{project.description || 'No description yet.'}</p>

          <ul className={styles.metaList}>
            <li><strong>Language:</strong> {project.language || '—'}</li>
            <li><strong>Stars:</strong> <StarIcon /> {project.stars}</li>
            <li><strong>Last update:</strong> {formatDate(project.pushed_at)}</li>
          </ul>

          {tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map(t => <span key={t} className={styles.ptag}>{t}</span>)}
            </div>
          )}

          <div className={styles.actions}>
            <a href={project.repository_url} target="_blank" rel="noreferrer" className="btn-og">
              <GithubIcon size={15} /> View on GitHub
            </a>
            {project.website_url && (
              <a href={project.website_url} target="_blank" rel="noreferrer" className="btn-out">
                <ExternalIcon size={14} /> Live site
              </a>
            )}
          </div>
        </aside>
      </div>
    )
  }

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.page}>

        {/* PAGE TITLE */}
        <div className={styles.pageTitle}>
          <h1>{title}</h1>
        </div>

        {/* BREADCRUMB */}
        <div className={styles.breadcrumbBar}>
          <div className={styles.breadcrumb}>
            <Link to="/" className={styles.bcLink}>Home</Link>
            <span className={styles.sep}>›</span>
            <Link to={backTo} className={styles.bcLink}>Projects</Link>
            <span className={styles.sep}>›</span>
            <span className={styles.bcCurrent}>{project ? project.name : '…'}</span>
          </div>
        </div>

        <section className={styles.section}>
          <Link to={backTo} className={styles.backLink}>← Back to projects</Link>
          {content}
        </section>
      </div>
    </>
  )
}
