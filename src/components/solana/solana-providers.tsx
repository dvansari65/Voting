"use client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { ReactNode, useCallback, useMemo } from "react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletError } from "@solana/wallet-adapter-base";


export const WalletButton = dynamic(async ()=>(await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,{
    ssr:false
} )

export const SolanaProvider =  ({children}:{children:ReactNode})=>{
    const endpoint = useMemo(() => 
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com", 
        []
      )
    const onError = useCallback((error: WalletError) => {
        console.error(error)
      }, [])
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} onError={onError}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
             </WalletProvider>
        </ConnectionProvider>
    )
}