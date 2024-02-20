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

		// Walidacja, czy email zawiera znak '@'
		if (!email.includes('@')) {
			setError('Email musi zawierać znak "@"');
			return;
		}
	
		// Walidacja, czy hasło ma minimum 6 znaków
		if (password.length < 6) {
			setError('Hasło musi mieć minimum 6 znaków');
			return;
		}

		try {
			await login(email, password)
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
						<label htmlFor='username'>Email:</label>
						<input
							id='username'
							type='text'
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder='Podaj email'
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
					<button type='submit'><i class="fa-solid fa-right-to-bracket"></i>Zaloguj</button>
				</form>
			<div className='formCircleDown'></div>
			</div>
		</>
	);
};

export default LoginForm;
