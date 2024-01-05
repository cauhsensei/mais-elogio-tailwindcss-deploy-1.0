// registeruser/page.jsx

'use client'

import Link from 'next/link';
import { useState } from 'react';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/Button';
import { SelectField, TextField } from '@/components/Fields';
import useAuthentication from '@/hooks/useAuthentication';
import { Header } from '@/components/Header';
import { useRouter } from 'next/navigation';

// export const metadata = {
//   title: 'Registrar',
// };

export default function RegisterUser() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    isCompany: false, // Definido como false para usuários
  });

  const { register } = useAuthentication();
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        ...formData,
        isCompany: false,
        email: formData.email,
        password: formData.password,
        additionalData: { 
          isCompany: formData.isCompany, 
          first_name: formData.first_name, 
          last_name: formData.last_name 
        }
      });
      alert('Usuário registrado com sucesso!');
      router.push('/');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        isCompany: false,
      });
    } catch (error) {
      console.error("Error registering user: ", error);
    }
  };

  return (
    <>
    <Header />
    <AuthLayout
      title="Registre-se para uma conta"
      subtitle={
        <>
          Já está registrado?{' '}
          <Link href="/login" className="text-indigo-600">
            Faça login
          </Link>{' '}
          na sua conta.
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <TextField
            label="Nome"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
            value={formData.first_name}
            onChange={handleInputChange}
          />
          <TextField
            label="Sobrenome"
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
            value={formData.last_name}
            onChange={handleInputChange}
          />
          <TextField
            className="col-span-full"
            label="Endereço de e-mail"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            className="col-span-full"
            label="Senha"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit" color="indigo" className="mt-8 w-full">
          Comece hoje mesmo
        </Button>
      </form>
    </AuthLayout>
    </>
  );
}
