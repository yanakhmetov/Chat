import React from 'react'
import styles from './styles.module.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const Body = ({ messages, socket }) => {
    const navigate = useNavigate()
    const messagesEndRef = useRef(null)
    const containerRef = useRef(null)
    const currentUser = localStorage.getItem('user')

    const handleLeave = () => {
        socket.emit('removeUser', currentUser)
        localStorage.removeItem('user')
        navigate('/')
    }

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Автоскролл к новым сообщениям
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Сохраняем позицию скролла при обновлении сообщений
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const isScrolledToBottom = container.scrollHeight - container.scrollTop === container.clientHeight

        if (isScrolledToBottom) {
            scrollToBottom()
        }
    }, [messages])

    return (
        <>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h2>Общий чат</h2>
                    <button className={styles.btn} onClick={handleLeave}>
                        Покинуть чат
                    </button>
                </div>
            </header>

            <div className={styles.container} ref={containerRef}>
                {messages.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>💬</div>
                        <h3>Начните общение!</h3>
                        <p>Отправьте первое сообщение в чате</p>
                    </div>
                ) : (
                    messages.map((element, index) => {
                        const isCurrentUser = element.name === currentUser
                        const showName = index === 0 || messages[index - 1].name !== element.name
                        
                        return (
                            <div 
                                className={`${styles.messageContainer} ${isCurrentUser ? styles.ownMessage : ''}`}
                                key={element.id}
                            >
                                {!isCurrentUser && showName && (
                                    <p className={styles.recipientName}>{element.name}</p>
                                )}
                                
                                <div className={`${styles.message} ${isCurrentUser ? styles.sender : styles.recipient}`}>
                                    <p className={styles.messageText}>{element.text}</p>
                                    <span className={isCurrentUser ? styles.time : styles.time2}>
                                        {formatTime(element.timestamp || Date.now())}
                                    </span>
                                </div>
                                
                                {isCurrentUser && showName && (
                                    <p className={styles.senderName}>Вы</p>
                                )}
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
        </>
    )
}

export default Body