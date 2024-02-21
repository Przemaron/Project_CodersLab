import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../assets/styles/Aside.scss';
import DateTimeDisplay from './DateAndTime';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../API/supabaseClient';

const Aside = () => {
	const { user, logout } = useAuth(); // Użyj hooka useAuth do dostępu do funkcji logout
	const [name, setName] = useState('');

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

	const handleLogout = async () => {
		try {
			await logout(); // Wywołaj funkcję logout
		} catch (error) {
			console.error('Problem z wylogowaniem:', error);
		}
	};

	return (
		<aside className='aside'>
			<DateTimeDisplay />
			{name && (
				<p className='loginName'>
					<i className='fa-solid fa-user'></i> {name}
				</p>
			)}
			<nav>
				<Link to='/dashboard'>
					<i className='fa-solid fa-house'></i>Start
				</Link>
				<Link to='/budget'>
					<i className='fa-solid fa-wallet'></i>Budżet
				</Link>
				<Link to='/how-to'>
					<i className='fa-solid fa-circle-info'></i>Jak to działa?
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
