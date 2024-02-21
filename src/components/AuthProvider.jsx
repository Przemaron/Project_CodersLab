import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../API/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const session = supabase.auth.getSession();
		setUser(session?.user || null);

		const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
			const currentUser = session?.user;
			setUser(currentUser || null);

			// Jeśli użytkownik jest zalogowany, zapisz jego nazwę do tabeli profiles
			if (currentUser) {
				const name = localStorage.getItem('newUserName');
				if (name) {
					const { error: insertError } = await supabase
						.from('profiles')
						.insert([{ user_id: currentUser.id, name: name }]);

					if (insertError) {
						console.error('Error inserting to profiles:', insertError);
						throw insertError;
					}

					// Usuń nazwę użytkownika z localStorage po zapisaniu do tabeli profiles
					localStorage.removeItem('newUserName');
				}
			}
		});

		return () => {
			authListener?.unsubscribe();
		};
	}, []);

	const signUp = async (name, email, password) => {
		localStorage.setItem('newUserName', name);
		// Rejestracja użytkownika
		const { user, error: signUpError } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (signUpError) {
			console.error(signUpError);
			throw signUpError;
		}

		// Sprawdzanie, czy użytkownik został pomyślnie utworzony
		if (user) {
			// Zapisywanie dodatkowych informacji o użytkowniku w tabeli `profiles`
			const { error: profileError } = await supabase.from('profiles').insert([{ user_id: user.id, name: name }]);

			if (profileError) {
				console.error(profileError);
				throw profileError;
			}
		}
	};

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

	const value = { user, login, logout, signUp };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
