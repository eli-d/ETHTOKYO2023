import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { Button } from './Button'
import styles from './Navbar.module.scss'
import { useRouter } from 'next/router';

import { motion } from 'framer-motion'

export const Navbar: React.FC = () => {

  // get pathname from nextRouter
  const router = useRouter();
  
  const path = router.pathname;

  const [showScanModal, setShowScanModal] = useState(false)

  return <div className={styles.Navbar}>
    {showScanModal && <ScanModal handleModal={()=>{setShowScanModal(false)}}/>}
    <div className={`${styles.item} ${path === "/home" ? styles.active : ''}`}
      onClick={() => router.push('/home')}
    >
      <PrintIcon />
        My ID
    </div>
    {
      !showScanModal ? <Button
      as="motion.div"
      layoutId="dark"
      circular 
      icon={<img src="/icons/scan.svg" alt="qr icon" />}
      onClick={() => setShowScanModal(true)}
    /> : <div />
    }
   
    <div className={`${styles.item} ${path === "/circle" ? styles.active : ''}`}
      onClick={() => router.push('/circle')}
    >
      <RadarIcon />
        My Circle
    </div>
  </div>
}

const ScanModal = ({ handleModal }: { handleModal: () => void}) => {

  const ref = useRef() as MutableRefObject<HTMLDivElement>;
  const router = useRouter();

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

  return <motion.div ref={ref} className={styles.ScanModal} layoutId="dark">
    <div className={styles.option} onClick={() => {
      handleModal()
      router.push('/validate')
    }
    }>
      <h3>Validate</h3>
      <p>Check the identity of another person.</p>
    </div>
    <div className={styles.divider}/>
    <div className={styles.option} onClick={() => {
      handleModal()
      router.push('/verify')
    }
    }>
      <h3>Verify</h3>
      <p>Provide verification for a known party or a friend.</p>
    </div>
  </motion.div>
}

const PrintIcon = () => {
  return (
    <svg
      width="31"
      height="34"
      viewBox="0 0 31 34"
      fill="none"
      stroke="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.4987 33.2448C14.4094 31.8219 11.8443 28.9095 10.4257 24.972C9.66139 22.851 9.90418 20.7411 11.2553 18.8736C12.5817 17.0394 14.4296 16.2501 16.6777 16.7059C18.9528 17.1661 20.3983 18.6134 20.9873 20.8234C21.1807 21.5482 21.1402 22.3352 21.1986 23.0956C21.2796 24.1672 21.7652 25.0054 22.7139 25.5345C24.3977 26.475 26.5311 25.45 26.8661 23.5291C27.0662 22.3841 26.9133 21.2391 26.6705 20.1164C25.9107 16.6236 24.0695 13.8556 20.9154 12.0481C16.7407 9.65806 11.3879 10.3717 7.92585 13.7178C3.53756 17.9598 3.03398 24.6652 6.74335 29.492C6.96366 29.7788 7.1525 30.0722 7.07607 30.4502C6.99064 30.8704 6.7456 31.1639 6.31846 31.2706C5.86434 31.384 5.50015 31.2306 5.21239 30.8704C4.15354 29.5386 3.37569 28.0624 2.85638 26.4483C0.860065 20.2609 3.51058 13.4954 9.20277 10.2561C14.3509 7.32806 21.0413 8.36856 25.0744 12.7262C27.7991 15.6698 29.067 19.1581 28.9906 23.1311C28.9411 25.6724 26.8796 27.7556 24.301 27.9156C21.8506 28.0691 19.5688 26.2215 19.2113 23.7537C19.1124 23.0733 19.1551 22.3752 19.0764 21.6927C18.8291 19.5628 16.581 18.0932 14.596 18.7891C13.1999 19.2782 12.4895 20.3743 12.1972 21.7505C11.9185 23.0644 12.2332 24.3073 12.8065 25.4856C13.8901 27.7156 15.5312 29.463 17.6601 30.7481C18.0491 30.9815 18.5257 31.0949 18.9775 31.2017C19.4226 31.3061 19.7913 31.613 19.8655 32.0509C19.942 32.5067 19.7284 32.9225 19.3102 33.1337C19.2338 33.1715 19.1574 33.2071 19.0809 33.2426H18.5009L18.4987 33.2448Z"
        fill="currentColor"
      stroke="none"

      />
      <path
        d="M12.1551 33.2425C11.9105 33.0625 11.6304 32.9158 11.4302 32.6958C9.52909 30.6267 7.92813 28.362 6.89417 25.7239C5.00192 20.8922 7.25439 15.7983 11.3457 13.6425C15.7306 11.3334 21.1983 12.9735 23.6843 17.3607C24.5159 18.8298 24.9539 20.4055 24.9739 22.0946C24.9828 22.788 24.6071 23.2458 24 23.268C23.3863 23.2903 22.955 22.8413 22.9372 22.139C22.8816 19.9166 22.0633 18.0275 20.4245 16.5251C16.8913 13.2847 11.2968 14.3581 9.10217 18.692C7.95704 20.9522 7.99706 23.2392 9.00656 25.5372C9.98048 27.7486 11.3924 29.6599 13.0223 31.4245C13.4559 31.8957 13.5204 32.4713 13.1424 32.878C12.9978 33.0336 12.7822 33.1247 12.5998 33.2447H12.1529L12.1551 33.2425Z"
        fill="currentColor"
      stroke="none"

      />
      <path
        d="M29.275 13.2572C28.8317 13.2639 28.5447 13.023 28.3104 12.6853C27.2104 11.1069 25.86 9.76948 24.2593 8.67521C17.7992 4.2666 8.99197 5.41491 3.93041 11.3321C3.52852 11.8004 3.16796 12.3025 2.79363 12.7911C2.4147 13.2842 1.79923 13.408 1.31696 13.0838C0.818607 12.7506 0.706077 12.1246 1.07123 11.6045C3.84085 7.68001 7.57501 5.09744 12.3748 4.25084C18.7109 3.13406 24.094 5.04115 28.4987 9.61412C29.0981 10.2356 29.5965 10.9516 30.1247 11.6383C30.3842 11.976 30.398 12.361 30.189 12.7326C29.9938 13.0793 29.6792 13.2549 29.2727 13.2594L29.275 13.2572Z"
        fill="currentColor"
      stroke="none"

      />
      <path
        d="M16.4878 0.609131C20.7371 0.666162 24.947 2.09601 28.5503 4.90683C28.8698 5.15736 29.0574 5.45066 28.974 5.83155C28.8189 6.56073 27.8996 6.84385 27.228 6.37131C26.7186 6.01283 26.2346 5.62583 25.7066 5.29179C22.5665 3.30385 19.0559 2.34451 15.1933 2.49727C11.3562 2.65003 7.97533 3.86805 5.0483 6.0556C4.9302 6.14318 4.81441 6.23484 4.69631 6.32242C4.18223 6.70942 3.53384 6.69516 3.13091 6.28576C2.73261 5.88043 2.78587 5.32845 3.27679 4.93535C4.65926 3.82935 6.19457 2.92093 7.88271 2.21619C10.4277 1.15907 13.1069 0.617278 16.4878 0.609131Z"
        fill="currentColor"
      stroke="none"

      />
      <path
        d="M22.9794 31.2461C21.4197 31.1728 20.0096 30.5871 18.7638 29.682C15.9656 27.6431 14.3814 25.023 14.2563 21.7374C14.2318 21.063 14.6904 20.5971 15.355 20.5904C16.0147 20.5837 16.4708 21.0385 16.5027 21.713C16.64 24.5217 18.0085 26.7313 20.5123 28.3686C21.2922 28.8789 22.1751 29.1784 23.1511 29.2183C23.8427 29.2471 24.3258 29.6931 24.3037 30.261C24.2817 30.8467 23.7446 31.2682 22.9794 31.2461Z"
        fill="currentColor"
      stroke="none"

      />
    </svg>
  );
};

const RadarIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_23_79)">
        <path
          d="M15.9991 19.4611C17.9112 19.4611 19.4613 17.911 19.4613 15.9989C19.4613 14.0867 17.9112 12.5366 15.9991 12.5366C14.087 12.5366 12.5369 14.0867 12.5369 15.9989C12.5369 17.911 14.087 19.4611 15.9991 19.4611Z"
          stroke="currentColor"
          strokeWidth="2.56462"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.2395 9.7603C23.836 11.3568 24.8234 13.5623 24.8234 15.9987C24.8234 20.8715 20.8739 24.8232 15.999 24.8232C11.1241 24.8232 7.17456 20.8736 7.17456 15.9987C7.17456 11.1238 11.1241 7.17432 15.999 7.17432"
          stroke="currentColor"
          strokeWidth="2.56462"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26.4069 5.59292C29.0698 8.25585 30.7176 11.9361 30.7176 15.9989C30.7176 24.1265 24.1287 30.7155 16.001 30.7155C7.87329 30.7155 1.28223 24.1287 1.28223 15.9989C1.28223 7.86902 7.87115 1.28223 15.9989 1.28223"
          stroke="currentColor"
          strokeWidth="2.56462"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.999 1.28223V12.5366"
          stroke="currentColor"
          strokeWidth="2.56462"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_23_79">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};