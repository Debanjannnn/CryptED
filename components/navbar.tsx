'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface NavbarProps {
  showBackButton?: boolean
  backButtonRoute?: string
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<any>
    }
  }
}

export function NavbarComponent({ 
  showBackButton = false, 
  backButtonRoute = '/' 
}: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  // Function to connect wallet
  // ADDRESS: 0x320916a818f05D78a299C256C5B02afE7Eed3baC
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setWalletAddress(accounts[0])
        console.log("Connected account:", accounts[0])
      } catch (error) {
        console.error("Failed to connect wallet", error)
      }
    } else {
      alert("Please install MetaMask to connect your wallet.")
      window.open("https://metamask.io/download.html", "_blank")
    }
  }

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
          }
        })
        .catch(error => console.error("Failed to get wallet accounts", error))
    }
  }, [])

  return (
    <header className="p-6 flex justify-between items-center">
      <h1 className="text-2xl">
        <Link href="/">CryptED</Link>
      </h1>
      <nav className="flex items-center gap-4">
        {/* Theme toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Connect Wallet button */}
        <Button variant="default" onClick={connectWallet}>
          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
        </Button>

        {/* Back button */}
        {showBackButton && (
          <Link href={backButtonRoute}>
            <Button>Back to Home</Button>
          </Link>
        )}
      </nav>
    </header>
  )
}
