"use client"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { MdDashboard, MdEditNote } from "react-icons/md"
import { FaMoon, FaSun, FaBars, FaUser, FaSignOutAlt, FaClone, FaCog, FaGamepad, FaRobot } from "react-icons/fa"
import { FaNoteSticky } from "react-icons/fa6"
import Logo from "@/components/Logo"

export default function SideMenuClient({ isLightMode, promptId }) {
  const [collapsed, setCollapsed] = useState(false)
  const [lightMode, setLightMode] = useState(isLightMode)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const setCookie = (name, value, days) => {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !lightMode)
    setCookie("lightMode", lightMode.toString(), 365)
  }, [lightMode])

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }, [pathname])

  const CollapseIcon = () => (
    <svg
      className={`w-6 h-6 transform transition-transform duration-300 scale-x-[-1]`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 840 657"
      fill="currentColor"
    >
      <g transform="translate(0.000000,657.000000) scale(0.100000,-0.100000)">
        <path d="M673 6159 c-180 -30 -331 -145 -413 -314 -63 -130 -75 -251 -40 -389
        26 -103 62 -166 139 -249 73 -77 162 -132 260 -159 63 -17 213 -18 3581 -18
        3869 0 3561 -5 3693 61 75 38 200 161 240 236 117 219 74 498 -102 672 -70 69
        -147 116 -241 148 -53 17 -181 18 -3560 19 -1936 1 -3528 -2 -3557 -7z"/>
        <path d="M690 3799 c-214 -31 -398 -188 -463 -394 -31 -98 -31 -242 0 -340 57
        -180 199 -318 386 -377 l72 -23 2385 0 2385 0 75 23 c102 32 173 75 245 146
        298 300 175 807 -229 944 l-81 27 -2360 1 c-1298 1 -2385 -2 -2415 -7z"/>
        <path d="M615 1421 c-95 -27 -164 -70 -245 -151 -87 -86 -122 -147 -150 -256
        -36 -139 -23 -258 42 -393 67 -140 189 -244 348 -298 52 -17 129 -18 1555 -21
        1593 -3 1591 -3 1710 44 242 97 394 376 342 629 -46 226 -223 410 -435 454
        -37 8 -508 11 -1580 10 -1414 0 -1531 -2 -1587 -18z"/>
      </g>
    </svg>
  )

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 p-4 shadow flex items-center justify-between">
        <button onClick={() => setIsOpen(true)} aria-label="Open Menu" className="cursor-pointer">
          <FaBars size={22} />
        </button>
        <Logo isLightMode={lightMode} />
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 left-0 h-dvh z-50 flex-shrink-0 transition-all duration-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 flex flex-col border-r ${collapsed ? "w-20" : "w-69"} ${lightMode ? "border-gray-300" : "border-gray-700"} ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="items-center justify-center mb-6 hidden md:flex">
          <div className={`overflow-hidden transition-all duration-500 ${collapsed ? "w-0" : "w-full"}`}>
            <Logo isLightMode={lightMode} />
          </div>
          <button onClick={() => setCollapsed(!collapsed)} aria-label="Toggle Sidebar" className="cursor-pointer px-2">
            {collapsed ? <FaBars size={24} /> : <CollapseIcon />}
          </button>
        </div>
    
        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto w-full overflow-x-hidden">
          <nav className="flex flex-col gap-2">
            <MenuItem href="/dashboard" icon={<MdDashboard size={22} />} label="Dashboard" collapsed={collapsed} />
            {promptId && (
              <>
                <MenuItem href={`/notes/${promptId}`} icon={<FaNoteSticky size={20} />} label="Note" collapsed={collapsed} />
                <MenuItem href={`/notes/${promptId}/quiz`} icon={<MdEditNote size={30} />} label="Quizzes" collapsed={collapsed} />
                <MenuItem href={`/notes/${promptId}/flashcards`} icon={<FaClone size={18} />} label="Flashcards" collapsed={collapsed} />
                <MenuItem href="?chat" icon={<FaRobot size={20} />} label="Chatbot" collapsed={collapsed} />
                <MenuItem href={`/notes/${promptId}/gamify`} icon={<FaGamepad size={20} />} label="Gamify" collapsed={collapsed} />
                <MenuItem href={`/notes/${promptId}/settings`} icon={<FaCog size={20} />} label="Settings" collapsed={collapsed} />
              </>
            )}
            <MenuItem href="/account" icon={<FaUser size={18} />} label="Profile" collapsed={collapsed} />
          </nav>
        </div>
          
        {/* Footer */}
        <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setLightMode(!lightMode)}
            className="flex items-center gap-4 px-3 py-3 rounded-lg text-lg transition-all duration-300 hover:bg-yellow-100 dark:hover:bg-yellow-900 group w-full cursor-pointer"
          >
            <span>
              {!lightMode ? (
                <FaSun size={22} className="text-yellow-600 group-hover:text-yellow-500 transition-colors duration-300" />
              ) : (
                <FaMoon size={22} className="text-gray-600 dark:text-gray-400 group-hover:text-yellow-500 transition-colors duration-300" />
              )}
            </span>
            <span className={`whitespace-nowrap transition-all duration-500 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
              {!lightMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
            
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-4 px-3 py-3 rounded-lg text-lg transition-all duration-300 hover:bg-red-100 dark:hover:bg-red-900 group w-full mt-2 cursor-pointer"
          >
            <span>
              <FaSignOutAlt size={22} className="text-red-600 group-hover:text-red-500 transition-colors duration-300" />
            </span>
            <span className={`transition-all duration-500 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
              Logout
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

function MenuItem({ href, icon, label, collapsed }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-3 py-3 rounded-lg text-lg 
      transition-[opacity,transform,width] duration-300 
      hover:bg-gray-100 dark:hover:bg-gray-900 group cursor-pointer whitespace-nowrap`}
    >
      <span className="text-gray-600 dark:text-gray-400">{icon}</span>
      <span className={`transition-[opacity,width] duration-500 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
        {label}
      </span>
    </Link>
  )
}
