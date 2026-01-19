<script setup lang="ts">
interface Submission {
  id: string
  content: string
  socialHandle: string
  votes: number
  responseUrl: string | null
  createdAt: string
}

interface CompletedVisual {
  id: string
  title: string
  description: string | null
  imageUrl: string
  createdAt: string
}

interface User {
  id: string
  username: string
}

// Form state
const content = ref('')
const socialHandle = ref('')
const email = ref('')
const isPublic = ref(true)
const isSubmitting = ref(false)
const success = ref(false)

// Vote state
const votedIds = ref<Set<string>>(new Set())

// User state
const currentUser = ref<User | null>(null)

// Fetch approved (for voting) and completed (for browsing)
const { data: approved, refresh: refreshApproved } = await useFetch<Submission[]>('/api/submissions/approved')
const { data: completed, refresh: refreshCompleted } = await useFetch<Submission[]>('/api/submissions/completed')
const { data: visuals } = await useFetch<CompletedVisual[]>('/api/visuals')

onMounted(async () => {
  const stored = localStorage.getItem('votedIds')
  if (stored) {
    votedIds.value = new Set(JSON.parse(stored))
  }

  // Check for logged in user
  const userId = localStorage.getItem('user_id')
  if (userId) {
    try {
      const user = await $fetch<User | null>('/api/auth/me', {
        headers: { 'x-user-id': userId }
      })
      if (user) {
        currentUser.value = user
      } else {
        localStorage.removeItem('user_id')
      }
    } catch {
      localStorage.removeItem('user_id')
    }
  }
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const headers: Record<string, string> = {}
    if (currentUser.value) {
      headers['x-user-id'] = currentUser.value.id
    }
    await $fetch('/api/submissions', {
      method: 'POST',
      headers,
      body: {
        content: content.value,
        socialHandle: socialHandle.value,
        email: email.value || null,
        isPublic: isPublic.value
      }
    })
    success.value = true
    content.value = ''
    socialHandle.value = ''
    email.value = ''
    isPublic.value = true
    setTimeout(() => { success.value = false }, 3000)
  } catch (error) {
    console.error('Failed to submit:', error)
  } finally {
    isSubmitting.value = false
  }
}

const vote = async (id: string) => {
  if (votedIds.value.has(id)) return
  try {
    await $fetch(`/api/submissions/${id}/vote`, { method: 'POST' })
    votedIds.value.add(id)
    localStorage.setItem('votedIds', JSON.stringify([...votedIds.value]))
    await refreshApproved()
  } catch (error) {
    console.error('Failed to vote:', error)
  }
}

const hasVoted = (id: string) => votedIds.value.has(id)
</script>

<template>
  <div class="layout">
    <!-- SUBMIT -->
    <div class="column">
      <h2>Submit</h2>

      <div v-if="currentUser" style="margin-bottom: 1rem; color: var(--muted);">
        Logged in as <NuxtLink to="/profile" style="color: var(--fg);">{{ currentUser.username }}</NuxtLink>
      </div>
      <div v-else style="margin-bottom: 1rem; color: var(--muted);">
        <NuxtLink to="/profile" style="color: var(--fg);">Login</NuxtLink> to track submissions
      </div>

      <div v-if="success" class="success-message">Submitted</div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Link or Quote</label>
          <textarea v-model="content" placeholder="Paste a link or enter a quote..." required />
        </div>

        <div class="form-group">
          <label>Social Handle</label>
          <input v-model="socialHandle" type="text" placeholder="@username" required />
        </div>

        <div class="form-group">
          <label>Email (optional)</label>
          <input v-model="email" type="email" placeholder="you@example.com" />
        </div>

        <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem;">
          <input id="isPublic" v-model="isPublic" type="checkbox" style="width: auto;" />
          <label for="isPublic" style="margin: 0; color: var(--fg);">Public submission</label>
        </div>

        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </form>
    </div>

    <!-- VOTE -->
    <div class="column">
      <h2>Vote</h2>

      <div v-if="!approved?.length" class="empty">No submissions to vote on yet</div>

      <div v-for="item in approved" :key="item.id" class="item">
        <div class="item-content">{{ item.content }}</div>
        <div class="item-footer">
          <span class="item-meta">{{ item.socialHandle }}</span>
          <button :disabled="hasVoted(item.id)" @click="vote(item.id)">
            {{ hasVoted(item.id) ? `Voted (${item.votes})` : `Upvote (${item.votes})` }}
          </button>
        </div>
      </div>
    </div>

    <!-- BROWSE -->
    <div class="column">
      <h2>Browse</h2>

      <div v-if="!completed?.length && !visuals?.length" class="empty">No completed works yet</div>

      <!-- Standalone visuals -->
      <div v-for="visual in visuals" :key="visual.id" class="item">
        <img :src="visual.imageUrl" :alt="visual.title" class="browse-image" />
        <div class="item-content">{{ visual.title }}</div>
        <div v-if="visual.description" class="item-meta">{{ visual.description }}</div>
      </div>

      <!-- Completed submissions -->
      <div v-for="item in completed" :key="item.id" class="item">
        <img v-if="item.responseUrl" :src="item.responseUrl" :alt="item.content" class="browse-image" />
        <div class="item-content">{{ item.content }}</div>
        <div class="item-meta">{{ item.socialHandle }}</div>
      </div>
    </div>

    <NuxtLink to="/admin" class="admin-link">Admin</NuxtLink>
  </div>
</template>
