import { Link } from 'react-router-dom';
import '../assets/styles/Aside.scss';
import DateTimeDisplay from './DateAndTime';

const Aside = () => {
	return (
		<aside className='aside'>
			<div>Logo</div>
			<nav>
				<Link to='/dashboard'>Dashboard</Link>
				<Link to='/budget'>Budget</Link>
				<Link to='/how-to'>How to</Link>
			</nav>
			<DateTimeDisplay />
		</aside>
	);
};

export default Aside;
