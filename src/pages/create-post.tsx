import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './../App.css'
import './style/header.css'
import Headers from './header'

interface User {
  username: string
  email: string
}

interface PostData {
  title: string
  content: string
  explanation?: string
  tagId?: number
}

const WritePost: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [post, setPost] = useState<PostData>({ title: '', content: '', explanation: '', tagId: undefined })
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const backendAuthUrl = 'http://localhost:3000/auth/discord'
  const backendApiUrl = 'http://localhost:3000/add'

  useEffect(() => {
    checkUserStatus()
  }, [])

  const checkUserStatus = async () => {
    try {
      const response = await axios.get(`${backendAuthUrl}/user`, {
        withCredentials: true,
      })
      setUser(response.data)
    } catch (error) {
      console.error('Error checking user status:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPost((prev) => ({ ...prev, [name]: value }))
  }

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPost((prev) => ({ ...prev, tagId: value ? parseInt(value) : undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!post.title || !post.content) {
      setError('Title and content are required.')
      return
    }
    try {
      const response = await axios.post(backendApiUrl, post, {
        withCredentials: true,
      })
      console.log('Post created:', response.data)
      navigate('/')
    } catch (error: any) {
      console.error('Error creating post:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      })
      setError(error.response?.data?.error || 'Failed to create post.')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <>
      <Headers />
      <h1>QWERTY Blog - Write a Post</h1>
      {user ? (
        <div className="write-post">
          <h2>Welcome, {user.username}!</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={post.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content:</label>
              <textarea
                id="content"
                name="content"
                value={post.content}
                onChange={handleInputChange}
                placeholder="Write your content here (Markdown supported)"
                rows={10}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="tagId">Tag (Optional):</label>
              <input
                type="number"
                id="tagId"
                name="tagId"
                value={post.tagId !== undefined ? post.tagId : ''}
                onChange={handleTagChange}
                placeholder="Enter tag ID"
              />
            </div>
            <div className='explanation'>
              <label htmlFor="explanation">Explanation:</label>
              <input
                type="text"
                id="explanation"
                name="explanation"
                value={post.explanation}
                onChange={handleInputChange}
                placeholder="Enter explanation (Optional)"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Submit Post</button>
          </form>
          <button onClick={() => navigate('/profile')} className="back-button">
            Back to Profile
          </button>
        </div>
      ) : (
        <div>
          <p>You need to be logged in to write a post.</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Login
          </button>
        </div>
      )}
    </>
  )
}

export default WritePost