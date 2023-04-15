import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Trust } from "@/types";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

import styles from './Home.module.scss'
import router, { useRouter } from "next/router";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { redirect } from "next/dist/server/api-utils";
import { Card } from "@/components/Card";
import { Navbar } from "@/components/Navbar";

import {motion} from 'framer-motion'

const Home = () => {
  const { address, isConnecting, isDisconnected } = useAccount();

  const router = useRouter();

  useEffect(() => {
    if (!address) {
      router.push('/')
    }
  }, [address])

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
  }, [ref])

  return <motion.div ref={ref} className={styles.QrModal} layoutId="qr">
    hello world
  </motion.div>
}

export default Home