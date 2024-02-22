import { useEffect, useState } from 'react';
import { supabase } from '../API/supabaseClient';
import '../assets/styles/IncomeForm.scss';

const IncomeForm = ({ addSavings }) => {
	const [income, setIncome] = useState('');
	const [savingsRate, setSavingsRate] = useState('');
	const [monthlyIncomeTotal, setMonthlyIncomeTotal] = useState(0);

	// Funkcja do pobierania sumy przychodów w bieżącym miesiącu
	const fetchMonthlyIncomeTotal = async () => {
		const today = new Date();
		const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
		const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

		const { data, error } = await supabase
			.from('incomeTable')
			.select('amount')
			.gte('date', firstDayOfMonth)
			.lte('date', lastDayOfMonth);

		if (error) {
			console.error('Błąd przy pobieraniu sumy przychodów:', error);
		} else {
			const total = data.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
			setMonthlyIncomeTotal(total);
		}
	};
	useEffect(() => {
		fetchMonthlyIncomeTotal();
	}, []);
	
	const handleSubmit = async e => {
		e.preventDefault();
		
		// Zapisz przychód w bazie danych
		const formattedDate = new Date().toISOString().split('T')[0];

		const { data, error } = await supabase
			.from('incomeTable')
			.insert([
				{ amount: income, savingsRate: savingsRate, date: formattedDate, savings: income * (savingsRate / 100) },
			]);

		if (error) {
			console.error('Błąd przy zapisie przychodu:', error);
		} else {
			fetchMonthlyIncomeTotal();
			console.log('Przychód zapisany pomyślnie:', data);
			if (addSavings) {
				addSavings(parseFloat(income), parseFloat(savingsRate));
			}
			// Odśwież sumę przychodów po dodaniu nowego przychodu
			fetchMonthlyIncomeTotal();
		}
		
		setIncome('');
		setSavingsRate('');
	};

	return (
		<form className='incomeForm' onSubmit={handleSubmit}>
			<h2>Przychody w bieżącym miesiącu: </h2>
			<p>{monthlyIncomeTotal.toFixed(2)} zł</p>
			<input
				type='number'
				value={income}
				onChange={e => setIncome(e.target.value)}
				placeholder='Wprowadź przychód'
				required
			/>
			<select value={savingsRate} onChange={e => setSavingsRate(e.target.value)} required>
				<option value=''>Wybierz oszczędności</option>
				<option value='0'>0%</option>
				<option value='3'>3%</option>
				<option value='5'>5%</option>
				<option value='10'>10%</option>
			</select>
			<button type='submit'>Dodaj</button>
		</form>
	);
};

export default IncomeForm;
