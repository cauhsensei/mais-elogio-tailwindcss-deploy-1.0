'use client'; 

import { useRouter } from 'next/navigation';
import useAuthentication from '@/hooks/useAuthentication';
import { APP_ROUTES } from '@/constants/routesConfig';

function Permission({ children, routeKey }) {
    const { user } = useAuthentication();
    const router = useRouter();
    const routeConfig = APP_ROUTES[routeKey];

    if (!routeConfig) {
        console.error(`routeKey "${routeKey}" não encontrado em APP_ROUTES.`);
        return <p>Erro de configuração.</p>;
    }

    const userHasAccess = routeConfig.allowedUsers.includes(user?.type);
    
    if (!userHasAccess) {
        return <p>Você não tem permissão para acessar esta rota.</p>;
    }

    return children;
}


export default Permission;
