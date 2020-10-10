import React from 'react'
import styles from './Button.module.scss'; 

const Button = (props) => {
    return (
        <button className={styles.Button} style={{
            top: props.top,
            left: props.left
        }}>
            {props.children}
        </button>
    );
}

export default Button
