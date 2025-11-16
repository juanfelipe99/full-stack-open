export const getAllAnecdotes = async () => {
  const response = await fetch('http://localhost:3001/anecdotes')
  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }
  return response.json()
}

export const createAnecdote = async (newAnecdote) => {
    if (newAnecdote.content.length < 5) {
        throw new Error('Anecdote must be at least 5 characters long')
    }
    const response = await fetch('http://localhost:3001/anecdotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnecdote),
    })
    if (!response.ok) {
        throw new Error('Failed to create anecdote')
    }
    return await response.json()
}

export const voteAnecdote = async (anecdote) => {
    const response = await fetch(`http://localhost:3001/anecdotes/${anecdote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...anecdote, votes: anecdote.votes + 1 }),
    })
    if (!response.ok) {
        throw new Error('Failed to vote anecdote')
    }
    return await response.json()
}