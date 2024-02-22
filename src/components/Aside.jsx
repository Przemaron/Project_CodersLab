import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../assets/styles/Aside.scss';
import DateTimeDisplay from './DateAndTime';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../API/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Aside = () => {
	const { user, logout } = useAuth(); // Użyj hooka useAuth do dostępu do funkcji logout
	const [name, setName] = useState('');
	// Użyj hooka useEffect do pobrania profilu użytkownika po zalogowaniu
	const navigate = useNavigate();
	useEffect(() => {
		const fetchProfile = async () => {
			console.log('Fetching profile for user ID:', user.id);
			if (user) {
				const { data, error } = await supabase.from('profiles').select('name').eq('user_id', user.id).single();

				if (error) {
					console.error('Error fetching profile:', error);
					return;
				} else {
					setName(data.name);
				}
			}
		};

		fetchProfile();
	}, [user]);
	// Utwórz funkcję handleLogout, która wywoła funkcję logout
	const handleLogout = async () => {
		
		try {
			await logout(); // Wywołaj funkcję logout
			navigate('/dashboard');
		} catch (error) {
			console.error('Problem z wylogowaniem:', error);
		}
	};
	// Wyrenderuj komponent Aside
	return (
		<aside className='aside'>
			<DateTimeDisplay />
			{name && (
				<p className='loginName'>
					<i className='fa-solid fa-user'></i> {name.toUpperCase()}
				</p>
			)}
			<nav>
				<Link to='/dashboard'>
					<i className='fa-solid fa-house'></i>Start
				</Link>
				<Link to='/budget'>
					<i className='fa-solid fa-wallet'></i>Budżet
				</Link>
				<Link to='/instruction'>
					<i className='fa-solid fa-circle-info'></i>O aplikacji
				</Link>
			</nav>
			<button className='logOutButton' onClick={handleLogout}>
				<i className='fa-solid fa-right-from-bracket'></i>
				Wyloguj
			</button>
		</aside>
	);
};

export default Aside;
