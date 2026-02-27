"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, UserPlus, Settings2, CalendarPlus } from "lucide-react";

export function Navigation() {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "Queue Monitor", icon: LayoutDashboard },
        { href: "/walkin", label: "Kiosk (Walk-in)", icon: UserPlus },
        { href: "/appointments", label: "Book Appointment", icon: CalendarPlus },
        { href: "/settings", label: "Configuration", icon: Settings2 },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
            <div className="container mx-auto flex h-16 items-center px-4">
                <div className="flex items-center gap-2 mr-8">
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">SmartQueue Demo</span>
                </div>

                <nav className="flex items-center space-x-1 lg:space-x-2">
                    {links.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                pathname === href
                                    ? "bg-neutral-800 text-white"
                                    : "text-neutral-400 hover:bg-neutral-800/50 hover:text-white"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline-block">{label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
