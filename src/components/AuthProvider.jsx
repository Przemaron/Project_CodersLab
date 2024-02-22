import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../API/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const session = supabase.auth.getSession();
		setUser(session?.user || null);
		//
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
	// Rejestracja użytkownika
	const signUp = async (name, email, password) => {
		// Próba rejestracji użytkownika
		const { user, error: signUpError } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (signUpError) {
			console.error(signUpError);
			// Sprawdzenie, czy błąd wynika z istnienia już użytkownika
			if (signUpError.message.includes('already exists')) {
				console.log('Użytkownik już istnieje. Próba logowania...');
				// Jeśli użytkownik już istnieje, próbujemy zalogować bez dodawania do tabeli profiles
				const { error: loginError } = await supabase.auth.signIn({
					email: email,
					password: password,
				});
				if (loginError) {
					console.error('Błąd logowania:', loginError);
					throw loginError;
				}
			} else {
				throw signUpError;
			}
		} else if (user) {
			console.log('Użytkownik zarejestrowany. Dodawanie do profiles...');
			// Użytkownik zarejestrowany pomyślnie, dodajemy do tabeli profiles
			await addUserProfile(user.id, name);
		}
	};

	// Dodawanie dodatkowych informacji o użytkowniku
	const addUserProfile = async (userId, name) => {
		const { error: profileError } = await supabase.from('profiles').insert([{ user_id: userId, name: name }]);
		if (profileError) {
			console.error('Błąd przy dodawaniu do profiles:', profileError);
			throw profileError;
		}
	};
	// Logowanie użytkownika
	const login = async (email, password) => {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			throw error;
		}
	};
	// Wylogowanie użytkownika
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
