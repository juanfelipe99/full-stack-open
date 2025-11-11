import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";
import noteService from "../services/anecdotes"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newAnecdote = await noteService.createNewAnecdote(content)
    dispatch(createAnecdote(newAnecdote))
    dispatch(setNotification(`you created '${content}'`, 5))
  }

  return (
    <form onSubmit={addAnecdote}>
      <div>
        <input name="anecdote" />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm