import { useEffect, useState } from 'react';
import IncomeForm from './IncomeForm';
import ExpensesWidget from './ExpensesWidget';
import RemainingWidget from './RemainingWidget';
import SavingsWidget from './SavingsWidget';
import { supabase } from '../API/supabaseClient';
import '../assets/styles/Dashboard.scss';

const Dashboard = ({ expenses, setExpenses, incomes, setIncomes }) => {
	const [savings, setSavings] = useState(0);

	const fetchExpensesIncomesAndSavings = async () => {
		const { data: expensesData, error: expensesError } = await supabase
			.from('expensesTable') // Nazwa tabeli w Supabase
			.select('*');

		if (expensesError) {
			console.error('Błąd przy pobieraniu wydatków:', expensesError);
		} else {
			setExpenses(expensesData);
		}

		// Pobieranie przychodów
		const { data: incomesData, error: incomesError } = await supabase
			.from('incomeTable') // Upewnij się, że nazwa tabeli jest poprawna
			.select('*');

		if (incomesError) {
			console.error('Błąd przy pobieraniu przychodów:', incomesError);
		} else {
			setIncomes(incomesData);
		}

		// Zakładając, że pole 'savings' istnieje i jest liczbą; oblicz sumę
		const totalSavings = incomesData.reduce((acc, item) => acc + parseFloat(item.savings || 0), 0);
		setSavings(totalSavings); // Aktualizuj stan sumą oszczędności
	};

	// Pobierz dane z Supabase przy pierwszym renderowaniu
	useEffect(() => {
		fetchExpensesIncomesAndSavings();
	}, []);

	const addSavings = (income, rate) => {
		const newSavings = income * (rate / 100);
		setSavings(prevSavings => prevSavings + newSavings);
	};

	return (
		<div className='dashboard' style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
			<IncomeForm addSavings={addSavings} />
			<ExpensesWidget expenses={expenses} />
			<RemainingWidget expenses={expenses} incomes={incomes} />
			<SavingsWidget savings={savings} />
		</div>
	);
};

export default Dashboard;
