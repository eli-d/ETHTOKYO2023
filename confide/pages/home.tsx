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
import Head from "next/head";

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
            <Head>
        <title>Confide</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/ico" href="/icons/favicon.ico" sizes="32x32"/>

      </Head>
      {showQrCode && <QrModal handleModal={() => {setShowQrCode(false)}} />}
      <div />
      <Card>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <ConnectKitButton />
          <span onClick={() => {}} style={{color: '#bbb', textDecoration: 'underline', cursor: 'pointer'}}>Link my ID with MetaMask Snap</span>
        </div>
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
      {/* <div className={styles.fingerprint}>
        <div
        className={styles.container}>

        <Fingerprint  />

        </div>
        <div
        className={styles.container}>

        <Fingerprint  />

        </div> */}
      {/* </div> */}
      <Navbar />
    </div>
  )
}

const QrModal = ({ handleModal }: {handleModal: () => void}) => {

  const { address } = useAccount();

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
        value={`https://confide.id/validate?address=${address}`}
        style={{width:'100%'}}
        // bgColor={variables.dark}
        // fgColor={variables.light}
        // qrStyle={"dots"}
        // eyeRadius={8}
      />
    </motion.div>
  </motion.div>
}

export default Home

const Fingerprint = () => {
  return (
    <motion.svg
      width="90"
      height="125"
      viewBox="0 0 90 125"
      fill="none"
      xmlns="http://www.w3.org/2000/motion.svg"
    >
      <motion.path
        d="M27.2499 52.6999C27.1699 55.8999 28.2499 58.8399 29.3699 61.7499C33.9199 73.5699 40.9499 83.7899 49.6799 92.8899C51.9499 95.2599 54.3299 97.5299 56.6299 99.8599C57.7699 101.01 57.5999 102.63 56.2799 103.18C55.2899 103.6 54.4699 103.25 53.7699 102.51C49.7699 98.3199 45.5799 94.2899 41.8199 89.8999C34.2899 81.1199 28.4999 71.2899 24.7099 60.3199C21.1599 50.0599 25.0799 40.6599 31.9299 35.4999C43.2399 26.9799 59.7699 31.7699 64.7899 45.0099C65.7599 47.5799 66.9699 50.0599 67.9299 52.6299C68.1799 53.2899 68.1499 54.2899 67.7999 54.8599C67.5199 55.3199 66.5299 55.6199 65.9299 55.5199C65.3799 55.4299 64.7399 54.8099 64.4799 54.2599C63.3799 51.9199 62.2499 49.5799 61.4099 47.1399C58.7799 39.4599 51.1299 34.3899 43.2199 35.1999C34.8499 36.0599 28.3299 42.3999 27.3699 50.6399C27.2899 51.3199 27.2999 52.0199 27.2599 52.6999H27.2499Z"
        fill="currentColor"
      />
      <motion.path
        d="M44.6901 7.81006C63.7301 7.86006 81.1201 20.3501 87.1801 38.3601C87.6401 39.7301 88.3501 41.0201 88.9701 42.3401C89.5501 43.5601 89.3301 44.6301 88.3401 45.1901C87.3501 45.7401 86.2001 45.4101 85.5901 44.2401C84.8601 42.8501 84.1501 41.4201 83.6101 39.9501C77.7401 24.0301 66.4101 14.5701 49.6801 12.1401C31.1401 9.45006 12.9001 20.8101 6.42011 38.5201C6.31011 38.8201 6.22011 39.1401 6.09011 39.4401C5.60011 40.5901 4.60011 41.0701 3.54011 40.7001C2.53011 40.3401 2.06011 39.2701 2.45011 38.1001C3.77011 34.1601 5.61011 30.4601 8.03011 27.0801C15.7701 16.2401 26.2901 9.98006 39.4701 8.20006C41.1901 7.97006 42.9401 7.94006 44.6801 7.82006L44.6901 7.81006Z"
        fill="currentColor"
      />
      <motion.path
        d="M38.8201 52.6902C38.9301 49.8002 40.8801 47.4602 43.7201 46.9002C46.3801 46.3802 49.2701 47.8902 50.1601 50.5302C53.6001 60.7202 59.4401 69.3802 66.8401 77.0602C67.0401 77.2602 67.2401 77.4702 67.4101 77.7002C68.1301 78.6502 68.0601 79.7102 67.2501 80.4302C66.4701 81.1302 65.3201 81.1202 64.5201 80.2702C62.7701 78.4102 61.0101 76.5502 59.3901 74.5802C53.8901 67.8902 49.4501 60.5902 46.6901 52.3302C46.2601 51.0602 45.2501 50.4702 44.1901 50.8102C43.0601 51.1702 42.5801 52.2302 43.0101 53.5902C44.9401 59.6602 47.9001 65.2302 51.4601 70.4902C57.6301 79.6002 65.4401 87.1902 73.7801 94.2702C76.4001 96.5002 79.2301 98.4902 81.8901 100.67C82.4501 101.13 82.9701 101.95 83.0101 102.64C83.1101 104.19 81.3001 104.98 79.9301 103.99C77.7301 102.4 75.5401 100.78 73.4501 99.0602C64.7701 91.9402 56.6701 84.2502 50.0001 75.1602C45.5001 69.0202 41.8401 62.4102 39.4401 55.1502C39.1801 54.3502 39.0301 53.5102 38.8301 52.6902H38.8201Z"
        fill="currentColor"
      />
      <motion.path
        d="M7.79993 52.6099C7.89993 33.9699 21.4599 18.3999 39.9499 15.9999C50.9899 14.5599 60.7799 17.6999 69.2299 24.9899C70.3999 25.9999 70.5899 27.1299 69.8099 28.0499C68.9899 29.0199 67.8799 28.9799 66.6199 27.8899C59.9199 22.0799 52.1299 19.2999 43.2699 19.5999C27.3599 20.1499 13.7999 32.7799 11.9099 48.5999C11.0499 55.8199 12.7899 62.4999 15.5099 69.0499C15.7399 69.6099 15.9999 70.1599 16.1999 70.7299C16.6199 71.9099 16.1999 72.9299 15.1499 73.3499C14.1399 73.7499 13.1399 73.3699 12.6599 72.2599C9.94993 65.9799 7.66993 59.5899 7.78993 52.5999L7.79993 52.6099Z"
        fill="currentColor"
      />
      <motion.path
        d="M31.0901 52.5701C31.1601 46.1001 35.8501 40.45 42.1801 39.2801C48.6601 38.08 55.2701 41.4801 57.3601 47.6401C60.9201 58.0901 67.1401 66.69 74.9801 74.21C78.9801 78.05 83.2401 81.62 87.4101 85.28C88.1401 85.93 88.8001 86.55 88.5801 87.63C88.2701 89.14 86.5501 89.6601 85.2301 88.5401C81.4401 85.3101 77.6001 82.12 73.9701 78.71C67.3801 72.52 61.4801 65.7501 57.4001 57.5901C56.1401 55.0601 55.0201 52.4401 54.0701 49.7801C52.2101 44.5701 47.0101 41.7701 41.8601 43.3801C36.7101 44.9901 33.9401 50.2801 35.4801 55.5801C35.5901 55.9701 35.7401 56.3501 35.8001 56.7501C36.0001 57.9001 35.4401 58.8101 34.3901 59.0901C33.4101 59.3501 32.4801 58.8701 32.1001 57.7901C31.7901 56.9201 31.5501 56.01 31.3701 55.1C31.2101 54.27 31.1701 53.4201 31.0801 52.5701H31.0901Z"
        fill="currentColor"
      />
      <motion.path
        d="M4.33005 46.6001C3.78005 50.6001 3.73005 54.6001 4.33005 58.5901C5.26005 64.7801 7.56005 70.5301 10.1501 76.1701C15.4501 87.6701 22.4901 98.0201 31.1301 107.27C31.4601 107.63 31.79 107.98 32.12 108.35C33.25 109.62 33.36 110.67 32.44 111.54C31.54 112.39 30.3501 112.23 29.2901 111.02C26.5701 107.91 23.7501 104.87 21.2101 101.62C13.0301 91.1801 6.61005 79.7501 2.38005 67.1401C0.200051 60.6101 -0.479949 53.9401 0.330051 47.1101C0.370051 46.7501 0.430051 46.3901 0.510051 46.0301C0.760051 44.9701 1.65005 44.3101 2.62005 44.4401C3.67005 44.5801 4.38005 45.4701 4.33005 46.6001Z"
        fill="currentColor"
      />
      <motion.path
        d="M15.3899 52.6401C15.6099 40.1301 23.5899 28.9901 35.3199 25.0201C36.4199 24.6501 37.3999 24.5701 38.1399 25.6201C38.9299 26.7501 38.3599 28.1001 36.8299 28.6301C33.0199 29.9501 29.5899 31.9201 26.8199 34.8601C19.7699 42.3701 17.7699 51.1201 20.8599 60.9201C23.4799 69.2401 27.5699 76.8701 32.4599 84.0701C32.7799 84.5401 33.1199 84.9901 33.4099 85.4801C34.0599 86.5501 33.8699 87.6401 32.9699 88.2701C32.0499 88.9001 30.9299 88.7201 30.2199 87.6701C28.7399 85.4901 27.2499 83.3201 25.8999 81.0601C21.7699 74.1601 18.2499 66.9701 16.3399 59.1101C15.8299 57.0001 15.6999 54.8001 15.3999 52.6401H15.3899Z"
        fill="currentColor"
      />
      <motion.path
        d="M43.11 0C60.57 0.4 73.83 6.42 84.42 18.29C84.66 18.56 84.92 18.83 85.1 19.14C85.65 20.08 85.5 20.97 84.68 21.65C83.91 22.29 83.03 22.27 82.23 21.63C81.89 21.35 81.61 20.99 81.31 20.66C70.96 9.25 58.11 3.61 42.68 4.05C37.13 4.21 31.77 5.43 26.62 7.51C26.06 7.74 25.5 7.99 24.93 8.2C23.77 8.62 22.7 8.2 22.29 7.19C21.87 6.16 22.27 5.05 23.46 4.63C26.78 3.47 30.07 2.16 33.48 1.39C37.13 0.57 40.91 0.3 43.1 0L43.11 0Z"
        fill="currentColor"
      />
      <motion.path
        d="M45.48 23.4602C57.51 23.7602 68.32 31.6702 72.28 43.0002C74.4 49.0702 77.73 54.3702 82.04 59.0802C83.95 61.1702 85.99 63.1502 87.97 65.1802C88.25 65.4702 88.58 65.7402 88.77 66.0902C89.27 66.9802 89.13 67.8402 88.35 68.5002C87.53 69.2002 86.6 69.2002 85.81 68.4702C78.94 62.0702 72.73 55.1602 69.33 46.2202C68.1 42.9902 66.86 39.8002 64.66 37.0802C59.62 30.8602 53.09 27.6302 45.09 27.3502C43.64 27.3002 42.83 26.5802 42.85 25.3602C42.87 24.1502 43.7 23.4602 45.16 23.4502C45.36 23.4502 45.57 23.4502 45.49 23.4502L45.48 23.4602Z"
        fill="currentColor"
      />
      <motion.path
        d="M36.65 62.5098C37.85 62.5298 38.34 63.1898 38.82 64.0198C41.21 68.1498 43.43 72.3998 46.1 76.3498C51.41 84.1898 58.08 90.8398 65.16 97.0598C69.02 100.46 73.14 103.55 77.13 106.81C77.61 107.2 78.24 107.76 78.27 108.27C78.31 108.93 77.98 109.78 77.51 110.25C76.85 110.91 75.92 110.75 75.17 110.17C72.5 108.12 69.78 106.14 67.2 103.99C58.65 96.8598 50.67 89.1498 44 80.1798C40.6 75.6198 37.71 70.7498 35.26 65.6198C34.5 64.0298 35.26 62.5298 36.66 62.5198L36.65 62.5098Z"
        fill="currentColor"
      />
      <motion.path
        d="M17.57 76.2402C18.62 76.2402 19.1 76.9202 19.59 77.7302C22.27 82.1102 24.78 86.6302 27.75 90.8202C35.18 101.32 44.37 110.16 54.15 118.44C54.65 118.86 55.15 119.26 55.65 119.68C56.87 120.7 57.12 121.87 56.31 122.81C55.52 123.73 54.38 123.73 53.21 122.71C49.87 119.81 46.48 116.98 43.26 113.96C34.35 105.63 26.22 96.6102 19.88 86.1102C18.52 83.8602 17.23 81.5602 15.98 79.2402C15.2 77.7902 16.06 76.2802 17.57 76.2502V76.2402Z"
        fill="currentColor"
      />
      <motion.path
        d="M32.2799 120.1C31.7199 120.8 31.3899 121.48 30.8499 121.83C30.0599 122.34 29.1999 122.09 28.5399 121.41C26.8099 119.64 25.0799 117.88 23.3799 116.08C14.0999 106.3 6.4899 95.3801 0.589904 83.2601C0.409904 82.9001 0.199904 82.5401 0.109904 82.1501C-0.110096 81.1701 0.189905 80.3801 1.1099 79.9101C2.0399 79.4401 2.8399 79.7001 3.4899 80.4601C3.6699 80.6701 3.7999 80.9401 3.9199 81.1901C10.5599 95.0501 19.6299 107.14 30.5299 117.9C31.1399 118.5 31.5999 119.24 32.2699 120.09L32.2799 120.1Z"
        fill="currentColor"
      />
      <motion.path
        d="M36.9201 90.8501C37.1601 91.0201 37.7801 91.2702 38.1701 91.7302C46.0101 100.98 54.8001 109.23 64.3601 116.67C65.5701 117.61 65.7701 118.75 64.9701 119.71C64.2401 120.59 63.0601 120.61 61.9401 119.73C52.2901 112.21 43.3901 103.9 35.4801 94.5502C35.2201 94.2402 34.9501 93.9302 34.7801 93.5702C34.1601 92.2802 35.1101 90.8401 36.9201 90.8501Z"
        fill="currentColor"
      />
      <motion.path
        d="M89.86 56.6298C89.24 57.2798 88.83 57.9298 88.23 58.2798C87.37 58.7798 86.54 58.3598 85.98 57.6498C83.76 54.8198 81.4 52.0698 79.45 49.0598C78.02 46.8498 77.17 44.2598 76.01 41.8598C74.76 39.2798 73.5 36.7098 72.15 34.1798C71.41 32.8098 71.39 31.7598 72.37 31.0598C73.37 30.3398 74.63 30.6398 75.39 32.0298C76.85 34.6798 78.46 37.2998 79.48 40.1298C81.45 45.5698 84.47 50.2698 88.35 54.4898C88.88 55.0598 89.26 55.7598 89.87 56.6298H89.86Z"
        fill="currentColor"
      />
      <motion.path
        d="M70.85 58.4102C71.1 58.5802 71.74 58.8302 72.1 59.3002C76.82 65.5402 82.46 70.9002 88.34 76.0202C89.49 77.0202 89.65 78.1602 88.81 79.0802C88.03 79.9302 86.9 79.9002 85.8 78.9502C79.84 73.8002 74.15 68.3802 69.37 62.0802C69.15 61.7902 68.9 61.5102 68.75 61.1802C68.14 59.8702 69.05 58.4302 70.86 58.4102H70.85Z"
        fill="currentColor"
      />
      <motion.path
        d="M4.72999 23.83C4.09999 23.31 3.29999 22.97 3.16999 22.46C2.98999 21.78 3.05999 20.72 3.48999 20.25C6.04999 17.45 8.67999 14.69 11.44 12.07C12.84 10.74 14.52 9.71004 16.12 8.60004C17.3 7.78004 18.46 7.94004 19.11 8.91004C19.78 9.90004 19.52 11.01 18.31 11.81C13.8 14.77 9.87999 18.37 6.50999 22.59C6.11999 23.08 5.44999 23.35 4.73999 23.83H4.72999Z"
        fill="currentColor"
      />
      <motion.path
        d="M86.9199 95.4498C86.4099 96.1098 86.1099 96.8898 85.5899 97.0798C84.9699 97.3098 84.0299 97.2698 83.4799 96.9298C82.1399 96.1198 80.8999 95.1198 79.6899 94.0998C76.6299 91.5198 73.5999 88.8998 70.5899 86.2598C69.4499 85.2698 69.3099 84.0898 70.1299 83.1998C70.9499 82.3098 72.0699 82.4098 73.2299 83.3898C77.3199 86.8198 81.4299 90.2198 85.5099 93.6698C86.0299 94.1098 86.3799 94.7498 86.9199 95.4398V95.4498Z"
        fill="currentColor"
      />
      <motion.path
        d="M16.6499 114.75C16.1199 115.33 15.7299 116.03 15.1399 116.35C14.3199 116.79 13.4799 116.47 12.8699 115.72C11.3299 113.84 9.7499 111.99 8.2699 110.06C6.7399 108.07 5.2899 106.01 3.8399 103.96C2.9499 102.7 3.0699 101.57 4.0899 100.88C5.0599 100.23 6.1299 100.54 6.9999 101.69C9.8799 105.46 12.7699 109.21 15.6399 112.98C15.9899 113.44 16.2299 114 16.6499 114.75Z"
        fill="currentColor"
      />
      <motion.path
        d="M61.2099 104.54C61.9399 104.94 62.4699 105.15 62.8999 105.49C65.7699 107.74 68.6099 110.01 71.4599 112.28C72.6099 113.2 72.8499 114.24 72.1299 115.21C71.4399 116.14 70.2399 116.26 69.1299 115.39C66.1699 113.07 63.2299 110.72 60.2899 108.37C59.5299 107.76 59.0899 106.92 59.6199 106.03C59.9699 105.44 60.6499 105.04 61.2099 104.54Z"
        fill="currentColor"
      />
      <motion.path
        d="M36.75 113.73C37.45 114.15 37.98 114.37 38.38 114.74C40.69 116.83 42.98 118.95 45.26 121.08C46.29 122.04 46.41 123.22 45.61 124.07C44.82 124.91 43.72 124.92 42.7 124C40.33 121.85 37.99 119.67 35.64 117.49C34.97 116.86 34.57 116.04 35.1 115.21C35.47 114.63 36.15 114.25 36.74 113.73H36.75Z"
        fill="currentColor"
      />
    </motion.svg>
  );
};