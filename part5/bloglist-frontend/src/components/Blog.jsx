import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

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
          {blog.likes !== undefined && <div>Likes: {blog.likes}</div>}
        </div>
      )}
    </div>
  )
}

export default Blog