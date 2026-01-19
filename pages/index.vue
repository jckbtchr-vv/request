<script setup lang="ts">
const content = ref('')
const socialHandle = ref('')
const isSubmitting = ref(false)
const success = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    const response = await $fetch('/api/submissions', {
      method: 'POST',
      body: {
        content: content.value,
        socialHandle: socialHandle.value
      }
    })

    if (response) {
      success.value = true
      content.value = ''
      socialHandle.value = ''
      setTimeout(() => {
        success.value = false
      }, 5000)
    }
  } catch (error) {
    console.error('Failed to submit:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <div class="hero">
      <h1>Request a Visual</h1>
      <p>Submit your link or quote with your social handle to request a visual.</p>
    </div>

    <div class="content">
      <div style="margin-bottom: 2rem">
        <NuxtLink to="/admin" class="nav-link">Admin</NuxtLink>
      </div>

      <div v-if="success" class="success-message">
        Request Submitted
      </div>

      <div class="form-card">
        <h2>New Request</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="content">Link or Quote</label>
            <textarea
              id="content"
              v-model="content"
              placeholder="Paste a link or enter a quote..."
              required
            />
          </div>

          <div class="form-group">
            <label for="socialHandle">Your Social Handle</label>
            <input
              id="socialHandle"
              v-model="socialHandle"
              type="text"
              placeholder="@username"
              required
            />
          </div>

          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
