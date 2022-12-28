import { useState, useEffect } from 'react'

import styles from './Message.module.css'

export function Message({ type, msg }) {
    useEffect(() => {
        if (!msg) {
            setVisible(false)
            return
        }
        setVisible(true)
        const timer = setTimeout(() => {
            setVisible(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [msg])


    const [visible, setVisible] = useState(true)

    return (
        <>
            {visible &&
                <div className={`${styles.message} ${styles[type]}`}>{msg}</div>
            }
        </>
    )

}