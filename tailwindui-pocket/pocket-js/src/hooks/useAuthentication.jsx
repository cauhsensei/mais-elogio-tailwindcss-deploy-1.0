'use client'

import { useState, useEffect } from 'react';
import { db, auth } from '@/firebase/firebaseConfig';
import { collection, addDoc, getDoc, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function useAuthentication() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        const userType = sessionStorage.getItem('userType');

        if (storedToken) {
            setUser({ token: storedToken, type: userType });
        }
    }, []);

    const register = async (userData) => {
        setLoading(true);
    
        try {
            const authResult = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            
            // Dados adicionais para empresa
            const additionalData = userData.additionalData || {};
            
            // Verifica se é um registro de empresa ou usuário e ajusta os campos apropriadamente
            const newUser = {
            uid: authResult.user.uid,
            email: userData.email,
            isCompany: userData.isCompany,
            ...additionalData // Adiciona dados adicionais para empresa
            };

            if (userData.isCompany) {
                newUser.company_cnpj = userData.company_cnpj;
                newUser.company_name = userData.company_name;
                newUser.category = userData.category;
            } else {
                newUser.first_name = userData.first_name;
                newUser.last_name = userData.last_name;
            }
            
            await setDoc(doc(db, 'users', authResult.user.uid), newUser);
    
            const token = await authResult.user.getIdToken();
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('userType', userData.isCompany ? 'company' : 'user');
            setUser({ token: token, type: userData.isCompany ? 'company' : 'user' });
    
            setLoading(false);
            return { user: authResult.user };
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };
    

    const login = async (credentials) => {
        setLoading(true);
        try {
            const authResult = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            const token = await authResult.user.getIdToken();
    
            console.log("UID:", authResult.user.uid); 
    
            const userDoc = await getDoc(doc(db, 'users', authResult.user.uid));
    
            if (!userDoc.exists()) { 
                throw new Error("Documento de usuário não encontrado");
            }
    
            const isCompany = userDoc.data().isCompany;
    
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('userType', isCompany ? 'company' : 'user');
            setUser({ token: token, type: isCompany ? 'company' : 'user' });
    
            setLoading(false);
            return { user: authResult.user };
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };
    

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userType');
        signOut(auth);
        setUser(null);
    };

    return {
        user,
        register,
        login,
        logout,
        loading,
        error
    };
}
