<script setup lang="ts">
interface User {
  id: string
  username: string
  createdAt: string
}

interface Submission {
  id: string
  content: string
  socialHandle: string
  status: string
  votes: number
  isPublic: boolean
  responseUrl: string | null
  createdAt: string
  updatedAt: string
}

const user = ref<User | null>(null)
const submissions = ref<Submission[]>([])
const loading = ref(true)

// Auth state
const showLogin = ref(true)
const username = ref('')
const password = ref('')
const authError = ref('')
const authLoading = ref(false)

onMounted(async () => {
  const userId = localStorage.getItem('user_id')
  if (userId) {
    await loadUser(userId)
  }
  loading.value = false
})

const loadUser = async (userId: string) => {
  try {
    const userData = await $fetch<User | null>('/api/auth/me', {
      headers: { 'x-user-id': userId }
    })
    if (userData) {
      user.value = userData
      await loadSubmissions(userId)
    } else {
      localStorage.removeItem('user_id')
    }
  } catch (error) {
    localStorage.removeItem('user_id')
  }
}

const loadSubmissions = async (userId: string) => {
  try {
    const data = await $fetch<Submission[]>('/api/submissions/user', {
      headers: { 'x-user-id': userId }
    })
    submissions.value = data
  } catch (error) {
    console.error('Failed to load submissions:', error)
  }
}

const login = async () => {
  authError.value = ''
  authLoading.value = true
  try {
    const userData = await $fetch<User>('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    localStorage.setItem('user_id', userData.id)
    user.value = userData
    await loadSubmissions(userData.id)
    username.value = ''
    password.value = ''
  } catch (error: any) {
    authError.value = error?.data?.statusMessage || 'Login failed'
  } finally {
    authLoading.value = false
  }
}

const register = async () => {
  authError.value = ''
  authLoading.value = true
  try {
    const userData = await $fetch<User>('/api/auth/register', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    localStorage.setItem('user_id', userData.id)
    user.value = userData
    username.value = ''
    password.value = ''
  } catch (error: any) {
    authError.value = error?.data?.statusMessage || 'Registration failed'
  } finally {
    authLoading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('user_id')
  user.value = null
  submissions.value = []
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
  <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
    <div v-if="loading" style="color: var(--muted);">Loading...</div>

    <!-- Not logged in -->
    <template v-else-if="!user">
      <h2 style="border: none; padding: 0; margin: 0 0 2rem 0;">{{ showLogin ? 'Login' : 'Register' }}</h2>

      <form @submit.prevent="showLogin ? login() : register()">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" placeholder="Username" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Password" required />
        </div>

        <div v-if="authError" style="color: #dc3545; margin-bottom: 1rem;">{{ authError }}</div>

        <button type="submit" :disabled="authLoading">
          {{ authLoading ? 'Loading...' : (showLogin ? 'Login' : 'Register') }}
        </button>
      </form>

      <div style="margin-top: 1.5rem; color: var(--muted);">
        <span v-if="showLogin">
          Don't have an account?
          <button @click="showLogin = false" style="padding: 0; border: none; background: none; color: var(--fg); text-decoration: underline; cursor: pointer;">Register</button>
        </span>
        <span v-else>
          Already have an account?
          <button @click="showLogin = true" style="padding: 0; border: none; background: none; color: var(--fg); text-decoration: underline; cursor: pointer;">Login</button>
        </span>
      </div>

      <NuxtLink to="/" style="display: block; margin-top: 2rem; color: var(--muted);">Back</NuxtLink>
    </template>

    <!-- Logged in -->
    <template v-else>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
        <h2 style="border: none; padding: 0; margin: 0;">{{ user.username }}</h2>
        <div style="display: flex; gap: 1rem;">
          <button @click="logout" style="padding: 0.25rem 0.5rem; border-color: var(--border); color: var(--muted);">Logout</button>
          <NuxtLink to="/" style="color: var(--muted);">Back</NuxtLink>
        </div>
      </div>

      <div style="color: var(--muted); margin-bottom: 2rem;">{{ submissions.length }} submission{{ submissions.length !== 1 ? 's' : '' }}</div>

      <div v-if="!submissions.length" class="empty">
        No submissions yet. <NuxtLink to="/" style="color: var(--fg);">Submit your first request</NuxtLink>
      </div>

      <div v-for="submission in submissions" :key="submission.id" class="item">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
          <div class="item-meta">{{ formatDate(submission.createdAt) }}</div>
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <span :style="{ color: statusColor(submission.status), border: '1px solid ' + statusColor(submission.status), padding: '0.25rem 0.5rem' }">
              {{ submission.status }}
            </span>
            <span class="item-meta">{{ submission.isPublic ? 'Public' : 'Private' }}</span>
          </div>
        </div>

        <div class="item-content">{{ submission.content }}</div>

        <div v-if="submission.responseUrl" style="margin-top: 0.75rem;">
          <img :src="submission.responseUrl" alt="Completed visual" style="max-width: 100%; border: 1px solid var(--border);" />
        </div>

        <div v-if="submission.votes > 0" class="item-meta" style="margin-top: 0.75rem;">
          {{ submission.votes }} vote{{ submission.votes !== 1 ? 's' : '' }}
        </div>
      </div>
    </template>
  </div>
</template>
