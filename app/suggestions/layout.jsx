import Menu from "@/components/Menu"

export const metadata = {
  title: "LearnQuick AI - Suggestions"
}

export default function Layout({ children }) {
  return (
    <>
      <Menu />
      {children}
    </>
  )
}