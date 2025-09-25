import React from 'react'
import Sidebar from './components/sidebar/sidebar'
import Body from './components/body/body'
import MessageBlock from './components/message-block/message-block'
import styles from './styles.module.css'
import { useState } from 'react'
import { useEffect } from 'react'

const ChatPage = ({ socket, users, theme }) => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const handleNewMessage = (data) => {
      setMessages(prev => [...prev, data])
    }

    socket.on('response', handleNewMessage)

    return () => {
      socket.off('response', handleNewMessage)
    }
  }, [socket])

  return (
    <div className={styles.chat}>
      <Sidebar socket={socket} users={users}/>
      <main className={styles.main}>
        <Body messages={messages} socket={socket}/>
        <MessageBlock socket={socket} />
      </main>
    </div>
  )
}

export default ChatPage