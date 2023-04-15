import { Trust } from '@/types'
import styles from './Badge.module.scss'

interface IBadge {
  trust: Trust
  size?: "sm" | "lg"
}

const getImageSrcFromTrust = (trust: Trust) => {
  switch (trust) {
    case 0:
      return "/icons/untrusted.svg"
    case 1:
      return "/icons/verified.svg"
    case 2:
      return "/icons/vouched.svg"
    case 3:
      return "/icons/confided.svg"
  }
}

export const Badge: React.FC<IBadge> = ({
  trust,
  size="sm"
}) => {
  return <div className={`${styles.Badge} ${styles[size]}`}>
    <img src={getImageSrcFromTrust(trust)}/>
  </div>
}