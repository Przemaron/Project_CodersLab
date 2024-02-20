import { Link } from 'react-router-dom';
import '../assets/styles/Aside.scss';
import DateTimeDisplay from './DateAndTime';
import { useAuth } from '../components/AuthProvider';

const Aside = () => {
	const { logout } = useAuth(); // Użyj hooka useAuth do dostępu do funkcji logout

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
