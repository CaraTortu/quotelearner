/**
 * Navbar Links
 */

import { type LucideIcon, UserIcon } from "lucide-react";

export type NavbarLinkType = {
    name: string;
    url: string;
    hideIfLoggedIn?: boolean;
    onlyLoggedIn?: boolean;
    adminOnly?: boolean;
    prefetch?: boolean;
};

export const navbarLinks: NavbarLinkType[] = [
    {
        name: "Home",
        url: "/",
        prefetch: false,
    },
    {
        name: "Practise",
        url: "/practise",
        prefetch: false,
    },
    {
        name: "Quote management",
        url: "/quote-management",
        prefetch: false,
        onlyLoggedIn: true,
    },
    {
        name: "Sign In",
        url: "/login",
        prefetch: false,
        hideIfLoggedIn: true,
    },
    {
        name: "Admin",
        url: "/admin/users",
        prefetch: false,
        adminOnly: true,
    },
];

/**
 * Admin links
 */

export const adminLinks: (NavbarLinkType & { icon: LucideIcon })[] = [
    {
        name: "Users",
        url: "/admin/users",
        icon: UserIcon,
    },
];
