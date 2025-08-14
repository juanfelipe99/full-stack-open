import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import CreateNewBlog from './createNewBlog'

test('calls the event handler with the right details when a new blog is created', async () => {
  // Create mock functions
  const mockHandleCreateNewBlog = vi.fn()
  const mockSetErrorMessage = vi.fn()
  
  // Create user event instance
  const user = userEvent.setup()

  // Render the component with mock props
  const { container } = render(
    <CreateNewBlog 
      handleCreateNewBlog={mockHandleCreateNewBlog}
      setErrorMessage={mockSetErrorMessage}
    />
  )

  // Find form inputs using querySelector since they don't have proper labels
  const titleInput = container.querySelector('input[name="title"]')
  const authorInput = container.querySelector('input[name="author"]')
  const urlInput = container.querySelector('input[name="url"]')
  const likesInput = container.querySelector('input[name="likes"]')
  const submitButton = screen.getByRole('button', { name: /create/i })

  // Fill out the form with test data
  await user.type(titleInput, 'Test Blog Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'https://testblog.com')
  await user.clear(likesInput)
  await user.type(likesInput, '10')

  // Submit the form
  await user.click(submitButton)

  // Verify that handleCreateNewBlog was called exactly once
  expect(mockHandleCreateNewBlog).toHaveBeenCalledTimes(1)

  // Verify that handleCreateNewBlog was called with the correct blog object
  expect(mockHandleCreateNewBlog).toHaveBeenCalledWith({
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 10
  })

  // Verify that setErrorMessage was not called (no validation errors)
  expect(mockSetErrorMessage).not.toHaveBeenCalled()
})

test('calls the event handler with default likes value when likes field is empty', async () => {
  // Create mock functions
  const mockHandleCreateNewBlog = vi.fn()
  const mockSetErrorMessage = vi.fn()
  
  // Create user event instance
  const user = userEvent.setup()

  // Render the component with mock props
  const { container } = render(
    <CreateNewBlog 
      handleCreateNewBlog={mockHandleCreateNewBlog}
      setErrorMessage={mockSetErrorMessage}
    />
  )

  // Find form inputs using querySelector
  const titleInput = container.querySelector('input[name="title"]')
  const authorInput = container.querySelector('input[name="author"]')
  const urlInput = container.querySelector('input[name="url"]')
  const likesInput = container.querySelector('input[name="likes"]')
  const submitButton = screen.getByRole('button', { name: /create/i })

  // Fill out the form with test data (excluding likes)
  await user.type(titleInput, 'Test Blog Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'https://testblog.com')
  
  // Clear the likes field to test default value
  await user.clear(likesInput)

  // Submit the form
  await user.click(submitButton)

  // Verify that handleCreateNewBlog was called with likes: 0 (default value)
  expect(mockHandleCreateNewBlog).toHaveBeenCalledWith({
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 0
  })
})

test('shows error message and does not call handler when required fields are missing', async () => {
  // Create mock functions
  const mockHandleCreateNewBlog = vi.fn()
  const mockSetErrorMessage = vi.fn()
  
  // Create user event instance
  const user = userEvent.setup()

  // Render the component with mock props
  render(
    <CreateNewBlog 
      handleCreateNewBlog={mockHandleCreateNewBlog}
      setErrorMessage={mockSetErrorMessage}
    />
  )

  // Find submit button (don't fill any fields, just submit empty form)
  const submitButton = screen.getByRole('button', { name: /create/i })

  // Submit the form without filling any required fields
  await user.click(submitButton)

  // Verify that setErrorMessage was called with the correct error message
  expect(mockSetErrorMessage).toHaveBeenCalledWith('Title, author, and URL are required')

  // Verify that handleCreateNewBlog was not called
  expect(mockHandleCreateNewBlog).not.toHaveBeenCalled()
})
