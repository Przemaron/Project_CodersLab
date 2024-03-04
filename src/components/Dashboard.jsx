import { useEffect, useState } from 'react';
import IncomeForm from './IncomeForm';
import ExpensesWidget from './ExpensesWidget';
import SavingsWidget from './SavingsWidget';
import { supabase } from '../API/supabaseClient';
import DashboardPieChart from './DashboardPieChart';
import '../assets/styles/Dashboard.scss';

const Dashboard = ({ expenses, setExpenses, setIncomes }) => {
	const [savings, setSavings] = useState(0);
	// Pobierz wydatki, przychody i oszczędności z Supabase
	const fetchExpensesIncomesAndSavings = async () => {
		const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error('Brak zalogowanego użytkownika');
            return;
        }
        const userId = user.id;

		const { data: expensesData, error: expensesError } = await supabase
		.from('expensesTable')
		.select('*')
		.eq('user_id', userId);

		if (expensesError) {
			console.error('Błąd przy pobieraniu wydatków:', expensesError);
		} else {
			setExpenses(expensesData);
		}

		// Pobieranie przychodów
		const { data: incomesData, error: incomesError } = await supabase.from('incomeTable').select('*').eq('user_id', userId);

		if (incomesError) {
			console.error('Błąd przy pobieraniu przychodów:', incomesError);
		} else {
			setIncomes(incomesData);
			
			const totalSavings = incomesData.reduce((acc, item) => acc + parseFloat(item.savings || 0), 0);
			setSavings(totalSavings); // Aktualizuj stan sumą oszczędności
		}

		// Zakładając, że pole 'savings' istnieje i jest liczbą; oblicz sumę
	};

	// Pobierz dane z Supabase przy pierwszym renderowaniu
	useEffect(() => {
		fetchExpensesIncomesAndSavings();
	}, []);

	// Funkcja dodająca oszczędności
	const addSavings = (income, rate) => {
		const newSavings = income * (rate / 100);
		setSavings(prevSavings => prevSavings + newSavings);
	};

	return (
		<div className='dashboardSection'>
			<div className='upperRow'>
				<IncomeForm addSavings={addSavings} />
				<ExpensesWidget expenses={expenses} />
			</div>
			<div className='lowerRow'>
				<div className='chartPie'>
					<div>
						<DashboardPieChart />
					</div>
				</div>
				<SavingsWidget savings={savings} />
			</div>
		</div>
	);
};

export default Dashboard;
