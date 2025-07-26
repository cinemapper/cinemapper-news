export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Article ID is required'
    })
  }

  try {
    // Use Firebase REST API - no dependencies required
    const databaseURL = "https://cinemapper-44cff-default-rtdb.europe-west1.firebasedatabase.app"
    const response = await $fetch(`${databaseURL}/articles/${id}.json`)
    
    if (!response) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }
    
    // Check if article is published and not preview-only
    if (!response.published || response.previewOnly) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }
    
    return response
    
  } catch (error) {
    console.error('Error fetching article:', error)
    
    // Return null so client-side can handle it gracefully
    return null
  }
}) 