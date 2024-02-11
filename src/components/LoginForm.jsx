import {useState} from 'react';
import '../assets/styles/LoginForm.scss'

const LoginForm = ({onLogin}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if(!username || !password){
      setError('Pola nie mogą być puste')      
    } else {
      if (username === 'przemek' && password === '12345') {
          onLogin(true);
        } else {
          setError('Niepoprawna nazwa użytkownika lub hasło');
        }
    }
        
  };

  return (
    <div className="login-form-container" >
      <form className='login-form' onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nazwa użytkownika:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Podaj nazwę'
          />
        </div>
        <div>
          <label htmlFor="password">Hasło:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Podaj hasło'
          />
        </div>
        {error && <div>{error}</div>}
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
};

export default LoginForm;