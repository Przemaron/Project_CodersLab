import { useEffect, useState } from 'react';
import { supabase } from '../API/supabaseClient';
import '../assets/styles/IncomeForm.scss';

const IncomeForm = ({ addSavings }) => {
	const [income, setIncome] = useState('');
	const [savingsRate, setSavingsRate] = useState('');
	const [monthlyIncomeTotal, setMonthlyIncomeTotal] = useState(0);
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		// Definicja asynchronicznej funkcji wewnątrz useEffect
		const fetchUser = async () => {
			const { data: session } = await supabase.auth.getSession();
			const { data: userResponse } = await supabase.auth.getUser();
			const user = session?.user || userResponse?.user;

			if (user) {
				console.log(user);
				setUserId(user.id);
				fetchMonthlyIncomeTotal(user.id);
			}
		};

		// Wywołanie asynchronicznej funkcji
		fetchUser();
	}, []);

	// Funkcja do pobierania sumy przychodów w bieżącym miesiącu
	const fetchMonthlyIncomeTotal = async userId => {
		const today = new Date();
		const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
		const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

		const { data, error } = await supabase
			.from('incomeTable')
			.select('amount')
			.gte('date', firstDayOfMonth)
			.lte('date', lastDayOfMonth)
			.eq('user_id', userId);

		if (error) {
			console.error('Błąd przy pobieraniu sumy przychodów:', error);
		} else {
			const total = data.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
			setMonthlyIncomeTotal(total);
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();

		if (!userId) {
			console.error('Błąd: Brak identyfikatora użytkownika.');
			return;
		}

		// Zapisz przychód w bazie danych
		const formattedDate = new Date().toISOString().split('T')[0];
		const numericIncome = parseFloat(income);
		const numericSavingsRate = parseFloat(savingsRate) / 100;
		const savings = numericIncome * numericSavingsRate;
		const remainingIncome = numericIncome - savings;

		const { data, error } = await supabase.from('incomeTable').insert([
			{
				user_id: userId,
				amount: numericIncome,
				savingsRate: savingsRate,
				date: formattedDate,
				savings: savings,
				remaining: remainingIncome,
			},
		]);

		if (error) {
			console.error('Błąd przy zapisie przychodu:', error);
		} else {
			console.log('Przychód zapisany pomyślnie:', data);
			fetchMonthlyIncomeTotal(userId);
			if (addSavings) {
				addSavings(parseFloat(income), parseFloat(savingsRate));
			}
			setIncome('');
			setSavingsRate('');
		}
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
