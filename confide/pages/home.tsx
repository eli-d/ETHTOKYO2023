import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Trust } from "@/types";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

import styles from './Home.module.scss'
import router, { useRouter } from "next/router";
import { useEffect } from "react";
import { redirect } from "next/dist/server/api-utils";
import { Card } from "@/components/Card";

const Home = () => {
  const { address, isConnecting, isDisconnected } = useAccount();

  const router = useRouter();

  useEffect(() => {
    if (!address) {
      router.push('/')
    }
  }, [address])

  return (
    <div className={styles.Home}>
      <Card>
        Hello world
      </Card>
      <Button 
      icon={<img src="/icons/qr.svg" />}
      >
        Show ID
      </Button>
      <ConnectKitButton />
    </div>
  )
}

export default Home