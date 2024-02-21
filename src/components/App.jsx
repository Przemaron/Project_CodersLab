import { useState } from 'react';
import Aside from '../components/Aside';
import LoginForm from '../components/LoginForm';
import MainSection from '../components/MainSection';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Budget from '../components/Budget';
import '../assets/styles/App.scss';
import { useAuth } from '../components/AuthProvider';

const App = () => {
	const { user } = useAuth();
	const [expenses, setExpenses] = useState([]);
	const [incomes, setIncomes] = useState([]);
		
	return (
		<div className='app'>
			{!user ? (
				<LoginForm />
			) : (
				<Router>
					<Aside />
					<MainSection>
						<Routes>
							<Route
								path='/dashboard'
								element={
									<Dashboard expenses={expenses} setExpenses={setExpenses} incomes={incomes} setIncomes={setIncomes} />
								}
							/>
							<Route
								path='/budget'
								element={
									<Budget expenses={expenses} setExpenses={setExpenses} incomes={incomes} setIncomes={setIncomes} />
								}
							/>
						</Routes>
					</MainSection>
				</Router>
			)}
		</div>
	);
};

export default App;
