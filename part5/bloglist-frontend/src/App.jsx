import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import CreateNewBlog from './components/createNewBlog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [createNewBlogVisible, setCreateNewBlogVisible] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage(null)
      setSuccessMessage(null)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      {errorMessage && <div style={{color: 'red'}}>{errorMessage}</div>}
      {successMessage && <div style={{color: 'green'}}>{successMessage}</div>}
      <p>Use the form below to log in.</p>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const handleCreateNewBlog = async (newBlog) => {
    try {
      // Verificar que tenemos un usuario y token válido
      if (!user || !user.token) {
        setErrorMessage('Please log in again')
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
        return
      }
      
      // Asegurar que el token esté configurado antes de crear el blog
      blogService.setToken(user.token)
      
      const createdBlog = await blogService.create(newBlog)
      
      // Refrescar la lista completa de blogs desde el servidor
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      
      setSuccessMessage(`A new blog "${createdBlog.title}" by ${createdBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      console.error('Full error object:', exception)
      console.error('Error response:', exception.response?.data)
      
      // Si el token es inválido, forzar re-login
      if (exception.response?.data?.error === 'invalid token') {
        setErrorMessage('Session expired. Please log in again.')
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
      } else {
        const errorMsg = exception.response?.data?.error || 'Failed to create blog'
        setErrorMessage(errorMsg)
      }
      
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLike = async (id) => {
    const blogToLike = blogs.find(b => b.id === id)
    if (!blogToLike) return
    const updatedBlog = {
      ...blogToLike,
      likes: (blogToLike.likes || 0) + 1,
      user: blogToLike.user.id || blogToLike.user
    }
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      // Asegura que user sea el objeto original, no solo el id
      returnedBlog.user = blogToLike.user
      setBlogs(blogs.map(b => b.id === id ? returnedBlog : b))
    } catch (error) {
      setErrorMessage('Error updating likes')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id, { headers: { Authorization: user ? `Bearer ${user.token}` : '' } })
      setBlogs(blogs.filter(b => b.id !== id))
      setSuccessMessage('Blog deleted successfully')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error) {
      setErrorMessage('Error deleting blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const createNew = () => {
    const hideWhenVisible = { display: createNewBlogVisible ? 'none' : ''}
    const showWhenVisible = { display: createNewBlogVisible ? '' : 'none'}

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setCreateNewBlogVisible(true)}>create new</button>
        </div>
        <div style={showWhenVisible}>
          <CreateNewBlog
            handleCreateNewBlog={handleCreateNewBlog}
            setErrorMessage={setErrorMessage}
          />
          <button onClick={() => setCreateNewBlogVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogForm = () => {
    const userBlogs = blogs.filter(blog => {
      return blog.user && blog.user.username === user.username
    })
    
    return (
      <div>
        <h3>My Blogs</h3>
        <div>
          {userBlogs.length > 0 ? (
            userBlogs.sort((a, b) => b.likes - a.likes).map(blog => 
              <Blog key={blog.id} blog={blog} onLike={handleLike} onDelete={handleDelete} user={user} />
            )
          ) : (
            <p>You haven't created any blogs yet.</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ border: '2px solid black', borderRadius: '6px', padding: '16px' }}>
      {user === null ?
      loginForm() :
      <div>
        <h2>Blogs</h2>
        {errorMessage && <div style={{color: 'red'}}>{errorMessage}</div>}
        {successMessage && <div style={{color: 'green'}}>{successMessage}</div>}
        <p>{user.name} logged in</p>
        <button onClick={() => {
          window.localStorage.removeItem('loggedBlogappUser')
          setUser(null)
          setErrorMessage(null)
          setSuccessMessage(null)
        }}>logout</button>
        {createNew()}
        {blogForm()}
      </div>
    }
    </div>
  )
}

export default App