import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title:"Packsy", description:"AI packing lists for every trip." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
