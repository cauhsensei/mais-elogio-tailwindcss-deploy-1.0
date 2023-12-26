import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Searchbar } from './Searchbar'

export function Layout({ children }) {
  return (
    <>
      <Searchbar />
      <Header />
      <main className="z-1 flex-auto">{children}</main>
      <Footer />
    </>
  )
}
