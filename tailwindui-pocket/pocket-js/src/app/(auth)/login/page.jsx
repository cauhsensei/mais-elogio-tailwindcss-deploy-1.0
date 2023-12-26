// login/page.jsx

'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import useAuthentication from '@/hooks/useAuthentication';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/Button';
import { TextField } from '@/components/Fields';
import { Header } from '@/components/Header';

export default function Login() {
    const { login, error, loading } = useAuthentication();
    const router = useRouter();

    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
            alert('Login bem-sucedido!');
            router.push('/');
        } catch (err) {
            alert('Erro no login. Por favor, verifique suas credenciais.');
        }
    };

    return (
        <>
            <Header />
            <AuthLayout
                title="Faça login na sua conta"
                subtitle={
                    <>
                        Não tem uma conta?{' '}
                        <Link href="/choices" className="text-indigo-600">
                            Registre-se
                        </Link>{' '}
                        para um teste gratuito.
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <TextField
                            label="Endereço de e-mail"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={credentials.email}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Senha"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={credentials.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <Button type="submit" color="indigo" className="mt-8 w-full" disabled={loading}>
                        Entrar na conta
                    </Button>
                </form>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </AuthLayout>
        </>
    );
}
