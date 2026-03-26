import { useEffect, useMemo, useState } from 'react'
import './App.css'

const SUPPORTED_LOCALES = ['en', 'de', 'fr', 'es', 'it', 'pt', 'ja', 'zh']

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Francais' },
  { code: 'es', label: 'Espanol' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Portugues' },
  { code: 'ja', label: 'Japanese' },
  { code: 'zh', label: 'Chinese' },
]

function parseProperties(text) {
  const props = {}

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const idx = line.indexOf('=')
    if (idx <= 0) continue

    const key = line.slice(0, idx).trim()
    const value = line
      .slice(idx + 1)
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      )
    props[key] = value
  }

  return props
}

async function loadBundle(lang) {
  const suffix = lang === 'en' ? '' : `_${lang}`

  try {
    const response = await fetch(`../i18n/i18n${suffix}.properties`)
    if (!response.ok) throw new Error('Failed loading bundle')
    return parseProperties(await response.text())
  } catch {
    if (lang !== 'en') return loadBundle('en')
    return {}
  }
}

function App() {
  const browserLang = navigator.language.split('-')[0]
  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [translations, setTranslations] = useState({})
  const [locale, setLocale] = useState(
    SUPPORTED_LOCALES.includes(browserLang) ? browserLang : 'en',
  )

  useEffect(() => {
    document.documentElement.lang = locale

    let active = true
    loadBundle(locale).then((bundle) => {
      if (active) setTranslations(bundle)
    })

    return () => {
      active = false
    }
  }, [locale])

  useEffect(() => {
    let active = true

    const loadCourses = async () => {
      const url =
        '/odata/v4/course/Courses' +
        '?$expand=professor($select=firstName,lastName)' +
        ',enrollments($select=status,grade;$expand=student($select=firstName,lastName))'

      const response = await fetch(url)
      const data = await response.json()
      if (active) setCourses(data.value || [])
    }

    loadCourses()

    return () => {
      active = false
    }
  }, [])

  const semesters = useMemo(
    () => [...new Set(courses.map((course) => course.semester))].sort(),
    [courses],
  )

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase()

    return courses.filter((course) => {
      const professorName = course.professor
        ? `${course.professor.firstName} ${course.professor.lastName}`.toLowerCase()
        : ''

      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        professorName.includes(q)
      const matchesSemester =
        !semesterFilter || course.semester === semesterFilter

      return matchesSearch && matchesSemester
    })
  }, [courses, search, semesterFilter])

  const t = translations

  const toggle = (id) => {
    setExpanded((current) => (current === id ? null : id))
  }

  const statusLabel = (status) => {
    const key = `Status${status.charAt(0).toUpperCase()}${status.slice(1)}`
    return t[key] || status
  }

  return (
    <div className="app">
      <h1>{t.AppTitle}</h1>

      <div className="filters">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t.SearchPlaceholder || ''}
        />
        <select
          value={semesterFilter}
          onChange={(event) => setSemesterFilter(event.target.value)}
        >
          <option value="">{t.AllSemesters}</option>
          {semesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>
        <select
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
        >
          {LOCALES.map((entry) => (
            <option key={entry.code} value={entry.code}>
              {entry.label}
            </option>
          ))}
        </select>
      </div>

      {filteredCourses.length === 0 && <div className="empty">{t.NoCourses}</div>}

      {filteredCourses.map((course) => (
        <div
          key={course.ID}
          className="course-card"
          onClick={() => toggle(course.ID)}
        >
          <div className="course-header">
            <span className="course-title">{course.title}</span>
            <span className="badge badge-credits">
              {course.credits} {t.Credits}
            </span>
          </div>
          <div className="course-meta">
            <span>{course.semester}</span>
            {course.professor && (
              <span>
                {t.Professor}: {course.professor.firstName}{' '}
                {course.professor.lastName}
              </span>
            )}
            <span>
              {course.enrollments.length}{' '}
              {course.enrollments.length !== 1 ? t.Students : t.Student}
            </span>
          </div>

          {expanded === course.ID && (
            <div className="detail-panel">
              {course.description && (
                <>
                  <h3>{t.Description}</h3>
                  <p>{course.description}</p>
                </>
              )}
              <h3>{t.Enrollments}</h3>
              {course.enrollments.length > 0 ? (
                <table className="enrollment-table">
                  <thead>
                    <tr>
                      <th>{t.Student}</th>
                      <th>{t.Status}</th>
                      <th>{t.Grade}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.enrollments.map((enrollment) => (
                      <tr key={enrollment.ID}>
                        <td>
                          {enrollment.student.firstName}{' '}
                          {enrollment.student.lastName}
                        </td>
                        <td>
                          <span
                            className={`status status-${enrollment.status}`}
                          >
                            {statusLabel(enrollment.status)}
                          </span>
                        </td>
                        <td>{enrollment.grade || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-enrollments">{t.NoEnrollments}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default App
