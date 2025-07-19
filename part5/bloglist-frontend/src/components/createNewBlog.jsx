const CreateNewBlog = ({
    handleCreateNewBlog,
    setErrorMessage
}) => {
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
)}

export default CreateNewBlog