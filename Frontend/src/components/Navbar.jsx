import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location])

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logo}>
        <div className={styles.badge}>MA</div>
        <span className={styles.name}>Moslem Amiri</span>
      </NavLink>

      <ul className={styles.links}>
        <li><NavLink to="/"        className={({isActive}) => isActive ? styles.active : ''}>Home</NavLink></li>
        <li><NavLink to="/about"   className={({isActive}) => isActive ? styles.active : ''}>About</NavLink></li>
        <li><NavLink to="/resume"  className={({isActive}) => isActive ? styles.active : ''}>Resume</NavLink></li>
        <li><NavLink to="/contact" className={({isActive}) => isActive ? styles.active : ''}>Contact</NavLink></li>
      </ul>

      <NavLink to="/contact" className={`${styles.talkBtn} ${styles.talkBtnDesktop}`}>
        Let's Talk →
      </NavLink>

      <button
        className={styles.burger}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span className={`${styles.bar} ${open ? styles.bar1Open : ''}`} />
        <span className={`${styles.bar} ${open ? styles.bar2Open : ''}`} />
        <span className={`${styles.bar} ${open ? styles.bar3Open : ''}`} />
      </button>

      {open && (
        <div className={styles.mobileMenu}>
          <NavLink to="/"        className={({isActive}) => isActive ? styles.mActive : styles.mLink} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/about"   className={({isActive}) => isActive ? styles.mActive : styles.mLink} onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/resume"  className={({isActive}) => isActive ? styles.mActive : styles.mLink} onClick={() => setOpen(false)}>Resume</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? styles.mActive : styles.mLink} onClick={() => setOpen(false)}>Contact</NavLink>
          <NavLink to="/contact" className={styles.talkBtn} onClick={() => setOpen(false)}>Let's Talk →</NavLink>
        </div>
      )}
    </nav>
  )
}
