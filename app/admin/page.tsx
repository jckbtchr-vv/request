'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Submission {
  id: string
  content: string
  socialHandle: string
  status: string
  response: string | null
  responseUrl: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    status: '',
    response: '',
    responseUrl: ''
  })

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions')
      const data = await response.json()
      setSubmissions(data)
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (submission: Submission) => {
    setEditingId(submission.id)
    setEditForm({
      status: submission.status,
      response: submission.response || '',
      responseUrl: submission.responseUrl || ''
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditForm({ status: '', response: '', responseUrl: '' })
  }

  const updateSubmission = async (id: string) => {
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        await fetchSubmissions()
        cancelEditing()
      }
    } catch (error) {
      console.error('Failed to update submission:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="hero">
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <>
      <div className="hero">
        <h1>Admin Dashboard</h1>
        <p className="mono" style={{ fontSize: '1.1rem', maxWidth: '760px' }}>
          Review and respond to visual requests. Total submissions: {submissions.length}
        </p>
      </div>

      <div className="content">
        <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
          <Link href="/" className="nav-link">
            Back to Form
          </Link>
        </div>

        <div className="admin-grid">
          {submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p className="mono" style={{ color: 'var(--muted)' }}>
                No submissions yet.
              </p>
            </div>
          ) : (
            submissions.map((submission) => (
              <div key={submission.id} className="submission-card">
                <div className="submission-header">
                  <div>
                    <div className="submission-meta">
                      Submitted: {formatDate(submission.createdAt)}
                    </div>
                    <div className="submission-meta">
                      Handle: {submission.socialHandle}
                    </div>
                  </div>
                  <span className={`status-badge status-${submission.status}`}>
                    {submission.status}
                  </span>
                </div>

                <div className="submission-content">
                  {submission.content}
                </div>

                {submission.responseUrl && (
                  <div style={{ marginTop: '1rem' }}>
                    <div className="label" style={{ marginBottom: '0.5rem' }}>Response URL:</div>
                    <a 
                      href={submission.responseUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        fontFamily: 'Departure Mono, monospace', 
                        fontSize: '0.9rem',
                        color: 'var(--accent)',
                        textDecoration: 'underline'
                      }}
                    >
                      {submission.responseUrl}
                    </a>
                  </div>
                )}

                {submission.response && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5' }}>
                    <div className="label" style={{ marginBottom: '0.5rem' }}>Admin Notes:</div>
                    <p className="mono" style={{ fontSize: '0.9rem', margin: 0 }}>
                      {submission.response}
                    </p>
                  </div>
                )}

                <div className="response-form">
                  {editingId === submission.id ? (
                    <>
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--grid)',
                            background: 'white',
                            fontFamily: 'Departure Mono, monospace'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Response URL (uploaded visual)</label>
                        <input
                          type="text"
                          value={editForm.responseUrl}
                          onChange={(e) => setEditForm({ ...editForm, responseUrl: e.target.value })}
                          placeholder="https://..."
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--grid)',
                            fontFamily: 'Departure Mono, monospace'
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label>Admin Notes</label>
                        <textarea
                          value={editForm.response}
                          onChange={(e) => setEditForm({ ...editForm, response: e.target.value })}
                          placeholder="Internal notes..."
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--grid)',
                            minHeight: '100px',
                            fontFamily: 'Departure Mono, monospace'
                          }}
                        />
                      </div>

                      <div className="button-group">
                        <button onClick={() => updateSubmission(submission.id)}>
                          Save Changes
                        </button>
                        <button onClick={cancelEditing} style={{ opacity: 0.7 }}>
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <button 
                      onClick={() => startEditing(submission)}
                      style={{ width: '100%' }}
                    >
                      Edit Response
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

