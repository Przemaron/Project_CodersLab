import { useState } from 'react';
import '../assets/styles/LoginForm.scss';
import { useAuth } from '../components/AuthProvider';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false); // Nowy stan do przełączania między logowaniem a rejestracją
    const { login, signUp } = useAuth(); // Zakładamy, że useAuth dostarcza też funkcję register
    
    const getPolishErrorMessage = (error) => {
        const messageMap = {
          'Invalid login credentials': 'Błędny adres e-mail lub hasło.',
          'User already registered': 'Użytkownik już istnieje.',
        };
      
        // Fallback to a generic error message if the specific error is not mapped
        return messageMap[error.message] || 'Wystąpił nieoczekiwany błąd';
      };

    const handleSubmit = async event => {
        event.preventDefault();
        setError(''); // Czyszczenie błędów przed nową próbą

        if (!email || !password || (isRegistering && !name)) {
            setError('Wszystkie pola muszą być wypełnione');
            return;
        }

        if (!email.includes('@')) {
            setError('Email musi zawierać znak "@"');
            return;
        }

        if (password.length < 6) {
            setError('Hasło musi mieć minimum 6 znaków');
            return;
        }

        try {
            if (isRegistering) {
                // Proces rejestracji
                await signUp(name, email, password);
            } else {
                // Proces logowania
                await login(email, password);
            }
        } catch (error) {
            setError(getPolishErrorMessage(error));
        }
    };

    return (
        <>
            <div className='login-form-container'>
                <div className='formCircleUp'></div>
                <form className='login-form' onSubmit={handleSubmit}>
                    <h2>{isRegistering ? 'Rejestracja' : 'Login'}</h2>
                    {isRegistering && (
                        <div>
                            <label htmlFor='name'>Imię:</label>
                            <input
                                id='name'
                                type='text'
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder='Podaj imię'
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor='email'>Email:</label>
                        <input
                            id='email'
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
                    {error && <div className="error">{error}</div>}
                    <button type='submit'>{isRegistering ? 'Zarejestruj' : 'Zaloguj'}</button>
                    <button type='button' onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? 'Masz już konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się'}
                    </button>
                </form>
                <div className='formCircleDown'></div>
            </div>
        </>
    );
};

export default LoginForm;
