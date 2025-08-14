import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import Blog from './Blog'

// Mock the blogService module
vi.mock('../services/blogs', () => ({
  default: {
    update: vi.fn(() => Promise.resolve({}))
  }
}))

test('renders title and author but not URL or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://example.com',
    likes: 5,
    user: {
      id: '123',
      username: 'testuser'
    }
  }

  const user = {
    id: '123',
    username: 'testuser'
  }

  const mockOnLike = () => {}
  const mockOnDelete = () => {}

  render(
    <Blog 
      blog={blog} 
      onLike={mockOnLike} 
      onDelete={mockOnDelete} 
      user={user} 
    />
  )

  // Check that title and author are rendered
  const titleElement = screen.getByText('Title: Component testing is done with react-testing-library')
  const authorElement = screen.getByText('Author: Test Author')
  
  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()

  // Check that URL and likes are NOT rendered by default
  const urlElement = screen.queryByText('URL: https://example.com')
  const likesElement = screen.queryByText('Likes: 5')
  
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('shows URL and likes when details button is clicked', async () => {
  const blog = {
    title: 'Testing clicks and events',
    author: 'Test Author',
    url: 'https://testing-url.com',
    likes: 10,
    user: {
      id: '456',
      username: 'testuser2'
    }
  }

  const user = {
    id: '456',
    username: 'testuser2'
  }

  const mockOnLike = () => {}
  const mockOnDelete = () => {}

  const userEventInstance = userEvent.setup()

  render(
    <Blog 
      blog={blog} 
      onLike={mockOnLike} 
      onDelete={mockOnDelete} 
      user={user} 
    />
  )

  // Initially, URL and likes should not be visible
  expect(screen.queryByText('URL: https://testing-url.com')).toBeNull()
  expect(screen.queryByText('Likes: 10')).toBeNull()

  // Find and click the "Show details" button
  const button = screen.getByText('Show details')
  await userEventInstance.click(button)

  // After clicking, URL and likes should be visible
  expect(screen.getByText('URL: https://testing-url.com')).toBeDefined()
  expect(screen.getByText('Likes: 10')).toBeDefined()
})

test('like button calls event handler twice when clicked twice', async () => {
  const blog = {
    id: 'test-blog-id', // Add an ID to the blog
    title: 'Testing like button functionality',
    author: 'Like Test Author',
    url: 'https://like-test.com',
    likes: 3,
    user: {
      id: '789',
      username: 'likeuser'
    }
  }

  const user = {
    id: '789',
    username: 'likeuser'
  }

  // Create mock functions using vi.fn()
  const mockOnLike = vi.fn()
  const mockOnDelete = vi.fn()

  const userEventInstance = userEvent.setup()

  render(
    <Blog 
      blog={blog} 
      onLike={mockOnLike} 
      onDelete={mockOnDelete} 
      user={user} 
    />
  )

  // First, show the details to reveal the like button
  const showDetailsButton = screen.getByText('Show details')
  await userEventInstance.click(showDetailsButton)

  // Find the like button
  const likeButton = screen.getByText('like')

  // Click the like button twice
  await userEventInstance.click(likeButton)
  await userEventInstance.click(likeButton)

  // Verify that the onLike event handler was called exactly twice
  expect(mockOnLike).toHaveBeenCalledTimes(2)
  expect(mockOnLike).toHaveBeenCalledWith(blog.id)
})
