import React from 'react'
import styles from './styles.module.css'
import { useState } from 'react'

const MessageBlock = ({ socket }) => {
  const [message, setMessage] = useState('')

  const handleSend = (e) => {
    e.preventDefault()
    if (message.trim() && localStorage.getItem('user')) {
      socket.emit('message', {
        text: message,
        name: localStorage.getItem('user'),
        id: `${socket.id}+${Math.random()}`,
        socketID: socket.id,
        timestamp: Date.now()
      })
    }
    setMessage('')
  }

  return (
    <div className={styles.messageBlock}>
      <form className={styles.form} onSubmit={handleSend}>
        <input
          type="text"
          className={styles.userMessage}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Напишите сообщение..."
          maxLength={500}
        />
        <button
          className={styles.btn}
          disabled={!message.trim()}
          type="submit"
        >
          &#8593;
        </button>
      </form>

      <div className={styles.counter}>
        {message.length}/500
      </div>
    </div>
  )
}

export default MessageBlock