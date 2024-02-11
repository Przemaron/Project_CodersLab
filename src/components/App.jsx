import { useState } from 'react';
import Aside from '../components/Aside';
import LoginForm from '../components/LoginForm';
import MainSection from '../components/MainSection';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import '../assets/styles/App.scss';
// import react router
// import ApplicationAside from './app';
// import AppSectionMain from './app';
// import Balance - wyświetlanie stanu konta
// import Add operation - włączane przyciskiem
//

const App = () => {
	const [loggedIn, setLoggedIn] = useState(true); // false żeby zobaczyć formularz logowania

	return (
		<div className='app'>
			{!loggedIn ? (
				<LoginForm onLogin={setLoggedIn} />
			) : (
				<Router>
					<Aside />
					<MainSection>
						<Routes>
							<Route path='/dashboard' element={<Dashboard />} />
							{/* Możesz dodać więcej ścieżek i komponentów tutaj */}
						</Routes>
					</MainSection>
				</Router>
			)}
		</div>
	);
};

export default App;
