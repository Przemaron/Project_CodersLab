import { useState } from 'react';
import Aside from '../components/Aside';
import LoginForm from '../components/LoginForm';
import MainSection from '../components/MainSection';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Budget from '../components/Budget';
import '../assets/styles/App.scss';
import {useAuth} from '../components/AuthProvider';

const App = () => {
	// const [loggedIn, setLoggedIn] = useState(false);
	const { user } = useAuth();
	const [expenses, setExpenses] = useState([])
	const [incomes, setIncomes] = useState([]);

	console.log('incomes w app:', incomes);
	console.log('dane zaktualizowane w APP', expenses); // Sprawdź aktualny stan wydatków
	return (
		<div className='app'>
			{!user ? (
				<LoginForm />
			) : (
				<Router>
					<Aside />
					<MainSection>
						<Routes>
							<Route path='/dashboard' element={<Dashboard expenses={expenses} setExpenses={setExpenses} incomes={incomes} setIncomes={setIncomes}/>} />	
							<Route path='/budget' element={<Budget expenses={expenses} setExpenses={setExpenses} incomes={incomes} setIncomes={setIncomes}/>} />
							{/* Możesz dodać więcej ścieżek i komponentów tutaj */}
						</Routes>
					</MainSection>
				</Router>
			)}
		</div>
	);
};

export default App;
