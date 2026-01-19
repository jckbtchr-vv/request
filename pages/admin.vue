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
        <h1>Admin</h1>
        <p>{{ submissions?.length || 0 }} submissions</p>
      </div>

      <div class="content">
        <div style="margin-bottom: 2rem">
          <NuxtLink to="/" class="nav-link">Back</NuxtLink>
        </div>

        <div class="admin-grid">
          <div v-if="!submissions?.length" style="padding: 2rem 0; color: var(--muted)">
            No submissions yet.
          </div>

          <div v-for="submission in submissions" :key="submission.id" class="submission-card">
            <div class="submission-header">
              <div>
                <div class="submission-meta">{{ formatDate(submission.createdAt) }}</div>
                <div class="submission-meta">{{ submission.socialHandle }}</div>
              </div>
              <span :class="`status-badge status-${submission.status}`">
                {{ submission.status }}
              </span>
            </div>

            <div class="submission-content">
              {{ submission.content }}
            </div>

            <div v-if="submission.responseUrl" style="margin-top: 1rem">
              <div class="label">Response URL</div>
              <a :href="submission.responseUrl" target="_blank" rel="noopener noreferrer" style="text-decoration: underline">
                {{ submission.responseUrl }}
              </a>
            </div>

            <div v-if="submission.response" style="margin-top: 1rem; padding: 1rem; background: #111; border: 1px solid var(--border)">
              <div class="label">Notes</div>
              <p style="margin: 0">{{ submission.response }}</p>
            </div>

            <div class="response-form">
              <template v-if="editingId === submission.id">
                <div class="form-group">
                  <label>Status</label>
                  <select v-model="editForm.status">
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Response URL</label>
                  <input v-model="editForm.responseUrl" type="text" placeholder="https://..." />
                </div>

                <div class="form-group">
                  <label>Notes</label>
                  <textarea v-model="editForm.response" placeholder="Internal notes..." />
                </div>

                <div class="button-group">
                  <button @click="updateSubmission(submission.id)">Save</button>
                  <button @click="cancelEditing">Cancel</button>
                </div>
              </template>

              <button v-else style="width: 100%" @click="startEditing(submission)">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
