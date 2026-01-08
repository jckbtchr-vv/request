'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [content, setContent] = useState('')
  const [socialHandle, setSocialHandle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, socialHandle }),
      })

      if (response.ok) {
        setSuccess(true)
        setContent('')
        setSocialHandle('')
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (error) {
      console.error('Failed to submit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="hero">
        <h1>Request a Visual</h1>
        <p className="mono" style={{ fontSize: '1.1rem', maxWidth: '760px' }}>
          Submit your link or quote with your social handle to request a visual in VV style.
        </p>
      </div>

      <div className="content">
        <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
          <Link href="/admin" className="nav-link">
            Admin Dashboard
          </Link>
        </div>

        {success && (
          <div className="success-message" style={{ marginBottom: '2rem' }}>
            ✓ Request Submitted Successfully
          </div>
        )}

        <div className="form-card">
          <h2>New Request</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="content">Link or Quote</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste a link or enter a quote..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="socialHandle">Your Social Handle</label>
              <input
                id="socialHandle"
                type="text"
                value={socialHandle}
                onChange={(e) => setSocialHandle(e.target.value)}
                placeholder="@username"
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
