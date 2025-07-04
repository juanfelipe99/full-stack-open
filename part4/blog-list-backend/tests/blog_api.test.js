const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token
let userId

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'juan', passwordHash: passwordHash, name: 'Juan' })
  const savedUser = await user.save()
  userId = savedUser._id.toString()

  const userForToken = {
    username: savedUser.username,
    id: userId,
  }

  token = jwt.sign(userForToken, process.env.SECRET)

  const initialBlogs = [
    {
      title: 'book1',
      author: 'author1',
      url: 'url1',
      user: userId,
    },
    {
      title: 'book2',
      author: 'author2',
      url: 'url2',
      user: userId,
    },
  ]

  await Blog.insertMany(initialBlogs)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 2)
})

test('blogs have id field', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    assert.ok(blog.id, 'Blog does not have id field')
  })
})

test('a valid blog can be added', async () => {
  const newBlog = { title: 'book3', author: 'author3', url: 'url3' }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 3)
  assert.strictEqual(response.body[2].title, 'book3')
})

test('if likes is missing, it will default to 0', async () => {
  const newBlog = { title: 'book4', author: 'author4', url: 'url4' }
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title or url is not added', async () => {
  const newBlog = { author: 'author5' }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 2)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, 1)
  assert.notStrictEqual(blogsAtEnd.body[0].id, blogToDelete.id)
})

test('a blog cannot be deleted without authorization', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(401)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, 2)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]
  const updatedBlog = { ...blogToUpdate, likes: (blogToUpdate.likes || 0) + 1 }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  assert.strictEqual(response.body.likes, (blogToUpdate.likes || 0) + 1)
})

after(async () => {
  await mongoose.connection.close()
})
