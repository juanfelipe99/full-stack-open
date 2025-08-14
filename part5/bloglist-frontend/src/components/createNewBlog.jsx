const CreateNewBlog = ({
    handleCreateNewBlog,
    setErrorMessage
}) => {
    return (
        <div>
        <h2>Create New Blog</h2>
        <form onSubmit={(event) => {
        event.preventDefault()
        
        // Get form elements safely
        const formData = new FormData(event.target)
        const title = formData.get('title')?.trim() || ''
        const author = formData.get('author')?.trim() || ''
        const url = formData.get('url')?.trim() || ''
        const likes = formData.get('likes') ? parseInt(formData.get('likes')) : 0
        
        const newBlog = {
            title,
            author,
            url,
            likes,
        }

        // Debug logging to see what we're getting
        console.log('Form data:', { title, author, url, likes })
        console.log('Validation check:', !newBlog.title, !newBlog.author, !newBlog.url)

        // Validar que los campos requeridos no estén vacíos
        if (!newBlog.title || !newBlog.author || !newBlog.url) {
            console.log('Validation failed - calling setErrorMessage')
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
            <input type="text" name="title" />
        </div>
        <div>
            author
            <input type="text" name="author" />
        </div>
        <div>
            url
            <input type="text" name="url" />
        </div>
        <div>
            likes
            <input type="number" name="likes" defaultValue="0" />
        </div>
        <button type="submit">create</button>
        </form>
    </div>
)}

export default CreateNewBlog