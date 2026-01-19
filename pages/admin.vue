<script setup lang="ts">
interface Submission {
  id: string
  content: string
  socialHandle: string
  email: string | null
  status: string
  votes: number
  response: string | null
  responseUrl: string | null
  createdAt: string
  updatedAt: string
}

const { data: submissions, pending: loading, refresh } = await useFetch<Submission[]>('/api/submissions')

const editingId = ref<string | null>(null)
const uploading = ref(false)
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

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  uploading.value = true
  const file = input.files[0]
  const formData = new FormData()
  formData.append('file', file)

  try {
    const result = await $fetch<{ url: string }>('/api/upload', {
      method: 'POST',
      body: formData
    })
    editForm.value.responseUrl = result.url
  } catch (error) {
    console.error('Upload failed:', error)
  } finally {
    uploading.value = false
  }
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
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: '#ffc107',
    approved: '#17a2b8',
    completed: '#28a745',
    rejected: '#dc3545'
  }
  return colors[status] || '#fff'
}
</script>

<template>
  <div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
      <h2 style="border: none; padding: 0; margin: 0;">Admin</h2>
      <NuxtLink to="/" style="color: var(--muted);">Back</NuxtLink>
    </div>

    <div v-if="loading" style="color: var(--muted);">Loading...</div>

    <div v-else>
      <div style="color: var(--muted); margin-bottom: 2rem;">{{ submissions?.length || 0 }} submissions</div>

      <div v-if="!submissions?.length" class="empty">No submissions yet.</div>

      <div v-for="submission in submissions" :key="submission.id" class="item">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
          <div>
            <div class="item-meta">{{ formatDate(submission.createdAt) }}</div>
            <div class="item-meta">{{ submission.socialHandle }}</div>
            <div v-if="submission.email" class="item-meta">{{ submission.email }}</div>
          </div>
          <div style="text-align: right;">
            <span :style="{ color: statusColor(submission.status), border: '1px solid ' + statusColor(submission.status), padding: '0.25rem 0.5rem' }">
              {{ submission.status }}
            </span>
            <div v-if="submission.votes > 0" class="item-meta" style="margin-top: 0.5rem;">
              {{ submission.votes }} vote{{ submission.votes !== 1 ? 's' : '' }}
            </div>
          </div>
        </div>

        <div class="item-content">{{ submission.content }}</div>

        <div v-if="submission.responseUrl" style="margin: 0.75rem 0;">
          <img :src="submission.responseUrl" alt="Visual" style="max-width: 100%; border: 1px solid var(--border);" />
        </div>

        <div v-if="submission.response" style="padding: 0.75rem; background: #111; border: 1px solid var(--border); margin-bottom: 0.75rem;">
          <div class="item-meta">Notes</div>
          <div>{{ submission.response }}</div>
        </div>

        <div style="padding-top: 0.75rem; border-top: 1px solid var(--border);">
          <template v-if="editingId === submission.id">
            <div class="form-group">
              <label>Status</label>
              <select v-model="editForm.status">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div class="form-group">
              <label>Upload Visual</label>
              <input type="file" accept="image/*" @change="handleFileUpload" :disabled="uploading" />
              <div v-if="uploading" class="item-meta">Uploading...</div>
            </div>

            <div v-if="editForm.responseUrl" style="margin-bottom: 1rem;">
              <img :src="editForm.responseUrl" alt="Preview" style="max-width: 100%; border: 1px solid var(--border);" />
            </div>

            <div class="form-group">
              <label>Or paste URL</label>
              <input v-model="editForm.responseUrl" type="text" placeholder="https://..." />
            </div>

            <div class="form-group">
              <label>Notes</label>
              <textarea v-model="editForm.response" placeholder="Internal notes..." />
            </div>

            <div style="display: flex; gap: 1rem;">
              <button @click="updateSubmission(submission.id)" :disabled="uploading">Save</button>
              <button @click="cancelEditing">Cancel</button>
            </div>
          </template>

          <button v-else style="width: 100%;" @click="startEditing(submission)">Edit</button>
        </div>
      </div>
    </div>
  </div>
</template>
