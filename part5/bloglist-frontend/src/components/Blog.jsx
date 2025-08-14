import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const getUserId = (userObj) => {
  if (!userObj) return null
  if (typeof userObj === 'string') return userObj
  return userObj.id || userObj._id
}

const Blog = ({ blog, onLike, onDelete, user }) => {
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

  const handleDelete = () => {
    if (window.confirm(`Delete blog "${blog.title}" by ${blog.author}?`)) {
      if (onDelete) onDelete(blog.id)
    }
  }

  // Comparación robusta de usuario
  const canDelete = user && getUserId(blog.user) === user.id;

  return (
    <div className="blog" style={{ border: '2px solid black', borderRadius: '6px', padding: '16px' }}>
      <div className="blog-title">Title: {blog.title}</div>
      <div className="blog-author">Author: {blog.author}</div>
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide details' : 'Show details'}
      </button>
      {showDetails && (
        <div className="blog-details">
          <div className="blog-url">URL: {blog.url}</div>
          <div className="blog-likes">
            Likes: {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          {canDelete && (
            <button onClick={handleDelete} style={{ background: 'red', color: 'white', marginTop: '8px' }}>delete</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog