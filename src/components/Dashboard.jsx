import { useState } from 'react';
import IncomeForm from './IncomeForm';
import ExpensesWidget from './ExpensesWidget';
import RemainingWidget from './RemainingWidget';
import SavingsWidget from './SavingsWidget';
import '../assets/styles/Dashboard.scss';

const Dashboard = ({expenses}) => {
	const [savings, setSaving] = useState(0);

	const addSavings = (income, rate) => {
		const newSavings = income * (rate / 100);
		setSaving(savings + newSavings);
	};
	console.log(expenses); // Czy dane dotarły tutaj?
	return (
		<div className='dashboard' style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
			<IncomeForm addSavings={addSavings} />
			<ExpensesWidget expenses={expenses}/>
			<RemainingWidget />
			<SavingsWidget savings={savings} />
		</div>
	);
};

export default Dashboard;
