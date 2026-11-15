import { useEffect } from 'react'
import * as THREE from 'three'

// Same particle background and scroll-reveal used across the site's pages.

export function useThreeBackground(canvasRef) {
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
      pos[i*3] = (Math.random() - .5) * 140; pos[i*3+1] = (Math.random() - .5) * 140; pos[i*3+2] = (Math.random() - .5) * 70
      const c = new THREE.Color().setHSL(0.06 + Math.random() * 0.05, 0.8, 0.4 + Math.random() * 0.25)
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    const mat = new THREE.PointsMaterial({ size: .18, vertexColors: true, transparent: true, opacity: .4 })
    const pts = new THREE.Points(geo, mat)
    scene.add(pts)

    let mx = 0, my = 0, t = 0, frame
    const onMouse = e => { mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2 }
    document.addEventListener('mousemove', onMouse)

    const loop = () => {
      frame = requestAnimationFrame(loop)
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
      cancelAnimationFrame(frame)
      document.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      geo.dispose(); mat.dispose(); renderer.dispose()
    }
  }, [canvasRef])
}

export function useScrollReveal(deps = []) {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fi:not(.on)').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
