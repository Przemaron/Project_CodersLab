import { Link } from 'react-router-dom';
import '../assets/styles/Aside.scss';
import DateTimeDisplay from './DateAndTime';
import {useAuth} from '../components/AuthProvider';

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
				<Link to='/dashboard'>Start</Link>
				<Link to='/budget'>Budżet</Link>
				<Link to='/how-to'>Jak to działa?</Link>
			</nav>
			<button onClick={handleLogout}>Wyloguj</button>
		</aside>
	);
};

export default Aside;
