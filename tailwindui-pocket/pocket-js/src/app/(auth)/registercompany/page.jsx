'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/Button';
import { SelectField, TextField } from '@/components/Fields';
import useAuthentication from '@/hooks/useAuthentication';
import { Header } from '@/components/Header';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';

// export const metadata = {
//   title: 'Registrar',
// };

export default function RegisterCompany() {
  const [formData, setFormData] = useState({
    company_cnpj: '',
    official_name: '',
    company_name: '',
    email: '',
    password: '',
    category:'',
    isCompany: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [categories, setCategories] = useState([]);

  const { register } = useAuthentication();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const fetchedCategories = querySnapshot.docs.map(doc => doc.data().name);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchCompanyData = async (cnpj) => {
    if (cnpj.length === 14) {
      try {
        const response = await fetch(`/api/companydata?cnpj=${encodeURIComponent(cnpj)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          email: data.email || '',
          official_name: data.nome || '',
          company_name: data.fantasia || '',
        }));
      } catch (error) {
        console.error("Error fetching company data: ", error);
      }
    }
  };

  useEffect(() => {
    fetchCompanyData(formData.company_cnpj);
  }, [formData.company_cnpj]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.company_cnpj || formData.company_cnpj.length !== 14) {
      errors.company_cnpj = 'CNPJ inválido ou inexistente.';
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Endereço de e-mail inválido.';
    }

    if (formData.password.length < 6) {
      errors.password = 'A senha é muito curta.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await register({
        ...formData,
        isCompany: true,
        email: formData.email,
        password: formData.password,
        additionalData: {
          isCompany: formData.isCompany,
          company_cnpj: formData.company_cnpj,
          company_name: formData.company_name,
          official_name: formData.official_name,
          category: formData.category,
        }
      });
      alert('Empresa registrada com sucesso!');
      router.push('/');
      setFormData({
        company_cnpj: '',
        official_name: '',
        company_name: '',
        email: '',
        password: '',
        category: '',
        isCompany: true,
      });
    } catch (error) {
      console.error("Error registering company: ", error);
    }
  };

  return (
    <>
      <Header />
      <AuthLayout
        title="Registre sua Empresa"
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
          <div className="col-span-full">
            <TextField
              label="CNPJ da Empresa"
              name="company_cnpj"
              type="text"
              autoComplete="organization"
              required
              value={formData.company_cnpj}
              onChange={handleInputChange}
            />
            {formErrors.company_cnpj && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.company_cnpj}
              </p>
            )}
          </div>

            <TextField
              label="Nome"
              name="official_name"
              type="text"
              autoComplete="off"
              required
              value={formData.official_name}
              onChange={handleInputChange}
            />
            
            <TextField
              label="Nome fantasia"
              name="company_name"
              type="text"
              autoComplete="off"
              required
              value={formData.company_name}
              onChange={handleInputChange}
            />
            
            <div className="col-span-full">
            <TextField
              label="Endereço de e-mail"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.email}
              </p>
            )}
          </div>

          <div className="col-span-full">
            <TextField
              label="Senha"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.password}
              </p>
            )}
          </div>

          <SelectField
            className="col-span-full"
            label="Categoria"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="" disabled>Escolha a Categoria</option> {/* Opção inicial desabilitada */}
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </SelectField>
          </div>
          <Button type="submit" color="indigo" className="mt-8 w-full">
            Registre sua Empresa
          </Button>
        </form>
      </AuthLayout>
    </>
  );
}