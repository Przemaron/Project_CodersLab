import { Link } from 'react-router-dom';
import '../assets/styles/Aside.scss';

const Aside = () => {
	return (
		<aside className='aside'>
			<div>Logo</div>
			<nav>
				<Link to='/dashboard'>Dashboard</Link>
				<Link to='/budget'>Budget</Link>
				<Link to='/how-to'>How to</Link>
			</nav>
		</aside> // Fix: Replace <aside/> with </aside>
	);
};

export default Aside;
