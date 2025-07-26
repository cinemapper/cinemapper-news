export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Article ID is required'
    })
  }

  try {
    // For now, use the Firebase REST API to avoid Admin SDK complexity
    const databaseURL = "https://cinemapper-44cff-default-rtdb.europe-west1.firebasedatabase.app"
    const response = await fetch(`${databaseURL}/articles/${id}.json`)
    
    if (!response.ok) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }
    
    const article = await response.json()
    
    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }
    
    // Check if article is published and not preview-only
    if (!article.published || article.previewOnly) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }
    
    return article
    
  } catch (error) {
    console.error('Error fetching article:', error)
    
    // Return null so client-side can try Firebase SDK
    return null
  }
}) 