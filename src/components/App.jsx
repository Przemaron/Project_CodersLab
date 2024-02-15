import { useState } from 'react';
import Aside from '../components/Aside';
import LoginForm from '../components/LoginForm';
import MainSection from '../components/MainSection';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Budget from '../components/Budget';
import '../assets/styles/App.scss';

const App = () => {
	const [loggedIn, setLoggedIn] = useState(true); // false żeby zobaczyć formularz logowania
	const [expenses, setExpenses] = useState([])
	console.log('dane zaktualizowane w APP', expenses); // Sprawdź aktualny stan wydatków
	return (
		<div className='app'>
			{!loggedIn ? (
				<LoginForm onLogin={setLoggedIn} />
			) : (
				<Router>
					<Aside />
					<MainSection>
						<Routes>
							<Route path='/dashboard' element={<Dashboard expenses={expenses}/>} />
							<Route path='/budget' element={<Budget expenses={expenses} setExpenses={setExpenses}/>} />
							{/* Możesz dodać więcej ścieżek i komponentów tutaj */}
						</Routes>
					</MainSection>
				</Router>
			)}
		</div>
	);
};

export default App;
