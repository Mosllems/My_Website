import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logo}>
        <div className={styles.badge}>MA</div>
        <span className={styles.name}>Moslem Amiri</span>
      </NavLink>

      <ul className={styles.links}>
        <li><NavLink to="/"         className={({isActive}) => isActive ? styles.active : ''}>Home</NavLink></li>
        <li><NavLink to="/about"    className={({isActive}) => isActive ? styles.active : ''}>About</NavLink></li>
        <li><NavLink to="/resume"   className={({isActive}) => isActive ? styles.active : ''}>Resume</NavLink></li>
        <li><NavLink to="/contact"  className={({isActive}) => isActive ? styles.active : ''}>Contact</NavLink></li>
      </ul>

      <NavLink to="/contact" className={styles.talkBtn}>
        Let's Talk →
      </NavLink>
    </nav>
  )
}
