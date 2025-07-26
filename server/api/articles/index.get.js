export default defineEventHandler(async (event) => {
  try {
    // Use Firebase REST API to get all articles
    const databaseURL = "https://cinemapper-44cff-default-rtdb.europe-west1.firebasedatabase.app"
    const response = await $fetch(`${databaseURL}/articles.json`)
    
    if (!response) {
      return {}
    }
    
    // Filter to only show published articles
    const publishedArticles = {}
    Object.keys(response).forEach(id => {
      const article = response[id]
      if (article.published && !article.previewOnly) {
        publishedArticles[id] = article
      }
    })
    
    return publishedArticles
    
  } catch (error) {
    console.error('Error fetching articles:', error)
    
    // Return empty object so client-side can handle it gracefully
    return {}
  }
}) 