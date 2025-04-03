import Home from './pages/home'
import Error from './pages/error'
import Profile from './pages/Profile'
import CreatePost from './pages/create-post'
import Post from './pages/post'

import { BrowserRouter, Routes, Route} from 'react-router-dom'

const Router = () => {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="*" element={<Error />} />
        </Routes>
        </BrowserRouter>
    )
}

export default Router