import { useState } from 'react';
import Aside from '../components/Aside';
import LoginForm from '../components/LoginForm';
import MainSection from '../components/MainSection';
import '../assets/styles/App.scss';
// import react router
// import ApplicationAside from './app';
// import AppSectionMain from './app';
// import Balance - wyświetlanie stanu konta
// import Add operation - włączane przyciskiem
//

const App = () => {
	const [loggedIn, setLoggedIn] = useState(false);

	return (
		<div className='app'>
			{!loggedIn ? (
				<LoginForm onLogin={setLoggedIn} />
			) : (
				<>
					<Aside />
					<MainSection />
				</>
			)}
		</div>
	);
}

export default App;
