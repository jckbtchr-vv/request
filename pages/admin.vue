<script setup lang="ts">
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

const { data: submissions, pending: loading, refresh } = await useFetch<Submission[]>('/api/submissions')

const editingId = ref<string | null>(null)
const editForm = ref({
  status: '',
  response: '',
  responseUrl: ''
})

const startEditing = (submission: Submission) => {
  editingId.value = submission.id
  editForm.value = {
    status: submission.status,
    response: submission.response || '',
    responseUrl: submission.responseUrl || ''
  }
}

const cancelEditing = () => {
  editingId.value = null
  editForm.value = { status: '', response: '', responseUrl: '' }
}

const updateSubmission = async (id: string) => {
  try {
    await $fetch(`/api/submissions/${id}`, {
      method: 'PATCH',
      body: editForm.value
    })
    await refresh()
    cancelEditing()
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
</script>

<template>
  <div>
    <div v-if="loading" class="hero">
      <h1>Loading...</h1>
    </div>

    <template v-else>
      <div class="hero">
        <h1>Admin Dashboard</h1>
        <p class="mono" style="font-size: 1.1rem; max-width: 760px">
          Review and respond to visual requests. Total submissions: {{ submissions?.length || 0 }}
        </p>
      </div>

      <div class="content">
        <div style="text-align: right; margin-bottom: 2rem">
          <NuxtLink to="/" class="nav-link">
            Back to Form
          </NuxtLink>
        </div>

        <div class="admin-grid">
          <div v-if="!submissions?.length" style="text-align: center; padding: 4rem 0">
            <p class="mono" style="color: var(--muted)">
              No submissions yet.
            </p>
          </div>

          <div v-for="submission in submissions" :key="submission.id" class="submission-card">
            <div class="submission-header">
              <div>
                <div class="submission-meta">
                  Submitted: {{ formatDate(submission.createdAt) }}
                </div>
                <div class="submission-meta">
                  Handle: {{ submission.socialHandle }}
                </div>
              </div>
              <span :class="`status-badge status-${submission.status}`">
                {{ submission.status }}
              </span>
            </div>

            <div class="submission-content">
              {{ submission.content }}
            </div>

            <div v-if="submission.responseUrl" style="margin-top: 1rem">
              <div class="label" style="margin-bottom: 0.5rem">Response URL:</div>
              <a
                :href="submission.responseUrl"
                target="_blank"
                rel="noopener noreferrer"
                style="font-family: 'Departure Mono', monospace; font-size: 0.9rem; color: var(--accent); text-decoration: underline"
              >
                {{ submission.responseUrl }}
              </a>
            </div>

            <div v-if="submission.response" style="margin-top: 1rem; padding: 1rem; background: #f5f5f5">
              <div class="label" style="margin-bottom: 0.5rem">Admin Notes:</div>
              <p class="mono" style="font-size: 0.9rem; margin: 0">
                {{ submission.response }}
              </p>
            </div>

            <div class="response-form">
              <template v-if="editingId === submission.id">
                <div class="form-group">
                  <label>Status</label>
                  <select
                    v-model="editForm.status"
                    style="width: 100%; padding: 0.75rem; border: 1px solid var(--grid); background: white; font-family: 'Departure Mono', monospace"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Response URL (uploaded visual)</label>
                  <input
                    v-model="editForm.responseUrl"
                    type="text"
                    placeholder="https://..."
                    style="width: 100%; padding: 0.75rem; border: 1px solid var(--grid); font-family: 'Departure Mono', monospace"
                  />
                </div>

                <div class="form-group">
                  <label>Admin Notes</label>
                  <textarea
                    v-model="editForm.response"
                    placeholder="Internal notes..."
                    style="width: 100%; padding: 0.75rem; border: 1px solid var(--grid); min-height: 100px; font-family: 'Departure Mono', monospace"
                  />
                </div>

                <div class="button-group">
                  <button @click="updateSubmission(submission.id)">
                    Save Changes
                  </button>
                  <button style="opacity: 0.7" @click="cancelEditing">
                    Cancel
                  </button>
                </div>
              </template>

              <button v-else style="width: 100%" @click="startEditing(submission)">
                Edit Response
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
