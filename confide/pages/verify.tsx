import { useAccount } from 'wagmi';
import styles from './Verify.module.scss'
import {motion} from 'framer-motion'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Trust, trustAddress } from '@/util';
import Head from 'next/head';

const Verify = () => {

  const { address, isConnecting, isDisconnected } = useAccount();

  const router = useRouter();

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