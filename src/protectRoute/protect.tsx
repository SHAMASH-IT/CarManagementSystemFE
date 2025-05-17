'use client'
import { useAuth } from "../app/login/hooks/useAuth";
import { authService } from "@/app/login/services/auth.service";
import { useRouter, usePathname } from "next/navigation";

const ProtectRoute = ({children}:{children:React.ReactNode})=>{
    const isAuthenticated = authService.isAuthenticated();
    const router = useRouter();
    const pathname = usePathname();

    // Allow access to landing page and public pages without authentication
    if (
      pathname === '/' ||
      pathname === '/login/forgot-password' ||
      pathname === '/reset-password'
    ) {
        return children;
    }

    // Protect other routes
    if (!isAuthenticated){
        router.push('/login');
    }
    return children;
}

export default ProtectRoute;
