'use client'
import { useAuth } from "../app/login/hooks/useAuth";
import { authService } from "@/app/login/services/auth.service";
import { useRouter, usePathname } from "next/navigation";

const ProtectRoute = ({children}:{children:React.ReactNode})=>{
    const isAuthenticated = authService.isAuthenticated();
    const router = useRouter();
    const pathname = usePathname();

    // Allow access to landing page without authentication
    if (pathname === '/') {
        return children;
    }

    // Protect other routes
    if (!isAuthenticated){
        router.push('/login');
    }
    return children;
}

export default ProtectRoute;
