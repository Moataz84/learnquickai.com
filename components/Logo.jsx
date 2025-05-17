import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex justify-center items-center gap-2">
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 110.000000 110"
       preserveAspectRatio="xMidYMid meet" className="bg-black stroke-white fill-white dark:bg-white dark:fill-gray-800 dark:stroke-gray-800 h-fit w-8 shrink-0">
      
      <g transform="translate(0.000000,110.000000) scale(0.100000,-0.100000)">
      <path d="M0 580 l0 -580 550 0 550 0 0 580 0 580 -550 0 -550 0 0 -580z m764
      336 c111 -51 225 -103 254 -116 35 -15 52 -28 52 -41 0 -11 -19 -28 -52 -46
      l-53 -28 -2 -130 c-1 -72 -2 -136 -3 -142 0 -19 -37 -16 -44 3 -3 9 -6 69 -6
      135 0 67 -4 119 -9 119 -5 0 -84 -38 -175 -85 -91 -47 -171 -85 -178 -85 -7 0
      -73 29 -147 65 -73 36 -137 65 -142 65 -5 0 -9 -40 -9 -89 0 -105 5 -112 88
      -137 67 -21 85 -33 73 -53 -11 -16 -94 -1 -157 30 -56 27 -65 52 -63 178 1 58
      -2 107 -7 108 -41 15 -159 81 -162 91 -2 8 34 30 95 59 218 103 419 192 432
      193 8 0 104 -42 215 -94z m-54 -440 c-5 -14 -20 -47 -35 -75 -14 -28 -25 -55
      -25 -61 0 -6 27 -10 64 -10 36 0 67 -4 70 -9 5 -8 -321 -291 -336 -291 -15 0
      -8 20 37 110 l45 90 -66 0 c-52 0 -65 3 -62 14 4 19 285 256 304 256 10 0 11
      -6 4 -24z"/>
      <path d="M337 856 c-109 -52 -198 -97 -198 -101 0 -8 395 -195 411 -195 5 0
      60 28 122 63 l113 62 -125 2 c-156 4 -172 7 -168 36 3 22 5 22 243 27 l240 5
      -85 41 c-215 105 -324 154 -339 154 -9 -1 -105 -43 -214 -94z"/>
      </g>
      </svg>
      <h1 className="text-2xl font-bold whitespace-nowrap inline-block">LearnQuick AI</h1>
    </Link>
  )
}