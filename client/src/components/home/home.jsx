import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

const Home = ({ socket, users, theme }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState('')
    const [haveName, refreshHaveName] = useState('Придумайте имя')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        socket.on('unknownUser', (data) => {
            if(data.user.socketID == socket.id) refreshHaveName(data.nameCreate)
            setIsLoading(false)
        })
    }, [socket])

    useEffect(() => {
        socket.on('haveThisUser', (data) => {
            refreshHaveName(data)
            setIsLoading(false)
        })
    }, [socket])

    const handlSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)
        socket.emit('newUser', { user, socketID: socket.id });
    }

    if ((haveName != 'Придумайте имя') && (haveName != 'Имя занято, придумайте новое имя')) {
        localStorage.setItem('user', user);
        navigate('/chat');
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1>Чат-приложение</h1>
                    <p>Присоединяйтесь к общению с друзьями</p>
                </div>
                
                <form onSubmit={handlSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor='user' className={styles.label}>
                            Ваше имя
                        </label>
                        <input
                            type="text"
                            id='user'
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            className={styles.userInput}
                            placeholder='Введите уникальное имя'
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.message}>
                        {haveName && (
                            <span className={
                                haveName === 'Придумайте имя' || haveName === 'Имя занято, придумайте новое имя' 
                                ? styles.errorMessage 
                                : styles.successMessage
                            }>
                                {haveName}
                            </span>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className={styles.homeBtn}
                        disabled={!user.trim() || isLoading}
                    >
                        {isLoading ? 'Подключение...' : 'Войти в чат'}
                        {!isLoading && ' →'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Онлайн пользователей: {users.length}</p>
                </div>
            </div>
        </div>
    )
}

export default Home