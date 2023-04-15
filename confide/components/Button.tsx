import React from "react";
import styles from './Button.module.scss'

interface IButton {
  icon? : React.ReactNode;
  children? : React.ReactNode;
  onClick? : () => void;
  circular?: boolean;
  fill?: boolean
}

export const Button: React.FC<IButton> = ({
  children,
  icon,
  onClick,
  circular,
  fill
}) => {

  const classNames = `
    ${styles.Button}
    ${circular ? styles.circular : ''}
    ${fill ? styles.fill : ''}
  `
  return <button className={classNames}>
    { icon }
    { children }
  </button>
}