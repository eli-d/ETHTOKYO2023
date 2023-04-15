import { motion, AnimatePresence } from 'framer-motion'
import styles from './Validate.module.scss'
import { Button } from '@/components/Button'
import { QrReader } from 'react-qr-reader'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { trustAddress, verifyTrustPrompt, verifyAuthPrompt } from '@/util'
import { findPath, verifyAuth, verifyAuthLocal, verifyTrust, verifyTrustLocal } from '@/bfs'
import { promptPost } from '@/snap.ts'
import Head from 'next/head'
import { Trust } from '@/types'
import { Badge } from '@/components/Badge'
import { Card } from '@/components/Card'

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

const Validate = () => {
  const router = useRouter()
  const [slide, setSlide] = useState(0)
  const [testAddress, setTestAddress] = useState('')  
  const [trustworthiness, setTrustworthiness] = useState(undefined)
  const [authenticity, setAuthenticity] = useState(undefined)
  const regex = useMemo(() => new RegExp("^0x[a-fA-F0-9]{40}$"), [])

  const routerAddress = router.query.address as string | undefined



  const { address, isConnecting, isDisconnected } = useAccount();
  const [isLoading, setisLoading] = useState(false)

  const verify = async(address: string, addy: string) => {
    setisLoading(true)
    console.log("using ad",addy)
    console.log(await findPath(address, addy))
    const auth = await verifyAuthLocal(address, addy);
    const trust = await verifyTrustLocal(address, addy);
    setTrustworthiness(trust);
    setAuthenticity(auth);

      if (trust) {
          verifyTrustPrompt(address, addy);
      } else if (auth) {
          verifyAuthPrompt(address, addy);
      }

    setisLoading(false)
    setSlide(3)
  }

  useEffect(() => {
  if (routerAddress && address && regex.test(routerAddress)) {
    setSlide(3)
    setTestAddress(routerAddress)
    verify(address, routerAddress)
  }
  }, [routerAddress, address, regex])

  useEffect(() => {
    if (!address) {
      router.push('/')
    }
  }, [address, router])

  const Choice = () => (
    <>
      <Button color="keyline" fill as="motion.div" layoutId="input" onClick={() => {
        setSlide(2)
      }}>
        Enter address manually
      </Button>
      <Button onClick={() => {setSlide(1)}} color="light" fill icon={<QrIcon />}>
        Scan code
      </Button>
    </>
  );

  const Reader = () => (
    <QrReader
      constraints={{ facingMode: "environment" }}
      onResult={(result, error) => {
        if (!!result) {

        }

        if (!!error) {
          console.info(error);
        }
      }}
      videoStyle={{
        height: "auto",
        borderRadius: "16px",
      }}
    />
  )

  const Input = () => {
    const [hint, setHint] = useState<string | undefined>(undefined)

  return <div style={{
    display: 'flex', gap:'1em', width:'100%', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row'
  }}>
    <motion.div layoutId="input" className={"input"}>
      <input value={testAddress} onChange={v => {setTestAddress(v.target.value)
      setHint(undefined)}} type="text" autoFocus/>
    </motion.div>
    <Button onClick={() => {
      if (!regex.test(testAddress)) {
        setHint("Invalid address")
        return
      }
      address && verify(address, testAddress)}} color="light">Check</Button>
      {hint}
  </div>}


  const FinalStep = () => <>
    <p>{testAddress}</p>
    <div
      style={{display: 'flex', flexDirection: 'column', gap: '1em', margin: '2em 0'}}
    >
      <Badge size="lg" trust={!authenticity ? Trust.NONE : (
        !trustworthiness ? Trust.NONE : Trust.VERIFY
      )}/>
      { !authenticity ? <p>We cannot validate the authenticity of this user.</p> :
      ( !trustworthiness ? <p>This person might be real, but we cannot verify their trustworthiness.</p> :
      <p>This person is likely to be real and trustworthy.</p>)
    }
    </div>

    <Button color={authenticity ? "light" : "danger"}
      onClick={() => {
        router.push(`/verify?address=${testAddress}`)
      }}
    >
      Add this user to my Circle {!authenticity && "anyway"}
    </Button>
  </>

  const Loading = () => <>Loading...</>

  return <motion.div layoutId="dark" className={styles.Validate}>
          <Head>
        <title>Confide</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/ico" href="/icons/favicon.ico" sizes="32x32"/>

      </Head>
    <motion.main initial="initial" animate="animate" exit="exit" variants={containerVariants}>
      <AnimatePresence
      exitBeforeEnter
      >
      <motion.h2 variants={itemVariants} exit={{opacity: 0, y:-20}}>Validate user</motion.h2>
      <motion.section variants={itemVariants} exit={{opacity: 0, y:-20}}>
        <AnimatePresence exitBeforeEnter>
        <motion.div 
          initial={{
            opacity: 0,
            y: 50
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={true? {
            opacity: 0,
            y: -50,
          } : {}}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          key={`slide-${slide}-${isLoading ? "y" : 'n'}`}
        >
          {isLoading ? <Loading /> : <>
          {slide === 0 && <Choice />}
          {slide === 1 && <Reader />}
          {slide === 2 && <Input />}
          {slide === 3 && <FinalStep />}
          </>}
        </motion.div>
        </AnimatePresence>
      </motion.section>

      <motion.footer
      variants={itemVariants}
      style={{width: '100%'}}
      exit={{opacity: 0, y:-20}}>
        <AnimatePresence
          exitBeforeEnter
        >
        {slide !== 0 ? (
          <motion.div
            initial={{
              x: -50,
              opacity: 0,
            }}  
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: -50,
              opacity: 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          >
            <Button fill color="keyline" onClick={() => {setSlide(prev => {
              return prev===3 ? 2 : 0
            })}}>Back</Button>
          </motion.div>
        ) : <div/>}
        <Button 
          fill
          onClick={() => {
            router.push('/home')
          }}
          color={slide !== 3 ? 'danger' : 'light'}
        >
          Cancel
        </Button>
        </AnimatePresence>
      </motion.footer>
      </AnimatePresence>
    </motion.main>
  </motion.div>
}

export default Validate

export const QrIcon = () => <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_25_95)">
<path d="M12.6294 1.36304H1.36304V12.6294H12.6294V1.36304Z" stroke="currentColor" strokeWidth="2.72572" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12.6294 18.9255H1.36304V30.1919H12.6294V18.9255Z" stroke="currentColor" strokeWidth="2.72572" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M30.6347 1.36304H19.3684V12.6294H30.6347V1.36304Z" stroke="currentColor" strokeWidth="2.72572" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M31.1711 31.557H30.0603C29.6151 31.5525 29.254 31.1891 29.254 30.7439L29.2653 26.7325C29.2653 26.285 28.9042 25.9216 28.4567 25.9216H24.4454C24.0001 25.9216 23.6367 25.5604 23.6367 25.113V24.0022C23.6367 23.557 23.9979 23.1936 24.4454 23.1936H31.1892C31.6367 23.1936 31.9979 23.557 31.9979 24.0045L31.9797 30.7484C31.9797 31.1936 31.6163 31.5548 31.1688 31.5548L31.1711 31.557Z" fill="currentColor"/>
<path d="M25.5559 28.8291H18.8142C18.3677 28.8291 18.0056 29.1911 18.0056 29.6377V30.7462C18.0056 31.1928 18.3677 31.5548 18.8142 31.5548H25.5559C26.0025 31.5548 26.3645 31.1928 26.3645 30.7462V29.6377C26.3645 29.1911 26.0025 28.8291 25.5559 28.8291Z" fill="currentColor"/>
<path d="M7.57079 5.43994H6.42145C5.87951 5.43994 5.44019 5.87927 5.44019 6.4212V7.57055C5.44019 8.11248 5.87951 8.55181 6.42145 8.55181H7.57079C8.11273 8.55181 8.55205 8.11248 8.55205 7.57055V6.4212C8.55205 5.87927 8.11273 5.43994 7.57079 5.43994Z" fill="currentColor"/>
<path d="M25.3584 5.43994H24.209C23.6671 5.43994 23.2278 5.87927 23.2278 6.4212V7.57055C23.2278 8.11248 23.6671 8.55181 24.209 8.55181H25.3584C25.9003 8.55181 26.3397 8.11248 26.3397 7.57055V6.4212C26.3397 5.87927 25.9003 5.43994 25.3584 5.43994Z" fill="currentColor"/>
<path d="M31.1752 17.5696H30.094C29.6474 17.5696 29.2854 17.9316 29.2854 18.3782V19.4594C29.2854 19.906 29.6474 20.268 30.094 20.268H31.1752C31.6218 20.268 31.9839 19.906 31.9839 19.4594V18.3782C31.9839 17.9316 31.6218 17.5696 31.1752 17.5696Z" fill="currentColor"/>
<path d="M26.5871 19.4642V18.3784C26.5871 17.9332 26.2259 17.5698 25.7807 17.5698L18.8142 17.563C18.3668 17.563 18.0056 17.9241 18.0056 18.3716V25.1132C18.0056 25.5584 18.3668 25.9219 18.8142 25.9219H19.925C20.3702 25.9219 20.7336 25.5607 20.7336 25.1132V21.0928C20.7336 20.6476 21.0948 20.2864 21.54 20.2842L25.7853 20.2705C26.2305 20.2705 26.5916 19.9071 26.5916 19.4619L26.5871 19.4642Z" fill="currentColor"/>
<path d="M7.57079 23.0027H6.42145C5.87951 23.0027 5.44019 23.442 5.44019 23.9839V25.1333C5.44019 25.6752 5.87951 26.1146 6.42145 26.1146H7.57079C8.11273 26.1146 8.55205 25.6752 8.55205 25.1333V23.9839C8.55205 23.442 8.11273 23.0027 7.57079 23.0027Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_25_95">
<rect width="32" height="31.5571" fill="currentColor"/>
</clipPath>
</defs>
</svg>
