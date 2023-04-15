import { Trust } from '@/types'
import styles from './Badge.module.scss'

interface IBadge {
  trust: Omit<Trust, 0>
  size?: "sm" | "lg"
}

const getImageSrcFromTrust = (trust: Omit<Trust, 0>) => {
  switch (trust) {
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
}) => {
  return <div className={styles.Badge}>
    <img src={getImageSrcFromTrust(trust)}/>
  </div>
}