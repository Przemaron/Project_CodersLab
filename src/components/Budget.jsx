import { useEffect, useState } from 'react';
import { supabase } from '../API/supabaseClient';
import '../assets/styles/Budget.scss';

const categories = [
	'dom',
	'zakupy',
	'bar/rozrywka/jedzenie na mieście',
	'transport',
	'paliwo',
	'rozwój',
	'ubrania/obuwie',
	'lekarz/dentysta',
	'inwestycje',
	'inne',
];

const Budget = ({ expenses, setExpenses }) => {
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
	const [name, setName] = useState('');
	const [category, setCategory] = useState(categories[0]);
	const [amount, setAmount] = useState('');
	const [isRecurring, setIsRecurring] = useState(false);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

	// Pobieranie danych z Supabase
	useEffect(() => {
		const fetchData = async () => {
			const { data, error } = await supabase.from('test').select();
			console.log(data);
			if (error) {
				console.error('Błąd przy pobieraniu danych', error);
			} else {
				setExpenses(data || []);
			}
		};

		fetchData();
	}, [setExpenses]);

	// Sortowanie wydatków
	const sortExpenses = key => {
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });

		setExpenses(prevExpenses => {
			return [...prevExpenses].sort((a, b) => {
				if (a[key] < b[key]) {
					return direction === 'ascending' ? -1 : 1;
				}
				if (a[key] > b[key]) {
					return direction === 'ascending' ? 1 : -1;
				}
				return 0;
			});
		});
	};

	// Zmiana pierwszej litery na wielką
	const capitalizeFirstLetter = string => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	// Wysyłanie danych do Supabase
	const handleSubmit = async e => {
		e.preventDefault();
		const newName = capitalizeFirstLetter(name);
		const newExpense = { date, name: newName, category, amount: parseFloat(amount), isRecurring };

		const { data, error } = await supabase.from('test').insert([newExpense]).select('*');

		if (error) {
			console.error('Błąd przy dodawaniu danych', error);
		} else if (data && data.length > 0) {
			setExpenses(prev => [...prev, ...data]);
			setDate(new Date().toISOString().split('T')[0]);
			setName('');
			setCategory(categories[0]);
			setAmount('');
			setIsRecurring(false);
		} else {
			console.error('Nie otrzymano danych z Supabase');
		}
		// Czyszczenie formularza
		resetForm();
	};

	// Resetowanie formularza
	const resetForm = () => {
		setDate(new Date().toISOString().split('T')[0]);
		setName('');
		setCategory(categories[0]);
		setAmount('');
		setIsRecurring(false);
	};

	// Wskaźnik kierunku sortowania
	const getSortDirectionIndicator = key => {
		if (sortConfig.key !== key) {
			return;
		}
		return sortConfig.direction === 'ascending' ? '↓' : '↑';
	};
	// Przygotowanie danych do tabeli
	const prepareDataForTable = expenses => {
		// Filtrowanie wydatków cyklicznych
		const cyclicExpenses = expenses.filter(expense => expense.isRecurring);

		// Zbieranie unikalnych miesięcy
		const uniqueMonths = [
			...new Set(
				cyclicExpenses.map(expense =>
					new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' })
				)
			),
		].sort((a, b) => new Date(a) - new Date(b));

		// Sumowanie wydatków dla każdego miesiąca
		const monthlySums = uniqueMonths.map(month =>
			cyclicExpenses
				.filter(
					expense => new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' }) === month
				)
				.reduce((sum, curr) => sum + curr.amount, 0)
		);

		return { uniqueMonths, monthlySums };
	};
	// Usuwanie wydatku
	const removeExpense = async expenseToRemove => {
		if (window.confirm('Czy na pewno chcesz usunąć ten wydatek?')) {
			const { error } = await supabase.from('test').delete().match({ id: expenseToRemove.id });

			if (error) {
				console.error('Błąd przy usuwaniu danych', error);
			} else {
				setExpenses(expenses.filter(expense => expense !== expenseToRemove));
			}
		}
	};

	const { uniqueMonths, monthlySums } = prepareDataForTable(expenses);

	return (
		<div className='budget'>
			<div style={{ width: '100%', display: 'flex' }}>
				<div style={{ width: '50%' }}>
					<h2>Dodaj wydatek</h2>
					<form onSubmit={handleSubmit}>
						<label>
							Data:
							<input type='date' value={date} onChange={e => setDate(e.target.value)} />
						</label>
						<label>
							Nazwa wydatku:
							<input
								type='text'
								value={name}
								onChange={e => setName(e.target.value)}
								placeholder='Podaj nazwę wydatku'
							/>
						</label>
						<label>
							Kategoria:
							<select value={category} onChange={e => setCategory(e.target.value)}>
								<option>Wybierz kategorię</option>
								{categories.map(category => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</label>
						<label>
							Kwota:
							<input type='number' value={amount} onChange={e => setAmount(e.target.value)} placeholder='Podaj kwotę' />
						</label>
						<div className='formControl'>
							<div className='checkboxControl'>
								<label>Cykliczny:</label>
								<input type='checkbox' checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} />
							</div>
							<button type='submit'>Dodaj</button>
						</div>
					</form>
				</div>
				<div style={{ width: '50%' }}>
					<h3>Wydatki cykliczne z podziałem na miesiące</h3>
					<div className='table-container'>
						<table>
							<thead>
								<tr>
									<th>Miesiąc</th>
									<th>Suma wydatków cyklicznych</th>
								</tr>
							</thead>
							<tbody>
								{uniqueMonths.map((month, index) => (
									<tr key={index}>
										<td>{month}</td>
										<td>{`${monthlySums[index]} zł`}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<h3>Lista wydatków</h3>
			<div className='table-container'>
				{expenses.length > 0 ? (
					<table>
						<thead>
							<tr>
								<th onClick={() => sortExpenses('date')}>Data {getSortDirectionIndicator('date')}</th>
								<th onClick={() => sortExpenses('name')}>Nazwa wydatku {getSortDirectionIndicator('name')}</th>
								<th onClick={() => sortExpenses('category')}>Kategoria {getSortDirectionIndicator('category')}</th>
								<th onClick={() => sortExpenses('amount')}>Kwota {getSortDirectionIndicator('amount')}</th>
								<th onClick={() => sortExpenses('isRecurring')}>
									Cykliczny {getSortDirectionIndicator('isRecurring')}
								</th>
								<th>Akcja</th>
							</tr>
						</thead>
						<tbody>
							{expenses.map(expense => (
								<tr key={expense.id}>
									<td>{expense.date}</td>
									<td>{expense.name}</td>
									<td>{expense.category}</td>
									<td>{`${expense.amount} zł`}</td>
									<td>{expense.isRecurring ? 'Tak' : 'Nie'}</td>
									<td>
										<button className='expensesDeleteButton' onClick={() => removeExpense(expense)}>
											Usuń
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>Nie znaleziono wydatków</p>
				)}
			</div>
		</div>
	);
};

export default Budget;
