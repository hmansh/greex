import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const withProtectedRoute = (Component: React.FC) => {
    const ProtectedRoute = (props: any) => {
        const { data } = useSession();
        const router = useRouter();

        useEffect(() => {
            if (data?.user) return;

            // router.push('/api/auth/signin');
        }, [data?.user, router]);

        return data?.user ? <Component {...props} /> : null;
    }

    return ProtectedRoute;
}


export default withProtectedRoute;
