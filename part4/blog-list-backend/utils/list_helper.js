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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}