import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { getProfile, getSkills, getInterests, getEducation } from '../api/index'
import styles from './About.module.css'

// Placeholders — replace with API data once backend is ready
const MOCK_ME = {
  age:          '-- / -- / ----',
  email:        'your@email.com',
  website:      'moslem.dev',
  linkedin:     'in/mosllems',
  degree:       'Computer Engineering',
  phone_number: '+98 --- --- ----',
  github:       '@mosllems',
  address:      'Iran',
  bio:          "I'm a Computer Engineering graduate currently focusing on Artificial Intelligence and backend development. I enjoy building practical projects and continuously improving my skills in Python, Django, and AI — creating real-world solutions that combine AI with web technologies.",
}

const MOCK_CATEGORIES = [
  { id: 1, name: 'Backend Development', skills: [
    { id:1, name:'Python' }, { id:2, name:'Django' },
    { id:3, name:'Django REST Framework' }, { id:4, name:'FastAPI' },
    { id:5, name:'PostgreSQL' }, { id:6, name:'SQLite' },
  ]},
  { id: 2, name: 'AI / Machine Learning', skills: [
    { id:7, name:'TensorFlow' }, { id:8, name:'Scikit-learn' },
    { id:9, name:'Pandas' }, { id:10, name:'NumPy' }, { id:11, name:'OpenCV' },
  ]},
  { id: 3, name: 'DevOps & Tools', skills: [
    { id:12, name:'Docker' }, { id:13, name:'Git' },
    { id:14, name:'Linux' }, { id:15, name:'Nginx' }, { id:16, name:'VS Code' },
  ]},
]

const MOCK_INTERESTS = [
  { id:1, name:'Artificial Intelligence' },
  { id:2, name:'Backend Development' },
  { id:3, name:'Machine Learning' },
  { id:4, name:'Python' },
  { id:5, name:'Web Technologies' },
  { id:6, name:'Data Science' },
  { id:7, name:'Open Source' },
  { id:8, name:'Mobile Apps' },
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
    const N = 1600, pos = new Float32Array(N * 3), col = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      pos[i*3]=(Math.random()-.5)*140; pos[i*3+1]=(Math.random()-.5)*140; pos[i*3+2]=(Math.random()-.5)*70
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
    const onMouse = e => { mx=(e.clientX/innerWidth-.5)*2; my=(e.clientY/innerHeight-.5)*2 }
    document.addEventListener('mousemove', onMouse)
    const loop = () => { requestAnimationFrame(loop); t+=.0003; pts.rotation.y=t*.2+mx*.03; pts.rotation.x=my*.02; renderer.render(scene,camera) }
    loop()
    const onResize = () => { camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight) }
    window.addEventListener('resize', onResize)
    return () => { document.removeEventListener('mousemove',onMouse); window.removeEventListener('resize',onResize); renderer.dispose() }
  }, [canvasRef])
}

function useScrollReveal(deps = []) {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fi').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

function groupSkillsByCategory(skills) {
  const map = {}
  skills.forEach(skill => {
    const cat = skill.category
    if (!map[cat.id]) map[cat.id] = { id: cat.id, name: cat.name, skills: [] }
    map[cat.id].skills.push(skill)
  })
  return Object.values(map)
}

export default function About() {
  const canvasRef  = useRef(null)
  const [me,         setMe]         = useState(MOCK_ME)
  const [categories, setCategories] = useState(MOCK_CATEGORIES)
  const [interests,  setInterests]  = useState(MOCK_INTERESTS)
  const [degree,     setDegree]     = useState('Computer Engineering')

  useThreeBackground(canvasRef)
  useScrollReveal([categories, interests])

  useEffect(() => {
    getProfile()
      .then(res => setMe(res.data))
      .catch(() => {})

    getSkills()
      .then(res => { if (res.data.length) setCategories(groupSkillsByCategory(res.data)) })
      .catch(() => {})

    getInterests()
      .then(res => { if (res.data.length) setInterests(res.data) })
      .catch(() => {})

    getEducation()
      .then(res => {
        if (res.data.length) {
          const latest = res.data.reduce((a, b) =>
            new Date(b.end_date || '9999') > new Date(a.end_date || '9999') ? b : a
          )
          setDegree(latest.degree)
        }
      })
      .catch(() => {})
  }, [])

  const infoRows = [
    ['Birthday', me.age],
    ['Degree',   degree],
    ['Email',    me.email],
    ['Phone',    me.phone_number],
    ['Website',  me.website],
    ['Github',   me.github],
    ['LinkedIn', me.linkedin],
    ['Address',  me.address],
  ]

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.page}>

        <div className={styles.pageTitle}>
          <h1>About</h1>
        </div>

        <div className={styles.breadcrumbBar}>
          <div className={styles.breadcrumb}>
            <Link to="/"      className={styles.bcLink}>Home</Link>
            <span className={styles.sep}>›</span>
            <Link to="/about" className={styles.bcCurrent}>About</Link>
          </div>
        </div>

        {/* INFO */}
        <section className={styles.section}>
          <div className={styles.aboutGrid}>

            <div className={`${styles.imgWrap} fi`}>
              <div className={styles.aboutImg}>
                <span className={styles.imgPlaceholder}>MA</span>
              </div>
              <div className={styles.imgDeco} />
            </div>

            <div className={`${styles.aboutContent} fi d1`}>
              <h2><em>AI Enthusiast</em> &amp; Backend Developer</h2>
              <p className={styles.bio}>{me.bio}</p>

              <div className={styles.infoCols}>
                {infoRows.map(([key, val]) => (
                  <div key={key} className={styles.infoRow}>
                    <span className={styles.chevron}>›</span>
                    <span className={styles.infoKey}>{key}:</span>
                    <span className={styles.infoVal}>{val}</span>
                  </div>
                ))}
              </div>

              <div className={styles.btns}>
                <a href="#" className="btn-og">Download CV →</a>
                <Link to="/contact" className="btn-out">Contact Me →</Link>
              </div>
            </div>

          </div>
        </section>

        <div className={styles.divider} />

        {/* SKILLS */}
        <section className={styles.sectionAlt}>
          <div className={`${styles.secHead} fi`}>
            <h2>My <em>Skills</em></h2>
            <div className={styles.secUnderline} />
          </div>
          <div className={styles.skillsWrap}>
            {categories.map((cat, i) => (
              <div key={cat.id} className={`${styles.skillsCategory} fi d${(i % 3) + 1}`}>
                <div className={styles.catTitle}>{cat.name}</div>
                <div className={styles.skillsContainer}>
                  {cat.skills.map(skill => (
                    <div key={skill.id} className={styles.skillItem}>
                      <span className={styles.skillDot} />
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.divider} />

        {/* INTERESTS */}
        <section className={styles.section}>
          <div className={`${styles.secHead} fi`}>
            <h2>I&apos;m <em>Interested In</em></h2>
            <div className={styles.secUnderline} />
          </div>
          <div className={styles.interestsGrid}>
            {interests.map((item, i) => (
              <div key={item.id} className={`${styles.interestCard} fi d${(i % 4) + 1}`}>
                <div className={styles.interestIcon}>{item.icon || '✦'}</div>
                <span className={styles.interestName}>{item.name}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
