import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { sendContact } from '../api/index'
import styles from './Contact.module.css'

const MOCK_INFO = {
  address:      'Iran',
  phone_number: '+98 --- --- ----',
  email:        'your@email.com',
}

function useThreeBackground(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(innerWidth, innerHeight)
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 1000)
    camera.position.z = 35
    const N = 1600
    const pos = new Float32Array(N * 3)
    const col = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      pos[i*3]   = (Math.random() - .5) * 140
      pos[i*3+1] = (Math.random() - .5) * 140
      pos[i*3+2] = (Math.random() - .5) * 70
      const c = new THREE.Color().setHSL(0.06 + Math.random() * 0.05, 0.8, 0.4 + Math.random() * 0.25)
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    const mat = new THREE.PointsMaterial({ size: .18, vertexColors: true, transparent: true, opacity: .4 })
    const pts = new THREE.Points(geo, mat)
    scene.add(pts)
    let mx = 0, my = 0, t = 0
    const onMouse = e => { mx = (e.clientX/innerWidth-.5)*2; my = (e.clientY/innerHeight-.5)*2 }
    document.addEventListener('mousemove', onMouse)
    const loop = () => {
      requestAnimationFrame(loop)
      t += .0003
      pts.rotation.y = t * .2 + mx * .03
      pts.rotation.x = my * .02
      renderer.render(scene, camera)
    }
    loop()
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(innerWidth, innerHeight)
    }
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [canvasRef])
}

function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') })
    }, { threshold: 0.12 })
    document.querySelectorAll('.fi').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
)
const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.4-1.33-1.77-1.33-1.77-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.9 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

export default function Contact() {
  const canvasRef = useRef(null)
  const [info]    = useState(MOCK_INFO)
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')

  useThreeBackground(canvasRef)
  useScrollReveal()

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      await sendContact(form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.page}>

        <div className={styles.pageTitle}>
          <h1>Contact</h1>
        </div>

        <div className={styles.breadcrumbBar}>
          <div className={styles.breadcrumb}>
            <Link to="/" className={styles.bcLink}>Home</Link>
            <span className={styles.sep}>›</span>
            <Link to="/contact" className={styles.bcCurrent}>Contact</Link>
          </div>
        </div>

        <section className={styles.section}>

          <div className={styles.infoGrid}>
            <div className={`${styles.infoItem} fi`}>
              <div className={styles.infoIcon}><LocationIcon /></div>
              <div>
                <h3>Address</h3>
                <p>{info.address}</p>
              </div>
            </div>
            <div className={`${styles.infoItem} fi d1`}>
              <div className={styles.infoIcon}><PhoneIcon /></div>
              <div>
                <h3>Call Me</h3>
                <p>{info.phone_number}</p>
              </div>
            </div>
            <div className={`${styles.infoItem} fi d2`}>
              <div className={styles.infoIcon}><EmailIcon /></div>
              <div>
                <h3>Email</h3>
                <p>{info.email}</p>
              </div>
            </div>
            <div className={`${styles.infoItem} fi d3`}>
              <div className={styles.infoIcon}><ShareIcon /></div>
              <div>
                <h3>Social Profiles</h3>
                <div className={styles.socials}>
                  <a href="https://www.instagram.com/mosllems/" target="_blank" rel="noreferrer"><InstagramIcon /></a>
                  <a href="https://github.com/Mosllems"          target="_blank" rel="noreferrer"><GithubIcon /></a>
                  <a href="https://www.linkedin.com/in/Mosllems" target="_blank" rel="noreferrer"><LinkedinIcon /></a>
                </div>
              </div>
            </div>
          </div>

          <form className={`${styles.form} fi`} onSubmit={handleSubmit} noValidate>
            {status === 'loading' && <div className={styles.statusLoading}>Sending...</div>}
            {status === 'success' && <div className={styles.statusSuccess}>✓ Your message has been sent. Thank you!</div>}
            {status === 'error'   && <div className={styles.statusError}>✕ Something went wrong. Please try again.</div>}

            <div className={styles.formRow}>
              <input type="text"  name="name"    placeholder="Your Name"  value={form.name}    onChange={handleChange} required className={styles.input} />
              <input type="email" name="email"   placeholder="Your Email" value={form.email}   onChange={handleChange} required className={styles.input} />
            </div>
            <input   type="text"  name="subject" placeholder="Subject"    value={form.subject} onChange={handleChange} required className={styles.input} />
            <textarea name="message" placeholder="Message" rows={6}       value={form.message} onChange={handleChange} required className={styles.textarea} />
            <div className={styles.submitWrap}>
              <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending...' : 'Send Message →'}
              </button>
            </div>
          </form>

        </section>
      </div>
    </>
  )
}
