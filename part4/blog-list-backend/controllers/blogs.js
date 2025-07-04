const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const userExtractor = require('../middleware/userExtractor')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', userExtractor, async (request, response) => {
  try {

    const body = request.body
    const user = request.user

    if (!user) {
      return response.status(400).json({ error: 'User not found or not valid' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    })

    if (!blog.title || !blog.author || !blog.url) {
      return response.status(400).json({ error: 'Title, author, and url are required' })
    }

    const blogPosted = await blog.save()
    user.blogs = user.blogs.concat(blogPosted._id)
    await user.save()

    response.status(201).json(blogPosted)

  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  try {
    const { id } = request.params
    const blog = await Blog.findById(id)

    const user = request.user

    if (!user) {
      return response.status(400).json({ error: 'User not found or not valid' })
    }

    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'You do not have permission to delete this blog' })
    }

    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } catch {
    response.status(400).json({ error: 'Invalid ID format' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const { id } = request.params
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      request.body,
      { new: true, runValidators: true, context: 'query' }
    )
    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    response.json(updatedBlog)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

module.exports = blogsRouter