'use client'
import { useAuth } from "../app/login/hooks/useAuth";
import { authService } from "@/app/login/services/auth.service";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Composant AccessDenied : Affiche un message d'erreur personnalisé selon le rôle de l'utilisateur
 * et redirige automatiquement vers la page appropriée après 3 secondes.
 * 
 * @param role - Le rôle de l'utilisateur (ADMIN ou PROVIDER)
 * @param isAdminRoute - Indique si l'accès refusé concerne une route admin
 */
const AccessDenied = ({ role, isAdminRoute = false }: { role: string, isAdminRoute?: boolean }) => {
    const router = useRouter();
    
    useEffect(() => {
        // Redirection automatique après 3 secondes
        const timer = setTimeout(() => {
            if (role === 'ADMIN') {
                // L'admin est redirigé vers la page des services
                router.replace('/services');
            } else if (role === 'PROVIDER') {
                // Le prestataire est redirigé vers la page des rendez-vous
                router.replace('/appointments');
            } else if (role === 'CLIENT') {
                // Le client est redirigé vers la page d'accueil
                router.replace('/');
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [role, router]);

    // Message d'erreur personnalisé selon le contexte
    const getErrorMessage = () => {
        if (isAdminRoute) {
            return "Cette section est réservée aux administrateurs.";
        }
        if (role === 'CLIENT') {
            return "En tant que client, vous n'avez pas accès à cette section réservée aux administrateurs et prestataires.";
        }
        return role === 'ADMIN' 
            ? "En tant qu'administrateur, vous n'avez pas accès à cette section réservée aux clients."
            : "En tant que prestataire, vous n'avez pas accès à cette section réservée aux clients.";
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
                <div className="text-center">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h2>
                    <p className="text-gray-600 mb-4">
                        {getErrorMessage()}
                    </p>
                    <p className="text-sm text-gray-500">
                        Redirection automatique dans quelques secondes...
                    </p>
                </div>
            </div>
        </div>
    );
};

/**
 * Composant ProtectRoute : Gère la protection des routes et les redirections selon les rôles
 * 
 * Structure des accès par rôle :
 * 
 * ADMIN :
 * - /services : Gestion des services
 * - /admin/users : Gestion des utilisateurs (tous les rôles)
 * - /appointments : Gestion des rendez-vous
 * - /progress : Suivi des interventions
 * - /history/historyProviderAdmin : Historique des interventions (admin et provider)
 * 
 * PROVIDER :
 * - /appointments : Gestion des rendez-vous
 * - /progress : Suivi des interventions
 * - /history/historyProviderAdmin : Historique des interventions (admin et provider)
 * 
 * CLIENT :
 * - /users : Gestion du profil client
 * - /users/vehicle : Gestion des véhicules
 * - /progress/vehicle-progress-client : Suivi des interventions
 * - /history : Historique des interventions (client uniquement)
 */
const ProtectRoute = ({children}: {children: React.ReactNode}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isAdminRoute, setIsAdminRoute] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            
            // Routes publiques accessibles sans authentification
            if (
                pathname === '/' ||
                pathname === '/login' ||
                pathname === '/register' ||
                pathname === '/login/forgot-password' ||
                pathname === '/reset-password'
            ) {
                setIsAuthorized(true);
                setIsLoading(false);
                return;
            }

            // Vérifier si l'utilisateur est authentifié
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                // Décoder le token pour obtenir le rôle
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const userData = JSON.parse(jsonPayload);
                setUserRole(userData.role);

                // Vérification des routes admin
                if (pathname.startsWith('/admin')) {
                    if (userData.role !== 'ADMIN') {
                        setIsAdminRoute(true);
                        setIsAuthorized(false);
                        setIsLoading(false);
                        return;
                    }
                }

                // Vérification des accès à l'historique
                if (pathname.startsWith('/history/historyProviderAdmin')) {
                    // Seuls les admin et provider peuvent accéder
                    if (userData.role !== 'ADMIN' && userData.role !== 'PROVIDER') {
                        setIsAuthorized(false);
                        setIsLoading(false);
                        return;
                    }
                } else if (pathname.startsWith('/history')) {
                    // Seuls les clients peuvent accéder à l'historique standard
                    if (userData.role !== 'CLIENT') {
                        setIsAuthorized(false);
                        setIsLoading(false);
                        return;
                    }
                }

                // Vérification des dossiers réservés aux clients
                if (
                    pathname.startsWith('/users') ||
                    pathname.startsWith('/progress/vehicle-progress-client')
                ) {
                    // Seuls les clients peuvent accéder à ces dossiers
                    if (userData.role !== 'CLIENT') {
                        setIsAuthorized(false);
                        setIsLoading(false);
                        return;
                    }
                }

                // Vérification des routes réservées aux providers
                if (
                    pathname.startsWith('/appointments') ||
                    (pathname.startsWith('/progress') &&!pathname.startsWith('/progress/vehicle-progress-client'))||
                    pathname.startsWith('/parking')
                ) {
                    // Seuls les providers peuvent accéder à ces routes
                    if (userData.role !== 'PROVIDER') {
                        setIsAuthorized(false);
                        setIsLoading(false);
                        return;
                    }
                }

                // Vérification des routes réservées aux admins
                if (
                    pathname.startsWith('/services') ||
                    pathname.startsWith('/admin/users')
                ) {
                    // Seuls les admins peuvent accéder à ces routes
                    if (userData.role !== 'ADMIN') {
                        setIsAuthorized(false);
                        setIsLoading(false);
                        return;
                    }
                }

                // Vérification pour les autres routes protégées
                if (!authService.isAuthenticated()) {
                    router.push('/login');
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error('Erreur lors de la vérification des autorisations:', error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    // Afficher le spinner de chargement
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Afficher le message d'erreur si l'utilisateur n'est pas autorisé
    if (!isAuthorized && userRole) {
        return <AccessDenied role={userRole} isAdminRoute={isAdminRoute} />;
    }

    return children;
};

export default ProtectRoute;
