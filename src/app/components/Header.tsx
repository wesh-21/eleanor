"use client"
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
  // Add a state to track scroll position
  const [scrolled, setScrolled] = useState(false);
  // State to handle image error
  const [imgSrc, setImgSrc] = useState("/logo.png");
 
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
 
  // Handle image error using state instead of directly manipulating the DOM
  const handleImageError = () => {
    setImgSrc("/api/placeholder/120/60");
  };

  return (
    <header className={`fixed top-0 left-0 right-0 w-full h-16 z-50 transition-colors duration-300 ${
      scrolled ? "bg-gradient-to-r from-[#ECACA1] via-[#F3CEC6] to-[#ECACA1] shadow-md" : "bg-gradient-to-r from-[#ECACA1]/90 via-[#F3CEC6]/90 to-[#ECACA1]/90"
    }`}>
      <div className="flex justify-center items-center h-16 w-full">
        {/* Logo (Centered) */}
        <Link href="/">
          <div className="h-16 w-[120px] flex items-center justify-center">
            <Image
              src={imgSrc}
              alt="Salon Logo"
              width={120}
              height={60}
              className="object-contain"
              priority
              onError={handleImageError}
            />
          </div>
        </Link>
      </div>
    </header>
  );
}