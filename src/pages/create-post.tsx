import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './../App.css'
import './style/header.css'
import './style/create-post.css'
import Headers from './header'
import Markdown from 'react-markdown'

interface User {
  username: string
  id: number
  avatar: string
  email: string
}

interface PostData {
  title: string
  content: string
  explanation?: string
  tagId?: number
}

interface Tag {
  id: number
  tage_name: string
}

const WritePost: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [post, setPost] = useState<PostData>({ title: '', content: '', explanation: '', tagId: undefined })
  const [error, setError] = useState<string | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState<string>('')
  const navigate = useNavigate()
  const backendAuthUrl = 'https://blog.sunrint-qwerty.kr/api/auth/discord'
  const backendApiUrl = 'https://blog.sunrint-qwerty.kr/api/add'
  const backendSelectUrltg = 'https://blog.sunrint-qwerty.kr/api/select/tage'

  useEffect(() => {
    checkUserStatus()
  }, [])

  useEffect(() => {
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

  const fetchTags = async () => {
    try {
      const response = await axios.get(backendSelectUrltg, { withCredentials: true })
      setTags(response.data)
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPost((prev) => ({ ...prev, [name]: value }))
  }

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setPost((prev) => ({ ...prev, tagId: value ? parseInt(value) : undefined }))
  }

  const handleNewTagSubmit = async () => {
    if (!newTag.trim()) return
    try {
      const response = await axios.post(
        backendApiUrl + '/tag',
        { tagName: newTag.trim() },
        { withCredentials: true }
      )
      setTags((prevTags) => [...prevTags, response.data])
      setNewTag('')
      window.location.reload()
    } catch (error) {
      console.error('Error adding new tag:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!post.title || !post.content) {
      setError('Title 과 Content는 필수입니다')
      return
    }

    if (post.tagId === undefined) {
      setError('Tag를 선택해주세요')
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
        <div className="write-post-container">
          <div className="write-post">
            <form onSubmit={handleSubmit} className="form-container">
              <h2 className="form-title">글쓰기</h2>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={post.title}
                  onChange={handleInputChange}
                  placeholder="Enter the title"
                  required
                  className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="tagId">Tag</label>
                <select id="tagId" name="tagId" onChange={handleTagChange} className="form-select">
                  <option value="">Select a tag</option>
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.tage_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="newTag">Add New Tag</label>
                <div className="new-tag-container">
                  <input
                    type="text"
                    id="newTag"
                    name="newTag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter new tag name"
                    className="form-input" />
                  <button
                    type="button"
                    onClick={handleNewTagSubmit}
                    className="form-button"
                  >
                    Add Tag
                  </button>
                </div>
              </div>
              <label className="form-label">Content</label>
              <div className="content-container">
                <div className="editor-preview-layout">
                  <div className="editor-section">
                    <textarea
                      id="content"
                      name="content"
                      value={post.content}
                      onChange={handleInputChange}
                      placeholder="Write your content here"
                      rows={15}
                      required
                      className="form-textarea" 
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="explanation">Explanation</label>
                <input
                  type="text"
                  id="explanation"
                  name="explanation"
                  value={post.explanation}
                  onChange={handleInputChange}
                  placeholder="Add a brief explanation"
                  className="form-input" />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="form-button">Upload</button>
            </form>
          </div>
            <div className="form-group">
              <div className="preview-section">
                <div className="markdown-preview">
                  <div className="post">
                    <p className="tage_name">
                      {tags.find((tag) => tag.id === post.tagId)?.tage_name}
                    </p>
                    <div className="title-box">
                      <h2 className="title">{post.title}</h2>
                      <p className="date">{new Date().toLocaleDateString()}</p>
                    </div>
                    <Markdown>{post.content}</Markdown>
                    <div className="post-author">
                      <img
                        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                        alt="User Avatar"
                        className="avatars"
                      />
                      <p>{user.username}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        
      ) : (
        <div className="login-prompt">
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