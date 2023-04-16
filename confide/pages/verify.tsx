import { useAccount, useSigner } from 'wagmi';
import styles from './Verify.module.scss'
import {motion, AnimatePresence} from 'framer-motion'
import { useRouter } from 'next/router';
import { LegacyRef, useEffect, useMemo, useRef, useState } from 'react';
import { Trust, trustAddress } from '@/util';
import Head from 'next/head';
import { Button } from '@/components/Button';
import { QrIcon } from './validate';
import { QrReader } from 'react-qr-reader';
import { Badge } from '@/components/Badge';

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
  const { data: signer } = useSigner();
  const router = useRouter();


  const routerAddress = router.query.address as string | undefined

  useEffect(() => {
    if (!address) {
      router.push('/')
    }
    console.log(address)
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
  const urlReg = new RegExp(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/);

    const Reader = () => (
    <QrReader
      constraints={{ facingMode: "environment" }}
      onResult={(result, error) => {
        if (!!result && urlReg.test(result.getText())) {
          router.push(result.getText().replace('validate','verify'))
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
    const inputRef = useRef<HTMLInputElement>();

  return <div style={{
    display: 'flex', gap:'1em', width:'100%', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row'
  }}>
    <motion.div layoutId="input" className={"input"} onClick={() => {
      inputRef.current?.focus()
    }}>
      <input ref={inputRef as LegacyRef<HTMLInputElement> | undefined} value={testAddress} onChange={v => {setTestAddress(v.target.value)
      setHint(undefined)}} type="text" autoFocus/>
    </motion.div>
    <Button onClick={() => {
      if (!regex.test(testAddress)) {
        setHint("Invalid address")
        return
      }
      setSlide(3)
    }}
      color="light" fill>Proceed</Button>
      {hint}
  </div>}

      const FinalStep = () => <>
    <p>{testAddress}</p>
    <div
      style={{display: 'flex', flexDirection: 'column', gap: '1em', margin: '2em 0'}}
    >
      <Button onClick={() => {
        // @ts-ignore
        address && trustAddress(address, testAddress, Trust.VERIFY, signer)
        router.push('/circle')
        
      }} fill icon={<Badge trust={Trust.VERIFY}/>} color="keyline">
        Verify the Personhood of this user
      </Button>
      
      <Button onClick={() => {
        // @ts-ignore
        address && trustAddress(address, testAddress, Trust.VOUCH, signer)
        router.push('/circle')
      }} fill icon={<Badge trust={Trust.VOUCH}/>} color="keyline">
        Vouch for the Authenticity of this user
      </Button>
      <Button  onClick={() => {
        // @ts-ignore
        address && trustAddress(address, testAddress, Trust.CONFIDE, signer)
        router.push('/circle')
      }} fill icon={<Badge trust={Trust.CONFIDE}/>} color="keyline">
        Confide in the Trustworthiness of this user
      </Button>
      <Button onClick={() => {
        // @ts-ignore
        address && trustAddress(address, testAddress, Trust.NONE, signer)
        router.push('/circle')
      }} fill icon={<Badge trust={Trust.NONE}/>} color="keyline">
        Revoke all trust in this user
      </Button>
    </div>
  </>

  const [isLoading, setIsLoading] = useState(false)

  const Loading = () => <>Loading...</>

  useEffect(() => {
    if (routerAddress && address && regex.test(routerAddress)) {
      setSlide(3)
      setTestAddress(routerAddress)
    }
  }, [routerAddress, address, regex])

  return <motion.div layoutId="dark" className={styles.Verify}>
          <Head>
        <title>Confide</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/ico" href="/icons/favicon.ico" sizes="32x32"/>

      </Head>
    <motion.main initial="initial" animate="animate" exit="exit" variants={containerVariants}>
      <AnimatePresence
      exitBeforeEnter
      >
      <motion.h2 variants={itemVariants} exit={{opacity: 0, y:-20}}>Verify User</motion.h2>
      <motion.section variants={itemVariants} exit={{opacity: 0, y:-20}}>
        <AnimatePresence exitBeforeEnter>
        <motion.section 
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
        </motion.section>
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

export default Verify
