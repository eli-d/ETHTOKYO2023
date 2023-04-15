import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './Index.module.scss'
import { Badge } from '@/components/Badge'
import { Trust } from '@/types'
import { Button } from '@/components/Button'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { Logo } from '@/components/Logo'
import { motion } from 'framer-motion'
import router from 'next/router'
import { useEffect } from 'react'


const inter = Inter({ subsets: ['latin'] })

export default function Index() {
  const { address, isConnecting, isDisconnected } = useAccount();

  useEffect(() => {
    if (address) {
      router.push('/home')
    }
  }, [address])

  return (
    <motion.div className={styles.Home}>
      <Head>
        <title>Confide</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/ico" href="/icons/favicon.ico" sizes="32x32"/>

      </Head>
      <motion.div className={styles.logo}>
      <Logo />
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 1, duration: 1, ease: "easeInOut" } }}
      >
        confide.id
      </motion.h1>
    </motion.div>
    <motion.p>Connect your wallet to start verifying.</motion.p>
    <ConnectKitButton />
    </motion.div>
  )
}