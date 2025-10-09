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

    test.only('a new blog can be created', async ({ page }) => {
      // Click on "create new" button to show the form
      await page.getByRole('button', { name: 'create new' }).click()
      
      // Fill in the blog form
      await page.locator('input[name="title"]').fill('Test Blog Title')
      await page.locator('input[name="author"]').fill('Test Author')
      await page.locator('input[name="url"]').fill('http://testblog.com')
      
      // Submit the form
      await page.getByRole('button', { name: 'create' }).click()
      
      // Wait for the response
      await page.waitForTimeout(3000)
      
      // Take a screenshot to see what's on the page
      await page.screenshot({ path: 'test-results/after-create.png' })
      
      // Log the page content
      const content = await page.content()
      console.log('Page content length:', content.length)
      
      // Check if there's an error message
      const errorMsg = await page.locator('div').filter({ hasText: /error|Error|failed|Failed/i }).count()
      console.log('Error messages found:', errorMsg)
      
      // Verify the blog appears in the list by looking for the title
      await expect(page.getByText('Title: Test Blog Title')).toBeVisible({ timeout: 10000 })
    })
  })
})