import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { getFeaturedProjects, getSkills } from '../api/index'
import styles from './Home.module.css'

const MOCK_PROJECTS = [
  { id: 1, name: 'Project Alpha',  description: 'Django REST API backend with AI integration. Placeholder — add your first real project here.', tags: ['Python','Django','DRF'],    github: '#', live: '#' },
  { id: 2, name: 'Project Beta',   description: 'ML model integrated with a web interface. Placeholder — replace with your second project.',    tags: ['AI/ML','Python','FastAPI'], github: '#', live: '#' },
  { id: 3, name: 'Project Gamma',  description: 'Full-stack web app with Django backend. Placeholder — swap with your third project.',           tags: ['Django','PostgreSQL','Docker'], github: '#', live: '#' },
]

const MOCK_SKILLS = [
  { id:1, name:'Python' },    { id:2, name:'Django' },
  { id:3, name:'REST API' },  { id:4, name:'PostgreSQL' },
  { id:5, name:'AI / ML' },   { id:6, name:'Docker' },
  { id:7, name:'Git' },       { id:8, name:'Linux' },
]

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

    const N   = 1600
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

    const mat  = new THREE.PointsMaterial({ size: .18, vertexColors: true, transparent: true, opacity: .4 })
    const pts  = new THREE.Points(geo, mat)
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

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.4-1.33-1.77-1.33-1.77-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.9 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)
const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

export default function Home() {
  const canvasRef = useRef(null)
  const [projects, setProjects] = useState(MOCK_PROJECTS)
  const [skills,   setSkills]   = useState(MOCK_SKILLS)

  useThreeBackground(canvasRef)
  useScrollReveal()

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* HERO */}
      <div className={styles.hero} id="about">
        <div className={styles.avSide}>
          <div className={styles.avDecoBig} />
          <div className={styles.avDecoSm} />
          <div className={styles.avRing}>
            <span className={styles.avInitials}>MA</span>
          </div>
          <p className={styles.avCaption}>* Replace with your photo</p>
        </div>

        <div className={styles.aboutText}>
          <span className={`${styles.aboutTag} fi`}>About Me</span>

          <h1 className={`${styles.headline} fi d1`}>
            Building backends that<br />
            <em>power great products</em>
          </h1>

          <p className={`${styles.bio} fi d2`}>
            I'm a Computer Engineering graduate currently focusing on Artificial Intelligence
            and backend development. I enjoy building practical projects and continuously improving
            my skills in Python, Django, and AI.
          </p>

          <div className={`${styles.infoBox} fi d2`}>
            {[
              ['Name',     'Moslem Amiri'],
              ['Focus',    'Backend & AI'],
              ['GitHub',   '@mosllems'],
              ['LinkedIn', 'in/mosllems'],
              ['Degree',   'Computer Engineering'],
              ['Freelance','Available'],
            ].map(([k, v]) => (
              <div key={k} className={styles.infoCell}>
                <div className={styles.infoLbl}>{k}</div>
                <div className={styles.infoVal}>{v}</div>
              </div>
            ))}
          </div>

          <div className={`${styles.btns} fi d3`}>
            <a href="#" className="btn-og"><DownloadIcon /> Download CV</a>
            <Link to="/contact" className="btn-out">Contact me →</Link>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* SKILLS */}
      <section className="section-alt" id="skills">
        <div className="sec-head fi">
          <h2>My Work <em>Skills</em></h2>
          <p>Technologies and tools I use to build robust backend systems and AI-powered applications.</p>
        </div>
        <div className={styles.skillsGrid}>
          {skills.map((s, i) => (
            <div key={s.id} className={`${styles.skillCard} fi d${(i % 4) + 1}`}>
              <div className={styles.skillName}>{s.name}</div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.divider} />

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="sec-head fi">
          <h2>My <em>Services</em></h2>
          <p>What I can build for you — from scalable APIs to AI-integrated web systems.</p>
        </div>
        <div className={styles.servicesGrid}>
          {[
            { title: 'Backend Development', desc: 'Scalable, secure Django backends with clean architecture, authentication, and well-designed database schemas ready for production.' },
            { title: 'AI Integration',      desc: 'Integrating ML models and AI capabilities into web applications — intelligent APIs, data pipelines, and smart automation.' },
            { title: 'RESTful APIs',         desc: 'Clean, documented REST APIs powering web and mobile apps — proper versioning, rate limiting, and authentication built-in.' },
          ].map((svc, i) => (
            <div key={svc.title} className={`${styles.svcCard} fi d${i + 1}`}>
              <div className={styles.svcImg}>
                <div className={styles.svcArrow}>→</div>
              </div>
              <div className={styles.svcBody}>
                <h3 className={styles.svcTitle}>{svc.title}</h3>
                <p className={styles.svcDesc}>{svc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.divider} />

      {/* PROJECTS */}
      <section className="section-alt" id="projects">
        <div className="sec-head fi">
          <h2>My <em>Projects</em></h2>
          <p>A selection of things I've built. More on GitHub.</p>
        </div>
        <div className={styles.projGrid}>
          {projects.map((p, i) => (
            <div key={p.id} className={`${styles.projCard} fi d${i + 1}`}>
              <div className={styles.projTop}>
                <span className={styles.projIco}>{'</>'}</span>
                <div className={styles.projLinks}>
                  <a href={p.github} target="_blank" rel="noreferrer" className={styles.projLink}><GithubIcon /></a>
                  <a href={p.live}   target="_blank" rel="noreferrer" className={styles.projLink}><ExternalIcon /></a>
                </div>
              </div>
              <h3 className={styles.projName}>{p.name}</h3>
              <p className={styles.projDesc}>{p.description}</p>
              <div className={styles.projTags}>
                {p.tags.map(t => <span key={t} className={styles.ptag}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.seeAll}>
          <Link to="/resume" className="btn-og">See All Projects →</Link>
        </div>
      </section>

      <div className={styles.divider} />

      {/* CTA */}
      <section className="section">
        <div className={`${styles.cta} fi`}>
          <div>
            <h3>Want to work together?</h3>
            <p>Download my resume or reach out directly — I'm open to new opportunities.</p>
          </div>
          <div className={styles.ctaBtns}>
            <a href="#" className="btn-og"><DownloadIcon /> Download Resume</a>
            <a href="https://www.linkedin.com/in/mosllems/" target="_blank" rel="noreferrer" className="btn-out">LinkedIn →</a>
          </div>
        </div>
      </section>
    </>
  )
}
