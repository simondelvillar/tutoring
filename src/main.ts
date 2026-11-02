import './style.css'

// ---- Edit these ----
const CONTACT_EMAIL = 'you@example.com'

interface Subject {
  name: string
  levels: string
  blurb: string
}

const subjects: Subject[] = [
  { name: 'Math', levels: 'Grades 6–12', blurb: 'Algebra, geometry, pre-calculus and calculus, worked step by step.' },
  { name: 'Science', levels: 'Grades 6–12', blurb: 'Biology, chemistry and physics with plenty of practice problems.' },
  { name: 'Writing', levels: 'Grades 6–12', blurb: 'Essays, lab reports and editing, with feedback you can act on.' },
]
// --------------------

function renderSubjects(list: HTMLElement, items: Subject[]): void {
  list.innerHTML = items
    .map(
      (s) => `
      <li>
        <h3>${s.name}</h3>
        <p class="levels">${s.levels}</p>
        <p>${s.blurb}</p>
      </li>`,
    )
    .join('')
}

function renderForm(host: HTMLElement): void {
  host.innerHTML = `
    <form id="f" novalidate>
      <label>Your name <input name="name" required autocomplete="name" /></label>
      <label>Subject
        <select name="subject">${subjects.map((s) => `<option>${s.name}</option>`).join('')}</select>
      </label>
      <label>Message <textarea name="message" rows="4" required></textarea></label>
      <button class="btn" type="submit">Send message</button>
      <p id="msg" role="status"></p>
    </form>`

  const form = host.querySelector<HTMLFormElement>('#f')!
  const status = host.querySelector<HTMLParagraphElement>('#msg')!

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    if (!name || !message) {
      status.textContent = 'Add your name and a message, then send again.'
      return
    }
    const subject = encodeURIComponent(`Tutoring inquiry: ${data.get('subject')}`)
    const body = encodeURIComponent(`${message}\n\n— ${name}`)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    status.textContent = 'Opening your email app…'
  })
}

renderSubjects(document.querySelector<HTMLUListElement>('#subjects')!, subjects)
renderForm(document.querySelector<HTMLDivElement>('#contact-form')!)
document.querySelector<HTMLSpanElement>('#year')!.textContent = String(new Date().getFullYear())
