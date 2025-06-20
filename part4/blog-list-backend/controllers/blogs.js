const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)

    if (!blog.title || !blog.author || !blog.url) {
      return response.status(400).json({ error: 'Title, author, and url are required' })
    }

    const blogPosted = await blog.save()
    response.status(201).json(blogPosted)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

module.exports = blogsRouter