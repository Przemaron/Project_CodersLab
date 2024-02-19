import { useState } from 'react';
import '../assets/styles/LoginForm.scss';
import { useAuth } from '../components/AuthProvider';

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { login } = useAuth();

	const handleSubmit = async event => {
		event.preventDefault();
		setError(''); // Czyszczenie błędów przed nową próbą logowania

		if (!email || !password) {
			setError('Pola nie mogą być puste');
			return;
		}
		try {
			await login(email, password); // Użyj funkcji login zamiast bezpośredniego wywołania Supabase
			// onLogin(true); Nie jest potrzebne, jeśli stan zalogowanego użytkownika jest zarządzany przez AuthProvider
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<>
			<div className='login-form-container'>
			<div className='formCircleUp'></div>
				<form className='login-form' onSubmit={handleSubmit}>
        <h2>Login</h2>
					<div>
						<label htmlFor='username'>Nazwa użytkownika:</label>
						<input
							id='username'
							type='text'
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder='Podaj nazwę'
						/>
					</div>
					<div>
						<label htmlFor='password'>Hasło:</label>
						<input
							id='password'
							type='password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder='Podaj hasło'
						/>
					</div>
					{error && <div>{error}</div>}
					<button type='submit'>Zaloguj</button>
				</form>
			<div className='formCircleDown'></div>
			</div>
		</>
	);
};

export default LoginForm;
