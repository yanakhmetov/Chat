import socketIO from 'socket.io-client'
import { Route, Routes } from 'react-router-dom'
import Home from './components/home/home.jsx'
import ChatPage from './components/chat/index.jsx'
import { useState, useEffect } from 'react'
import ThemeToggle from './components/chat/components/theme-toggle/ThemeToggle.jsx'
import './App.css'


//Для публикации 
const socket = socketIO.connect('server-production-a986.up.railway.app')

//Для разработки
// const socket = socketIO.connect('http://localhost:5000')

function App() {
  const [users, setUsers] = useState([])
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  useEffect(() => {
    socket.on('responseNewUser', (data) => setUsers(data))
  }, [socket, users])

  useEffect(() => {
    socket.on('refreshUsers', (data) => setUsers(data))
  }, [socket, users])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<Home socket={socket} users={users} theme={theme} />} />
        <Route path='/chat' element={<ChatPage socket={socket} users={users} theme={theme} />} />
      </Routes>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
    </div>
  )
}

export default App