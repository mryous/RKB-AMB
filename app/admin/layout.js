'use client';

import { SessionProvider } from 'next-auth/react';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
