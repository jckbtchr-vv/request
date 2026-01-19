<script setup lang="ts">
interface Submission {
  id: string
  content: string
  socialHandle: string
  votes: number
  createdAt: string
}

const { data: submissions, refresh } = await useFetch<Submission[]>('/api/submissions/approved')

const votedIds = ref<Set<string>>(new Set())

onMounted(() => {
  // Load voted IDs from localStorage
  const stored = localStorage.getItem('votedIds')
  if (stored) {
    votedIds.value = new Set(JSON.parse(stored))
  }
})

const vote = async (id: string) => {
  if (votedIds.value.has(id)) return

  try {
    await $fetch(`/api/submissions/${id}/vote`, {
      method: 'POST'
    })
    votedIds.value.add(id)
    localStorage.setItem('votedIds', JSON.stringify([...votedIds.value]))
    await refresh()
  } catch (error) {
    console.error('Failed to vote:', error)
  }
}

const hasVoted = (id: string) => votedIds.value.has(id)
</script>

<template>
  <div>
    <div class="hero">
      <h1>Vote</h1>
      <p>Upvote requests you want to see visualized.</p>
    </div>

    <div class="content">
      <div style="margin-bottom: 2rem">
        <NuxtLink to="/" class="nav-link">Submit Request</NuxtLink>
      </div>

      <div class="admin-grid">
        <div v-if="!submissions?.length" style="padding: 2rem 0; color: var(--muted)">
          No approved submissions to vote on yet.
        </div>

        <div v-for="submission in submissions" :key="submission.id" class="submission-card">
          <div class="submission-content">
            {{ submission.content }}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem">
            <span style="color: var(--muted)">{{ submission.socialHandle }}</span>
            <button
              :disabled="hasVoted(submission.id)"
              :style="{ opacity: hasVoted(submission.id) ? 0.5 : 1 }"
              @click="vote(submission.id)"
            >
              {{ hasVoted(submission.id) ? `Voted (${submission.votes})` : `Upvote (${submission.votes})` }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
