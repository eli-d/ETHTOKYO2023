import React from "react";
import styles from './Button.module.scss'
import { motion } from 'framer-motion'

interface IButton {
  icon? : React.ReactNode;
  children? : React.ReactNode;
  onClick? : () => void;
  circular?: boolean;
  fill?: boolean
  as?: 'button' | 'motion.div'
  layoutId?: string
  color?: 'primary' | 'light' | 'dark' | 'keyline' | "danger"
}

export const Button: React.FC<IButton> = ({
  children,
  icon,
  onClick,
  circular,
  fill,
  as,
  layoutId,
  color = 'dark'
}) => {

  const [showContent, setShowContent] = React.useState(false)

  React.useEffect(() => {
    if (as==='motion.div') {
      const timeout = setTimeout(() => {
        setShowContent(true)
      }, 200)
      return () => clearTimeout(timeout)
    }
  }, [as])

  const classNames = `
    ${styles.Button}
    ${circular ? styles.circular : ''}
    ${fill ? styles.fill : ''}
    ${styles[color]}
    ${layoutId ? styles.special : ''}
  `

  if (as==='motion.div') return (
    <motion.div className={classNames} onClick={() => {
      onClick?.()
      setShowContent(false)
    }} layoutId={layoutId}>
      {
        <>
        {icon && 
        <motion.div
        initial={{
          opacity: 0,
        }}
          animate={{
            opacity: showContent ? 1 : 0,
          }}
        >
          {icon}
        </motion.div>
        }
        { children && 
        <motion.div
        initial={{
          opacity: 0,
        }}
          animate={{
            opacity: showContent ? 1 : 0,
          }}
        >
          {children}
        </motion.div>
}
        </>
      }
    </motion.div>
  )

  return <button className={classNames} onClick={onClick}>
    { icon }
    { children }
  </button>
}