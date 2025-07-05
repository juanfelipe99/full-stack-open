import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
      
      setErrorMessage(`A new blog "${createdBlog.title}" by ${createdBlog.author} added`)
      setTimeout(() => {
        setErrorMessage(null)
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

  const createNew = () => {
    return (
      <div>
        <h2>Create New Blog</h2>
        <form onSubmit={(event) => {
          event.preventDefault()
          const newBlog = {
            title: event.target.title.value.trim(),
            author: event.target.author.value.trim(),
            url: event.target.url.value.trim(),
            likes: event.target.likes.value ? parseInt(event.target.likes.value) : 0,
          }
          
          // Validar que los campos requeridos no estén vacíos
          if (!newBlog.title || !newBlog.author || !newBlog.url) {
            setErrorMessage('Title, author, and URL are required')
            setTimeout(() => setErrorMessage(null), 5000)
            return
          }
          
          console.log('Sending blog object:', newBlog)
          handleCreateNewBlog(newBlog)
          event.target.reset()
        }}>
          <div>
            title
            <input type="text" name="title" required />
          </div>
          <div>
            author
            <input type="text" name="author" required />
          </div>
          <div>
            url
            <input type="text" name="url" required />
          </div>
          <div>
            likes
            <input type="number" name="likes" defaultValue="0" />
          </div>
          <button type="submit">create</button>
        </form>
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
            userBlogs.map(blog => 
              <Blog key={blog.id} blog={blog} />
            )
          ) : (
            <p>You haven't created any blogs yet.</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      {user === null ?
      loginForm() :
      <div>
        <h2>Blogs</h2>
        <p>{user.name} logged in</p>
        <button onClick={() => {
          window.localStorage.removeItem('loggedBlogappUser')
          setUser(null)
        }}>logout</button>
        {createNew()}
        {blogForm()}
      </div>
    }
    </div>
  )
}

export default App