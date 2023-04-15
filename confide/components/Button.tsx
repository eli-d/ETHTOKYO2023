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
}

export const Button: React.FC<IButton> = ({
  children,
  icon,
  onClick,
  circular,
  fill,
  as,
  layoutId
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
  `

  if (as==='motion.div') return (
    <motion.div className={classNames} onClick={() => {
      onClick?.()
      setShowContent(false)
    }} layoutId={layoutId}>
      {
        <motion.div
        initial={{
          opacity: 0,
        }}
          animate={{
            opacity: showContent ? 1 : 0,
          }}
        >
          {[icon, children]}
        </motion.div>
      }
    </motion.div>
  )

  return <button className={classNames} onClick={onClick}>
    { icon }
    { children }
  </button>
}