import { Trust } from '@/types'
import styles from './Badge.module.scss'

interface IBadge {
  trust: Trust
  size?: "sm" | "lg"
}

export const Badge: React.FC<IBadge> = ({
}) => {
  return <div className={styles.Badge}>
    <img>
    </img>
  </div>
}