import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, onLike }) => {
  const [showDetails, setShowDetails] = useState(false)

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: (blog.likes || 0) + 1,
      user: blog.user.id || blog.user // Asegura que sea solo el id
    }
    await blogService.update(blog.id, updatedBlog)
    if (onLike) onLike(blog.id)
  }

  return (
    <div style={{ border: '2px solid black', borderRadius: '6px', padding: '16px' }}>
      <div>{blog.title}</div>
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide details' : 'Show details'}
      </button>
      {showDetails && (
        <div>
          <div>Author: {blog.author}</div>
          <div>URL: {blog.url}</div>
          <div>
            Likes: {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog