import { Navbar } from '@/components/Navbar'
import styles from './Circle.module.scss'
import {motion} from 'framer-motion'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { Trust, getTrustedAccounts } from '@/util'
import Head from 'next/head'

type Data = {
  address: string // an eth address
  trust: Trust // an enum between 0 and 4
  date?: string // an iso datestring
  name?: string
}[]

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
  const { address, isConnecting, isDisconnected } = useAccount();
  const [accounts, setAccounts] = useState<Data>([]);

  const router = useRouter();

  useEffect(() => {
    if (!address) {
      router.push('/')
      return;
    }

  }, [address, router])

  useEffect(() => {
    if (!address) { return }



    (async() => {
      const accounts = await getTrustedAccounts(address);
      setAccounts(accounts);
    })()

    //do the above again after 2 seconds
    const interval = setInterval(async () => {
      const accounts = await getTrustedAccounts(address);
      setAccounts(accounts);
    }
    , 2000)
  }, [address, router.pathname])

  const newAccs = accounts.filter(e => e.trust !==0)

  return <div className={styles.Circle}>
          <Head>
        <title>Confide</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/ico" href="/icons/favicon.ico" sizes="32x32"/>
      </Head>
      <div />
      {
        newAccs.length > 0 ? (
          <motion.div className=
          {styles.list
        }
          initial="initial"
          animate="animate"
          exit="exit"
          variants={containerVariants}
        >
          <span style={{color: '#bbb', textAlign:'center'}}>My Circle of Trust:</span>
          {
            newAccs.map((item, index) => (
              <motion.div
                key={index}
                className={styles.item}
                variants={itemVariants}
                onClick={() => {
                  router.push('/verify?address=' + item.address)
                }}
              >
                <Card>
                  <div style={{display: 'flex', gap: '1em', alignItems: 'center'}}>
                    <Badge trust={item.trust} />
                    {item.address}
                  </div>
                </Card>
              </motion.div>
            ))}
        </motion.div>
        ) : <span style={{color: '#bbb'}}>Looks like there&apos;s no-one in your Circle. :(</span>
      }

    <Navbar />
  </div>
}

export default Circle