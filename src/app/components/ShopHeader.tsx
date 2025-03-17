"use client"
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ShopHeaderProps {
  itemCount: number;
  toggleCart: () => void;
}

export default function ShopHeader({ itemCount, toggleCart }: ShopHeaderProps) {
  // Add a state to track scroll position
  const [scrolled, setScrolled] = useState(false);
 
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
   
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
   
    // Check initial scroll position
    handleScroll();
   
    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  return (
    <header className={`fixed top-0 left-0 right-0 w-full h-16 z-50 transition-colors duration-300 ${
      scrolled ? "bg-gradient-to-r from-[#ECACA1] via-[#F3CEC6] to-[#ECACA1] shadow-md" : "bg-gradient-to-r from-[#ECACA1]/90 via-[#F3CEC6]/90 to-[#ECACA1]/90"
    }`}>
      <div className="flex justify-center items-center h-16 w-full relative">
        {/* Back Button (Left-Aligned) */}
        <div className="absolute left-4 flex items-center h-full">
          <Link href="/">
            <div className="p-2 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="ml-1 text-gray-700 font-medium">Home</span>
            </div>
          </Link>
        </div>
      {/* Logo (Centered) - With smaller clickable area */}
      <Link href="/">
        <div className="inline-block">
          <Image
            src="/logo.png"
            alt="Salon Logo"
            width={120}
            height={16}
            className="object-contain"
            priority
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const target = e.currentTarget;
              target.src = "/api/placeholder/120/60";
              target.onerror = null;
            }}
          />
        </div>
      </Link>
        {/* Cart Button (Right-Aligned) */}
        <div className="absolute right-4 flex items-center h-full">
          <button
            onClick={toggleCart}
            className="relative p-2 rounded-full transition-all duration-200"
            style={{ backgroundColor: '#F3CEC6' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}