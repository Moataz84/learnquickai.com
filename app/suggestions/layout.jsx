import Menu from "@/components/Menu"

export const metadata = {
  title: "Suggestions"
}

export default function Layout({ children }) {
  return (
    <>
      <Menu />
      {children}
    </>
  )
}