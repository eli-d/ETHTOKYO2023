import { useAccount } from 'wagmi';
import styles from './Verify.module.scss'
import {motion} from 'framer-motion'
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Trust, trustAddress } from '@/util';
import Head from 'next/head';

const containerVariants = {
  initial: {
  },
  animate: {
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: "easeInOut",
      staggerChildren: 0.2
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

const Verify = () => {
  const [slide, setSlide] = useState(0)
  const [testAddress, setTestAddress] = useState('')  
  const [trustworthiness, setTrustworthiness] = useState(undefined)
  const [authenticity, setAuthenticity] = useState(undefined)
  const regex = useMemo(() => new RegExp("^0x[a-fA-F0-9]{40}$"), [])
  const { address, isConnecting, isDisconnected } = useAccount();
  const router = useRouter();


  const routerAddress = router.query.address as string | undefined




  useEffect(() => {
    if (!address) {
      router.push('/')
    }
    console.log(address)
  }, [address, router])

  const [addy, setAddy] = useState<string>('')

  return <motion.div layoutId="dark" className={styles.Verify}>
          <Head>
        <title>Confide</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/ico" href="/icons/favicon.ico" sizes="32x32"/>

      </Head>
    <input value={addy} onChange={v => setAddy(v.target.value)}/>
    <button onClick={() => address && trustAddress(address, addy, Trust.CONFIDE)}>Verify Most Fully</button>
    <button onClick={() => address && trustAddress(address, addy, Trust.VOUCH)}>Verify Fully</button>
    <button onClick={() => address && trustAddress(address, addy, Trust.VERIFY)}>Verify Partially</button>
    <button onClick={() => address && trustAddress(address, addy, Trust.NONE)}>Revoke Trust :(</button>
  </motion.div>
}

export default Verify