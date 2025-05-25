const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return 0
  }
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {

  if (!Array.isArray(blogs) || blogs.length === 0) {
    return {}
  }

  let favoriteBlog = { ...blogs[0] }

  for (const blog of blogs) {
    if (blog.likes > favoriteBlog.likes) {
      favoriteBlog = { ...blog }
    }
  }
  return favoriteBlog
}

const mostBlogs = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return { author: null, blogs: null }
  }

  const authorCounts = {}

  for (const blog of blogs) {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
  }

  let maxAuthor = null
  let maxBlogs = 0

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      maxAuthor = author
      maxBlogs = authorCounts[author]
    }
  }

  return { author: maxAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return { author: null, likes: null }
  }

  const authorCountsLikes = {}

  for (const blog of blogs) {
    authorCountsLikes[blog.author] = (authorCountsLikes[blog.author] || 0) + blog.likes
  }

  let maxAuthor = null
  let maxLikes = 0

  for (const author in authorCountsLikes) {
    if (authorCountsLikes[author] > maxLikes) {
      maxAuthor = author
      maxLikes = authorCountsLikes[author]
    }
  }

  return { author: maxAuthor, likes: maxLikes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}