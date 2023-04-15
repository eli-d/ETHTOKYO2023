import { motion } from 'framer-motion';

const variants = {
  initial: {
    pathLength: 0,
  },
  animate: {
    pathLength: 1,
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
}

export const Logo = () => {
  return (
    <motion.svg
      width="191"
      height="191"
      viewBox="0 0 191 191"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={"initial"}
      animate={"animate"}

    >
      <g clip-path="url(#clip0_31_406)">
        <motion.path
          d="M107.301 105.113C105.113 107.849 101.968 109.763 98.1384 110.31C90.0694 111.541 82.5474 106.071 81.3166 98.0018C80.0857 89.9328 85.5562 82.4108 93.6252 81.18C98.6854 80.3594 103.472 82.2741 106.754 85.6931"
          stroke="#2276FF"
          stroke-width="13.6763"
          stroke-linecap="round"
          stroke-linejoin="round"
          variants={variants}
        />
        <motion.path
          d="M127.952 71.3327C133.149 78.1708 136.295 86.6501 136.295 95.9499C136.295 118.242 118.242 136.295 95.95 136.295C73.6577 136.295 55.605 118.242 55.605 95.9499C55.605 73.6576 73.6577 55.605 95.95 55.605C100.873 55.605 105.66 56.5623 110.037 58.2035"
          stroke="#2276FF"
          stroke-width="13.6763"
          stroke-linecap="round"
          stroke-linejoin="round"
          variants={variants}

        />
        <motion.path
          d="M38.7835 66.9566C49.3142 46.1687 71.0595 31.8086 95.9503 31.8086C96.7708 31.8086 97.4547 31.8086 98.2752 31.8086"
          stroke="#2276FF"
          stroke-width="13.6763"
          stroke-linecap="round"
          stroke-linejoin="round"
          variants={variants}

        />
        <motion.path
          d="M130.141 150.243C120.294 156.534 108.532 160.09 95.9501 160.09C60.5286 160.09 31.8085 131.37 31.8085 95.9484C31.8085 94.444 31.8085 92.9396 31.9452 91.572"
          stroke="#2276FF"
          stroke-width="13.6763"
          stroke-linecap="round"
          stroke-linejoin="round"
          variants={variants}

        />
        <motion.path
          d="M122.345 37.5515C144.501 47.6719 159.955 69.9642 159.955 95.9491C159.955 108.668 156.262 120.43 149.971 130.413"
          stroke="#2276FF"
          stroke-width="13.6763"
          stroke-linecap="round"
          stroke-linejoin="round"
          variants={variants}

        />
        <motion.path
          d="M10.7469 118.791C8.83226 111.542 7.73816 103.883 7.73816 95.9512C7.73816 56.9738 32.9025 24.014 67.9137 12.2524"
          stroke="#2276FF"
          stroke-width="13.6763"
          stroke-linecap="round"
          stroke-linejoin="round"
          variants={variants}

        />
        <motion.path
          d="M172.811 52.5967C180.059 65.4524 184.162 80.2227 184.162 95.9504C184.162 144.638 144.637 184.162 95.95 184.162C62.1696 184.162 32.9024 165.152 17.9953 137.389"
          stroke="#2276FF"
          stroke-width="13.6763"
          stroke-linecap="round"
          stroke-linejoin="round"
          variants={variants}

        />
        <motion.path
          d="M86.9233 8.14832C89.9321 7.8748 92.9409 7.73804 95.9497 7.73804C121.935 7.73804 145.184 18.9526 161.322 36.7317"
          stroke="#2276FF"
          stroke-width="13.6763"
          stroke-linecap="round"
          stroke-linejoin="round"
          variants={variants}

        />
      </g>
      <defs>
        <clipPath id="clip0_31_406">
          <rect
            width="190.1"
            height="190.1"
            fill="white"
            transform="translate(0.900024 0.899902)"
            
          />
        </clipPath>
      </defs>
    </motion.svg>
  ); 
}