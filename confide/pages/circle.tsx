import { Navbar } from '@/components/Navbar'
import styles from './Circle.module.scss'
import { Trust } from '@/types'
import {motion} from 'framer-motion'
import { Card } from '@/components/Card'

type Data = {
  account: string // an eth address
  trust: Trust // an enum between 0 and 4
  date?: string // an iso datestring
}[]

const dummyData: Data = [
  {
    account: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    trust: 0,
    date: '2023-04-01T12:00:00.000Z',
  },
  {
    account: '0x742d35Cc6634C0532925a3b844Bc454e4438f44E',
    trust: 1,
  },
  {
    account: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88',
    trust: 2,
    date: '2023-04-02T15:30:00.000Z',
  },
  {
    account: '0x5aeda56215b167893e80b4fE645BA6d5Bab767DE',
    trust: 3,
    date: '2023-04-03T18:45:00.000Z',
  },
  {
    account: '0xfE9e8709d3215310075d67E3ed32A380ccf451C8',
    trust: 1,
  },
  {
    account: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
    trust: 0,
    date: '2023-04-04T20:00:00.000Z',
  },
  {
    account: '0x1d8Cf7B1115F5C5b433E5E3A4f5284C6e4a6F8D6',
    trust: 2,
    date: '2023-04-05T10:15:00.000Z',
  },
  {
    account: '0x3Fc9E9a261366C848A1De30B05C684F31cD11235',
    trust: 3,
  },
  {
    account: '0x6bA839A8EeCcBc1bF370fA6412C6Ea15E9D4e0C4',
    trust: 1,
    date: '2023-04-06T14:30:00.000Z',
  },
  {
    account: '0x07AF67b392B7A202fAD8E0FBc64C34F33102165F',
    trust: 0,
  },
];

const containerVariants = {
  initial: {
  },
  animate: {
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      staggerChildren: 0.05
    },
  },
  exit: {
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      staggerChildren: 0.2
    },
  }
}

const itemVariants = {
  initial: {
    opacity: 0,
    y: 50
  },
  animate: {
    opacity: 1,
    y: 0,
  },
}

const Circle = () => {
  return <div className={styles.Circle}>
    <div/>
      <motion.div className=
        {styles.list
      }
        initial="initial"
        animate="animate"
        exit="exit"
        variants={containerVariants}
      >
        {
          dummyData.map((item, index) => (
            <motion.div
              key={index}
              className={styles.item}
              variants={itemVariants}
            >
              <Card>
                {item.account}
              </Card>
            </motion.div>
          ))}
      </motion.div>
    <Navbar />
  </div>
}

export default Circle