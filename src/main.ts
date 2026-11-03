import './style.css'

// ---- Edit these ----
const CONTACT_EMAIL = 'simon.joven.delvillar@gmail.com'

// --------------------

document.documentElement.classList.add('js')

/* Nav */
const nav = document.querySelector<HTMLElement>('#nav')!
const menu = document.querySelector<HTMLButtonElement>('#menu')!
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open')
  menu.setAttribute('aria-expanded', String(open))
})
nav.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    nav.classList.remove('open')
    menu.setAttribute('aria-expanded', 'false')
  }),
)
const onScroll = (): void => {
  nav.classList.toggle('scrolled', window.scrollY > 12)
}
window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

/* Scroll reveal */
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in')
        io.unobserve(e.target)
      }
    }
  },
  { threshold: 0.15 },
)
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))

/* Hero waves: interference lines that swell near the pointer */
function startWaves(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d')!
  const hero = canvas.parentElement!
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const LINES = 26
  let w = 0
  let h = 0
  let mx = -999
  let my = -999
  let tx = -999
  let ty = -999
  let grad: CanvasGradient

  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = hero.clientWidth
    h = hero.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    grad = ctx.createLinearGradient(0, 0, w, 0)
    grad.addColorStop(0, '#4fd8ff')
    grad.addColorStop(0.55, '#8b7bff')
    grad.addColorStop(1, '#ff7a59')
  }

  function draw(t: number): void {
    mx += (tx - mx) * 0.08
    my += (ty - my) * 0.08
    ctx.clearRect(0, 0, w, h)
    ctx.lineWidth = 1.4
    ctx.strokeStyle = grad
    for (let i = 0; i < LINES; i++) {
      const base = h * 0.12 + (h * 0.8 * i) / (LINES - 1)
      ctx.globalAlpha = 0.18 + 0.5 * Math.sin((i / (LINES - 1)) * Math.PI)
      ctx.beginPath()
      for (let x = 0; x <= w; x += 8) {
        const d2 = (x - mx) ** 2 + (base - my) ** 2
        const boost = 1 + 2.2 * Math.exp(-d2 / (2 * 170 * 170))
        const y =
          base +
          (Math.sin(x * 0.007 + t * 0.0005 + i * 0.32) * 16 + Math.sin(x * 0.015 - t * 0.0007 + i * 0.18) * 9) * boost
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
    if (!reduce) requestAnimationFrame(draw)
  }

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect()
    tx = e.clientX - r.left
    ty = e.clientY - r.top
  })
  window.addEventListener('resize', () => {
    resize()
    if (reduce) draw(0)
  })
  resize()
  requestAnimationFrame(draw)
}
startWaves(document.querySelector<HTMLCanvasElement>('#waves')!)

/* Contact form */
const host = document.querySelector<HTMLDivElement>('#contact-form')!
host.innerHTML = `
  <form id="f" novalidate>
    <label>Your name <input name="name" required autocomplete="name" /></label>
    <div class="row">
      <label>Subject
        <select name="subject"><option>Mathematics</option><option>Physics</option><option>Both</option></select>
      </label>
      <label>Level
        <select name="level"><option>High school</option><option>University</option></select>
      </label>
    </div>
    <label>What do you need help with? <textarea name="message" rows="4" required></textarea></label>
    <button class="btn" type="submit">Send message</button>
    <p id="msg" role="status"></p>
  </form>`
const form = host.querySelector<HTMLFormElement>('#f')!
const status = host.querySelector<HTMLParagraphElement>('#msg')!
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const d = new FormData(form)
  const name = String(d.get('name') ?? '').trim()
  const message = String(d.get('message') ?? '').trim()
  if (!name || !message) {
    status.textContent = 'Add your name and a message, then send again.'
    return
  }
  const subject = encodeURIComponent(`Tutoring inquiry: ${d.get('subject')} (${d.get('level')})`)
  const body = encodeURIComponent(`${message}\n\n— ${name}`)
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  status.textContent = 'Opening your email app…'
})

document.querySelector<HTMLSpanElement>('#year')!.textContent = String(new Date().getFullYear())
