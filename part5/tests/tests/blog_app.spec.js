const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty the db here
    await request.post('http://localhost:3003/api/testing/reset')
    
    // create a user for the backend here
    const response = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testpass'
      }
    })
    
    console.log('User creation response status:', response.status())

    await page.goto('http://localhost:5173')
  })
  
    test('Login form is shown', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
      await expect(page.locator('input[name="Username"]')).toBeVisible()
      await expect(page.locator('input[name="Password"]')).toBeVisible()
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })
  
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testuser')
      await page.locator('input[name="Password"]').fill('testpass')
      await page.getByRole('button', { name: 'login' }).click()

      // Wait for navigation after login
      await page.waitForTimeout(2000)
      
      // Check if we see the logged in text or blogs heading
      const loggedIn = page.getByText('logged in')
      await expect(loggedIn).toBeVisible({ timeout: 10000 })
    })
  
    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testuser')
      await page.locator('input[name="Password"]').fill('wrongpass')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Wrong credentials')).toBeVisible()
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Login before each test
      await page.locator('input[name="Username"]').fill('testuser')
      await page.locator('input[name="Password"]').fill('testpass')
      await page.getByRole('button', { name: 'login' }).click()
      
      // Wait for login to complete
      await page.waitForTimeout(2000)
    })

    test('a new blog can be created', async ({ page }) => {
      // Click on "create new" button to show the form
      await page.getByRole('button', { name: 'create new' }).click()
      
      // Fill in the blog form
      await page.locator('input[name="title"]').fill('Test Blog Title')
      await page.locator('input[name="author"]').fill('Test Author')
      await page.locator('input[name="url"]').fill('http://testblog.com')
      
      // Submit the form
      await page.getByRole('button', { name: 'create' }).click()
      
      // Verify the blog appears in the list by looking for the title
      await expect(page.getByText('Title: Test Blog Title')).toBeVisible({ timeout: 10000 })
    })

    test('a blog can be liked', async ({ page }) => {
      // First, create a blog
      await page.getByRole('button', { name: 'create new' }).click()
      await page.locator('input[name="title"]').fill('Blog to Like')
      await page.locator('input[name="author"]').fill('Test Author')
      await page.locator('input[name="url"]').fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      
      // Wait for the blog to be created
      await expect(page.getByText('Title: Blog to Like')).toBeVisible({ timeout: 10000 })
      
      // Find the blog and click "Show details"
      const blogElement = page.locator('.blog').filter({ hasText: 'Blog to Like' })
      await blogElement.getByRole('button', { name: 'Show details' }).click()
      
      // Verify initial likes are 0
      await expect(blogElement.getByText('Likes: 0')).toBeVisible()
      
      // Click the like button
      await blogElement.getByRole('button', { name: 'like' }).click()
      
      // Verify likes increased to 1
      await expect(blogElement.getByText('Likes: 1')).toBeVisible()
    })

    test.only('user who created a blog can delete it', async ({ page }) => {
      // First, create a blog
      await page.getByRole('button', { name: 'create new' }).click()
      await page.locator('input[name="title"]').fill('Blog to Delete')
      await page.locator('input[name="author"]').fill('Test Author')
      await page.locator('input[name="url"]').fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      
      // Wait for the blog to be created
      await expect(page.getByText('Title: Blog to Delete')).toBeVisible({ timeout: 10000 })
      
      // Find the blog and click "Show details"
      const blogElement = page.locator('.blog').filter({ hasText: 'Blog to Delete' })
      await blogElement.getByRole('button', { name: 'Show details' }).click()
      
      // Set up dialog handler to accept the confirmation
      page.on('dialog', dialog => dialog.accept())
      
      // Click the delete button
      await blogElement.getByRole('button', { name: 'delete' }).click()
      
      // Verify the blog was deleted (no longer visible)
      await expect(page.getByText('Title: Blog to Delete')).not.toBeVisible()
    })
  })
})