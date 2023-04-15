import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Trust } from "@/types";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

import styles from './Home.module.scss'
import variables from './Home.module.scss'
import router, { useRouter } from "next/router";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { redirect } from "next/dist/server/api-utils";
import { Card } from "@/components/Card";
import { Navbar } from "@/components/Navbar";

import {motion} from 'framer-motion'
import { QRCode } from "react-qrcode-logo";

const Home = () => {
  const { address, isConnecting, isDisconnected } = useAccount();

  const router = useRouter();

  useEffect(() => {
    if (!address) {
      router.push('/')
    }
  }, [address, router])

  const [showQrCode, setShowQrCode] = useState(false)

  return (
    <div className={styles.Home}>
      {showQrCode && <QrModal handleModal={() => {setShowQrCode(false)}} />}
      <Card>
        <ConnectKitButton />
        { !showQrCode &&
        <Button 
        fill
        icon={<img src="/icons/qr.svg" />}
        layoutId="qr"
        as="motion.div"
        onClick={() => {
          setShowQrCode(true)
        }}
        >
          Show ID
        </Button>
        }
      </Card>
      <Navbar />
    </div>
  )
}

const QrModal = ({ handleModal }: {handleModal: () => void}) => {


  const ref = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handleModal()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, handleModal])

  return <motion.div ref={ref} className={styles.QrModal} layoutId="qr">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{duration: 0.5, ease: "easeInOut", delay: 0.2}}
      style={{textAlign: 'center'}}
    >
      My Confide ID:
      <QRCode 
        value="hello"
        style={{width:'100%'}}
        bgColor={variables.dark}
        fgColor={variables.light}
        qrStyle={"dots"}
        eyeRadius={8}
      />
    </motion.div>
  </motion.div>
}

export default Home