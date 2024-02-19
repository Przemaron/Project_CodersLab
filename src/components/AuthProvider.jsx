import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../API/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const session = supabase.auth.getSession();
        setUser(session?.user || null);

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            throw error;
        }
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
    };

    const value = {user,login, logout};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
