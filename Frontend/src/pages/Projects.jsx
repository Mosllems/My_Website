import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { getProjects } from '../api/index'
import { useThreeBackground, useScrollReveal } from '../hooks/usePageEffects'
import { GithubIcon, ExternalIcon, SearchIcon } from '../components/ProjectIcons'
import styles from './Projects.module.css'

const SEARCH_DELAY = 400
const SKELETON_COUNT = 6   // placeholder cards while the first page loads (cosmetic only)

// Total pages from DRF's standard { count, next, results } response, so the page size
// lives only in Django settings. Any page that has a `next` link is a full page,
// so its length IS the page size; the last page has no `next`, so it is the last one.
function getTotalPages(data, page) {
  if (!data.next) return Math.max(page, 1)
  return Math.ceil(data.count / data.results.length)
}

// [1, '…', 4, 5, 6, '…', 12] — keeps the pager short when there are many pages.
function pageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const items = [1]
  const start = Math.max(2, current - 1)
  const end   = Math.min(total - 1, current + 1)
  if (start > 2) items.push('…')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total - 1) items.push('…')
  items.push(total)
  return items
}

// Language first, then GitHub topics, without case-insensitive duplicates.
function projectChips(project) {
  const seen = new Set()
  return [project.language, ...(project.tags || [])]
    .filter(Boolean)
    .filter(t => (seen.has(t.toLowerCase()) ? false : seen.add(t.toLowerCase())))
}

function ProjectCard({ project, index, from }) {
  const chips = projectChips(project)

  return (
    <article className={`${styles.card} fi d${(index % 3) + 1}`}>
      <div className={styles.cover}>
        {project.cover_image
          ? <img src={project.cover_image} alt="" loading="lazy" />
          : <span className={styles.coverIco}>{'</>'}</span>}
      </div>

      <div className={styles.body}>
        <div className={styles.cardTop}>
          <span className={styles.projIco}>{'</>'}</span>
          <div className={styles.cardLinks}>
            <a href={project.repository_url} target="_blank" rel="noreferrer"
               className={styles.iconLink} aria-label={`${project.name} on GitHub`}>
              <GithubIcon />
            </a>
            {project.website_url && (
              <a href={project.website_url} target="_blank" rel="noreferrer"
                 className={styles.iconLink} aria-label={`${project.name} live site`}>
                <ExternalIcon />
              </a>
            )}
          </div>
        </div>

        <h3 className={styles.name}>
          <Link to={`/projects/${project.id}`} state={{ from }}>{project.name}</Link>
        </h3>
        <p className={styles.desc}>{project.short_description || 'No description yet.'}</p>

        {chips.length > 0 && (
          <div className={styles.tags}>
            {chips.map((t, i) => (
              <span key={t} className={i === 0 && t === project.language ? `${styles.ptag} ${styles.langTag}` : styles.ptag}>
                {t}
              </span>
            ))}
          </div>
        )}

        <span className={styles.more}>View details →</span>
      </div>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div className={`${styles.card} ${styles.skeleton}`} aria-hidden="true">
      <div className={styles.cover} />
      <div className={styles.body}>
        <div className={`${styles.skLine} ${styles.short}`} />
        <div className={styles.skLine} />
        <div className={`${styles.skLine} ${styles.mid}`} />
      </div>
    </div>
  )
}

export default function Projects() {
  const canvasRef  = useRef(null)
  const toolbarRef = useRef(null)
  const location   = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  // The URL is the source of truth, so Back from a detail page restores page + search.
  const page   = Math.max(1, Number(searchParams.get('page')) || 1)
  const search = searchParams.get('search') || ''
  const key    = `${page}|${search}`

  const [input, setInput]           = useState(search)
  const [syncedSearch, setSynced]   = useState(search)
  const [result, setResult]         = useState(null)   // { key, status: 'ready' | 'error', data }
  const [retry, setRetry]           = useState(0)

  // URL changed from outside (browser back/forward) → reflect it in the input.
  if (search !== syncedSearch) {
    setSynced(search)
    setInput(search)
  }

  useThreeBackground(canvasRef)
  useScrollReveal([result])

  // Debounce typing → write the search term to the URL (resets to page 1).
  useEffect(() => {
    const term = input.trim()
    if (term === search) return
    const timer = setTimeout(() => {
      setSearchParams(term ? { search: term } : {}, { replace: true })
    }, SEARCH_DELAY)
    return () => clearTimeout(timer)
  }, [input, search, setSearchParams])

  // Fetch whenever page or search changes; abort the previous request if it's still in flight.
  useEffect(() => {
    const controller = new AbortController()
    const params = { page, ...(search && { search }) }

    getProjects(params, { signal: controller.signal })
      .then(res => setResult({ key, status: 'ready', data: res.data }))
      .catch(err => {
        if (err.code === 'ERR_CANCELED') return
        // Page number out of range (e.g. an old link) → fall back to page 1.
        if (err.response?.status === 404 && page > 1) {
          setSearchParams(search ? { search } : {}, { replace: true })
          return
        }
        setResult({ key, status: 'error' })
      })

    return () => controller.abort()
  }, [key, page, search, retry, setSearchParams])

  const loading = result?.key !== key
  const data    = result?.status === 'ready' ? result.data : null
  const from    = location.search   // passed to detail pages so "Back" returns here
  const totalPages = data ? getTotalPages(data, page) : 1

  const goToPage = p => {
    const next = {}
    if (search) next.search = search
    if (p > 1) next.page = String(p)
    setSearchParams(next)
    toolbarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const clearSearch = () => {
    setInput('')
    setSearchParams({}, { replace: true })
  }

  let content
  if (!result) {
    content = Array.from({ length: SKELETON_COUNT },(_, i) => <SkeletonCard key={i} />)
  } else if (result.status === 'error' && !loading) {
    content = (
      <div className={styles.empty}>
        <div className={styles.emptyIco}>{'</>'}</div>
        <h3>Couldn't load projects</h3>
        <p>Something went wrong while reaching the server. Please try again in a moment.</p>
        <button type="button" className="btn-out" onClick={() => { setResult(null); setRetry(n => n + 1) }}>Retry</button>
      </div>
    )
  } else if (data && data.results.length === 0) {
    content = (
      <div className={styles.empty}>
        <div className={styles.emptyIco}>{'</>'}</div>
        {search ? (
          <>
            <h3>No projects match “{search}”</h3>
            <p>Try a different name, or clear the search to see everything.</p>
            <button type="button" className="btn-out" onClick={clearSearch}>Clear search</button>
          </>
        ) : (
          <>
            <h3>No projects yet</h3>
            <p>Projects will show up here soon. Meanwhile, check out my GitHub.</p>
            <a href="https://github.com/Mosllems" target="_blank" rel="noreferrer" className="btn-og">
              <GithubIcon size={15} /> Visit GitHub
            </a>
          </>
        )}
      </div>
    )
  } else if (data) {
    content = data.results.map((p, i) => <ProjectCard key={p.id} project={p} index={i} from={from} />)
  }

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.page}>

        {/* PAGE TITLE */}
        <div className={styles.pageTitle}>
          <h1>My <em>Projects</em></h1>
          <p>Things I've built — from backend APIs to AI experiments. Synced straight from GitHub.</p>
        </div>

        {/* BREADCRUMB */}
        <div className={styles.breadcrumbBar}>
          <div className={styles.breadcrumb}>
            <Link to="/" className={styles.bcLink}>Home</Link>
            <span className={styles.sep}>›</span>
            <Link to="/projects" className={styles.bcCurrent}>Projects</Link>
          </div>
        </div>

        <section className={styles.section}>

          {/* SEARCH + COUNT */}
          <div className={styles.toolbar} ref={toolbarRef}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}><SearchIcon /></span>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search projects by name..."
                value={input}
                onChange={e => setInput(e.target.value)}
                aria-label="Search projects by name"
              />
              {input && (
                <button type="button" className={styles.clearBtn} onClick={clearSearch} aria-label="Clear search">×</button>
              )}
            </div>

            {data && (
              <span className={styles.count}>
                <strong>{data.count}</strong> {data.count === 1 ? 'project' : 'projects'}
                {search && <> found</>}
              </span>
            )}
          </div>

          {/* GRID */}
          <div className={`${styles.grid} ${loading && result ? styles.stale : ''}`} aria-busy={loading}>
            {content}
          </div>

          {/* PAGINATION */}
          {data && totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Projects pagination">
              <button type="button" className={styles.pageBtn} disabled={page <= 1} onClick={() => goToPage(page - 1)}
                      aria-label="Previous page">
                ←<span className={styles.pageLabel}> Prev</span>
              </button>

              {pageItems(page, totalPages).map((item, i) =>
                item === '…' ? (
                  <span key={`gap-${i}`} className={styles.ellipsis}>…</span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    className={item === page ? `${styles.pageBtn} ${styles.pageActive}` : styles.pageBtn}
                    aria-current={item === page ? 'page' : undefined}
                    onClick={() => item !== page && goToPage(item)}
                  >
                    {item}
                  </button>
                )
              )}

              <button type="button" className={styles.pageBtn} disabled={page >= totalPages} onClick={() => goToPage(page + 1)}
                      aria-label="Next page">
                <span className={styles.pageLabel}>Next </span>→
              </button>
            </nav>
          )}

        </section>
      </div>
    </>
  )
}
