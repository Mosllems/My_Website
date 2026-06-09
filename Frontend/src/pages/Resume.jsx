import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import styles from './Resume.module.css'

// Placeholders — replace with API data once backend is ready
const MOCK_ME = {
  first_name:   'Moslem',
  last_name:    'Amiri',
  bio:          "Computer Engineering graduate focused on backend development and AI. Building practical, impactful tech solutions.",
  address:      'Iran',
  phone_number: '+98 --- --- ----',
  email:        'your@email.com',
}

const MOCK_EDUCATION = [
  {
    id:          1,
    degree:      'Bachelor of Computer Engineering',
    major:       'Computer Engineering',
    institution: 'Islamic Azad University Eslamshahr Branch',
    location:    'Iran, Tehran',
    start_date:  '2021',
    end_date:    '2025',
    is_current:  false,
    gpa:         19.19,
    description: '',
  },
]

const MOCK_EXPERIENCE = [
  // Add your experience entries here once you have them
  // {
  //   id:               1,
  //   position:         'Backend Developer',
  //   company:          'Company Name',
  //   location:         'Iran',
  //   start_date:       '2024',
  //   end_date:         null,
  //   is_current:       true,
  //   responsibilities: ['Built REST APIs', 'Managed PostgreSQL databases'],
  //   description:      '',
  // },
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

function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fi').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function Resume() {
  const canvasRef = useRef(null)
  const [me,         setMe]         = useState(MOCK_ME)
  const [education,  setEducation]  = useState(MOCK_EDUCATION)
  const [experience, setExperience] = useState(MOCK_EXPERIENCE)

  useThreeBackground(canvasRef)
  useScrollReveal()

  // Uncomment when backend is ready:
  // useEffect(() => {
  //   getResumeInfo().then(res => {
  //     setMe(res.data.me)
  //     setEducation(res.data.education)
  //   }).catch(console.error)
  // }, [])

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.page}>

        {/* PAGE TITLE */}
        <div className={styles.pageTitle}>
          <h1>Resume</h1>
        </div>

        {/* BREADCRUMB */}
        <div className={styles.breadcrumbBar}>
          <div className={styles.breadcrumb}>
            <Link to="/"       className={styles.bcLink}>Home</Link>
            <span className={styles.sep}>›</span>
            <Link to="/resume" className={styles.bcCurrent}>Resume</Link>
          </div>
        </div>

        {/* CONTENT */}
        <section className={styles.section}>
          <div className={styles.grid}>

            {/* LEFT COLUMN */}
            <div className={styles.col}>

              {/* Summary */}
              <h3 className={`${styles.colTitle} fi`}>Summary</h3>
              <div className={`${styles.resumeItem} ${styles.summaryItem} fi d1`}>
                <h4>{me.first_name} {me.last_name}</h4>
                <p className={styles.summaryBio}>{me.bio}</p>
                <ul className={styles.summaryList}>
                  <li>{me.address}</li>
                  <li>{me.phone_number}</li>
                  <li>{me.email}</li>
                </ul>
              </div>

              {/* Education */}
              <h3 className={`${styles.colTitle} fi`}>Education</h3>
              {education.map((edu, i) => (
                <div key={edu.id} className={`${styles.resumeItem} fi d${(i % 3) + 1}`}>
                  <h4>{edu.degree}</h4>
                  <ul className={styles.eduList}>
                    <li><strong>Major:</strong> {edu.major}</li>
                    <li>
                      <strong>Years:</strong> {edu.start_date} – {edu.is_current ? 'Present' : edu.end_date}
                    </li>
                    <li><strong>Institution:</strong> {edu.institution}</li>
                    <li><strong>Location:</strong> {edu.location}</li>
                    {edu.gpa && <li><strong>GPA:</strong> {edu.gpa}</li>}
                  </ul>
                  {edu.description && <p className={styles.eduDesc}>{edu.description}</p>}
                </div>
              ))}

            </div>

            {/* RIGHT COLUMN — Professional Experience */}
            <div className={styles.col}>
              <h3 className={`${styles.colTitle} fi`}>Professional Experience</h3>
              {experience.length === 0 ? (
                <div className={`${styles.resumeItem} ${styles.emptyItem} fi d1`}>
                  <p>No experience entries yet.</p>
                </div>
              ) : (
                experience.map((exp, i) => (
                  <div key={exp.id} className={`${styles.resumeItem} fi d${(i % 3) + 1}`}>
                    <h4>{exp.position}</h4>
                    <ul className={styles.eduList}>
                      <li><strong>Company:</strong> {exp.company}</li>
                      <li>
                        <strong>Years:</strong> {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                      </li>
                      <li><strong>Location:</strong> {exp.location}</li>
                    </ul>
                    {exp.responsibilities.length > 0 && (
                      <ul className={styles.respList}>
                        {exp.responsibilities.map((r, j) => <li key={j}>{r}</li>)}
                      </ul>
                    )}
                    {exp.description && <p className={styles.eduDesc}>{exp.description}</p>}
                  </div>
                ))
              )}
            </div>

          </div>
        </section>

      </div>
    </>
  )
}
