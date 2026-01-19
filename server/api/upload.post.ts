export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded'
    })
  }

  const file = formData.find(f => f.name === 'file')

  if (!file || !file.data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file found'
    })
  }

  // Convert to base64 data URL
  const base64 = file.data.toString('base64')
  const mimeType = file.type || 'image/png'
  const dataUrl = `data:${mimeType};base64,${base64}`

  return { url: dataUrl }
})
