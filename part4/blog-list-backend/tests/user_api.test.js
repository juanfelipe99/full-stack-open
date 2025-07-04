const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

test('user can be created with valid data', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'password123'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.username, newUser.username)
})

test('user creation fails with invalid data', async () => {
  const newUser = {
    username: 'tu',
    name: 'Test User',
    password: 'pw'
  } // Username and password are too short

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.strictEqual(response.body.error, 'Username or password must be at least 3 characters long')
})

test('all users are returned', async () => {
  const response = await api.get('/api/users')

  assert.strictEqual(response.body.length, 0)
})

after(async () => {
  await mongoose.connection.close()
})