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

module.exports = {
  dummy,
  totalLikes
}