import React from 'react'
import styles from './styles.module.css'

const Sidebar = ({ users }) => {
    const currentUser = localStorage.getItem('user')

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <h4>👥 Участники</h4>
                <span className={styles.count}>{users.length}</span>
            </div>
            
            <div className={styles.userList}>
                {users.map((element, index) => (
                    <div 
                        key={index} 
                        className={`${styles.userItem} ${element.user === currentUser ? styles.currentUser : ''}`}
                    >
                        <span className={styles.userStatus}></span>
                        <span className={styles.userName}>
                            {element.user}
                            {element.user === currentUser && ' (Вы)'}
                        </span>
                    </div>
                ))}
            </div>
            
            {users.length === 0 && (
                <div className={styles.empty}>
                    <p>Нет активных пользователей</p>
                </div>
            )}
        </div>
    )
}

export default Sidebar