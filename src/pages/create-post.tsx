import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './../App.css'
import './style/header.css'
import Headers from './header'
import Markdown from 'react-markdown'

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

interface tage {
  id: number
  tage_name: string
}

const WritePost: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [post, setPost] = useState<PostData>({ title: '', content: '', explanation: '', tagId: undefined })
  const [error, setError] = useState<string | null>(null)
  const [tags, setTags] = useState<tage[]>([])
  const navigate = useNavigate()
  const backendAuthUrl = 'http://localhost:3000/auth/discord'
  const backendApiUrl = 'http://localhost:3000/add'
  const backendSelectUrltg = 'http://localhost:3000/select/tage'

  useEffect(() => {
    checkUserStatus()
  }, [])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(backendSelectUrltg, { withCredentials: true })
        setTags(response.data)
      } catch (error) {
        console.error('Error fetching tags:', error)
      }
    }

    fetchTags()
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
      {user ? (
        <div className="write-post">
          <h2>{user.username}계정으로 글을 작성합니다.</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="title"
                name="title"
                value={post.title}
                onChange={handleInputChange}
                placeholder="제목을 입력하세요"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                id="content"
                name="content"
                value={post.content}
                onChange={handleInputChange}
                placeholder="내용을 입력하세요"
                rows={10}
                required
              />
              <Markdown>{post.content}</Markdown>
            </div>
            <div className="form-group">
              <label htmlFor="tagId">태그를 선택하세요:</label>
              <select id="tagId" name="tagId" onChange={handleTagChange}>
                <option value="">Select a tag</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.tage_name}
                  </option>
                ))}
              </select>
            </div>
            <div className='explanation'>
              <input
                type="text"
                id="explanation"
                name="explanation"
                value={post.explanation}
                onChange={handleInputChange}
                placeholder="간단한 설명을 입력하세요"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Upload</button>
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