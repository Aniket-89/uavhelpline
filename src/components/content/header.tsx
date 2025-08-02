"use client";
import Link from "next/link";
import { X, SearchCheckIcon, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isSidebarActive, setIsSidebarActive] = useState(false);
    const pathname = usePathname();
    
    const isHomePage = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Determine if scrolled
            setIsScrolled(currentScrollY > 50);
            
            // Determine header visibility based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down & past threshold - hide header
                setIsHeaderVisible(false);
            } else {
                // Scrolling up or at top - show header
                setIsHeaderVisible(true);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Close sidebar when clicking outside or on route change
    useEffect(() => {
        setIsSidebarActive(false);
    }, [pathname]);

    const headerClasses = `
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-300 ease-in-out
        ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}
        ${isHomePage && !isScrolled 
            ? 'bg-transparent backdrop-blur-none' 
            : 'bg-muted border-b-[0.5px] border-border/60'
        }
        ${isScrolled ? 'py-2' : 'py-4'}
    `;

    const logoClasses = `
        font-bold font-sans text-nowrap transition-all duration-300 ease-in-out
        ${isHomePage && !isScrolled 
            ? 'text-6xl md:text-7xl text-primary drop-shadow-lg' 
            : 'text-lg md:text-2xl text-foreground'
        }
    `;

    return <div className={headerClasses}>
        <nav className="flex justify-between items-center max-w-screen-xl mx-auto px-3">
            <Link href={"/"} className={logoClasses}>
                UAV Helpline
            </Link>
            <div className="flex items-center gap-4">
                <Button 
                    variant={'outline'} 
                    onClick={() => setIsSidebarActive(true)}
                >
                    <SearchCheckIcon className="w-4 h-4"/>
                    Explore
                </Button>
                <Button  className="hidden md:block">
                    Subscribe
                </Button>
            </div>

            {/* Sidebar */}
            <div className={`
                fixed top-0 right-0 shadow-sm bg-white border-border 
                ${isSidebarActive ? 'translate-x-0' : 'translate-x-full'} 
                transition-transform duration-300 ease-out 
                w-80 h-screen z-[60]
            `}>
                <div className="p-6">
                    <div className="flex w-full justify-end mb-8">
                        <button
                            onClick={() => setIsSidebarActive(false)}
                            className="p-2 rounded-full bg-muted cursor-pointer transition-colors"
                        >
                            <X className="w-5 h-5 text-foreground" />
                        </button>
                    </div>

                    
                    <nav className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 font-headline">Explore</h3>
                        <ul className="space-y-3 font-headline">
                            <li>
                                <Link 
                                    href="/stories" 
                                    className="block py-2 px-3 font-headline hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                                    onClick={() => setIsSidebarActive(false)}
                                >
                                    All Stories
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/stories?category=guides" 
                                    className="block py-2 px-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors font-headline"
                                    onClick={() => setIsSidebarActive(false)}
                                >
                                    Guides & Tutorials
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/stories?category=reviews" 
                                    className="block py-2 px-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors font-headline"
                                    onClick={() => setIsSidebarActive(false)}
                                >
                                    Drone Reviews
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/stories?category=technology" 
                                    className="block py-2 px-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors font-headline"
                                    onClick={() => setIsSidebarActive(false)}
                                >
                                    Technology
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Overlay */}
            {isSidebarActive && (
                <div 
                    className="fixed inset-0 z-[55]"
                    onClick={() => setIsSidebarActive(false)}
                />
            )}
            
        </nav>
    </div>
}