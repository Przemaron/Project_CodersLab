import { useEffect, useState } from 'react';
import { supabase } from '../API/supabaseClient';
import '../assets/styles/Budget.scss';
import ExpensesBarChart from './ExpensesBarChart';

const categories = [
	'dom',
	'zakupy',
	'bar/rozrywka',
	'transport',
	'paliwo',
	'rozwój',
	'ubrania/obuwie',
	'lekarz/dentysta',
	'inwestycje',
	'inne',
];

const Budget = ({ expenses, setExpenses, setIncomes }) => {
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
	const [name, setName] = useState('');
	const [category, setCategory] = useState(''); //
	const [amount, setAmount] = useState('');
	const [isRecurring, setIsRecurring] = useState(false);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const currentDate = new Date();
	const selectedDate = new Date(date);

	// Pobieranie danych z Supabase
	useEffect(() => {
		const fetchData = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				const userId = user.id;

				const { data, error } = await supabase.from('expensesTable').select('*').eq('user_id', userId);

				if (error) {
					console.error('Błąd przy pobieraniu danych', error);
				} else {
					setExpenses(data || []);
				}
			}
		};

		fetchData();
	}, [setExpenses, setIncomes]);

	// Sprawdzanie czy data wydatku jest z przyszłości (poza bieżącym miesiącem) jeśli tak, to ustaw `isRecurring` na `true`
	useEffect(() => {
		if (
			(selectedDate.getMonth() > currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear()) ||
			selectedDate.getFullYear() > currentDate.getFullYear()
		) {
			setIsRecurring(true);
		}
	}, [selectedDate, currentDate]); // Zależności: aktualizuj, gdy `selectedDate` lub `currentDate` się zmieniają

	// Wysyłanie danych do Supabase
	const handleSubmit = async e => {
		e.preventDefault();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error('Brak zalogowanego użytkownika');
			return;
		}

		const userId = user.id;

		const newName = capitalizeFirstLetter(name);

		// Sprawdzenie, czy wszystkie pola zostały wypełnione
		if (!name.trim() || !category.trim() || !amount.trim()) {
			alert('Wszystkie pola są wymagane.');
			return;
		}

		// Walidacja kwoty - sprawdzenie, czy zawiera tylko liczby
		const parsedAmount = parseFloat(amount);
		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			alert('Kwota musi być dodatnią liczbą.');
			return;
		}

		// Walidacja daty - sprawdzanie czy data nie jest z przeszłości (poza bieżącym miesiącem)
		if (
			selectedDate < currentDate &&
			(selectedDate.getMonth() !== currentDate.getMonth() || selectedDate.getFullYear() !== currentDate.getFullYear())
		) {
			alert('Nie można dodać operacji z miesiąca minionego.');
			return;
		}

		// Dodawanie nowego wydatku
		const newExpense = { date, name: newName, category, amount: parseFloat(amount), isRecurring, user_id: userId};
		const { data, error } = await supabase.from('expensesTable').insert([newExpense]).select();

		if (error) {
			console.error('Błąd przy dodawaniu danych', error);
		} else if (data && data.length > 0) {
			setExpenses(prev => [...prev, ...data]);
			setDate(new Date().toISOString().split('T')[0]);
			setName('');
			setCategory('');
			setAmount('');
			setIsRecurring(false);
		} else {
			console.error('Nie otrzymano danych z Supabase');
		}

		// Resetowanie formularza
		const resetForm = () => {
			setDate(new Date().toISOString().split('T')[0]);
			setName('');
			setCategory('');
			setAmount('');
			setIsRecurring(false);
		};

		// Czyszczenie formularza
		resetForm();
	};

	// Usuwanie wydatku
	const removeExpense = async expenseToRemove => {
		if (window.confirm('Czy na pewno chcesz usunąć ten wydatek?')) {
			const { error } = await supabase.from('expensesTable').delete().match({ id: expenseToRemove.id });

			if (error) {
				console.error('Błąd przy usuwaniu danych', error);
			} else {
				setExpenses(expenses.filter(expense => expense !== expenseToRemove));
			}
		}
	};

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

	// Wskaźnik kierunku sortowania
	const getSortDirectionIndicator = key => {
		if (sortConfig.key !== key) {
			return;
		}
		return sortConfig.direction === 'ascending' ? '↓' : '↑';
	};

	// Zmiana pierwszej litery na wielką
	const capitalizeFirstLetter = string => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	// Filtrowanie operacji cyklicznych na podstawie wybranego miesiąca i roku
	const filteredCyclicExpenses = expenses.filter(expense => {
		const expenseDate = new Date(expense.date);
		const expenseMonth = expenseDate.getMonth() + 1;
		const expenseYear = expenseDate.getFullYear();
		return expense.isRecurring && expenseMonth === selectedMonth && expenseYear === selectedYear;
	});

	// Zamiana liczby miesiąca na nazwę
	const monthNames = [
		'Styczeń',
		'Luty',
		'Marzec',
		'Kwiecień',
		'Maj',
		'Czerwiec',
		'Lipiec',
		'Sierpień',
		'Wrzesień',
		'Październik',
		'Listopad',
		'Grudzień',
	];
	const monthName = monthNames[selectedMonth - 1];

	return (
		<div className='budgetSection'>
			<div className='upperRow'>
				{/*Formularz dodawania wydatku*/}

				<div className='addExpenseForm'>
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
								<option value='' disabled hidden>
									Wybierz kategorię
								</option>
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

				{/*Tabela wydatków*/}

				<div className='tableCurrent-container'>
					<h2>Wszystkie wydatki</h2>
					<div className='tableCurrent'>
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
									</tr>
								</thead>
							</table>
						)}
					</div>
				</div>
			</div>

			{/*Tabela zaplanowanych wydatków */}

			<div className='lowerRow'>
				<div className='tableCycle-container'>
					<h2>
						Planowane wydatki ({monthName.slice(0, 3)} / {selectedYear})
					</h2>
					<div className='tableCycle-control'>
						<label>
							Wybierz miesiąc:
							<select value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value, 10))}>
								{Array.from({ length: 12 }, (_, i) => (
									<option key={i + 1} value={i + 1}>
										{i + 1}
									</option>
								))}
							</select>
						</label>
						<label>
							Wybierz rok:
							<select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value, 10))}>
								{Array.from({ length: 5 }, (_, i) => (
									<option key={i} value={new Date().getFullYear() - i}>
										{new Date().getFullYear() - i}
									</option>
								))}
							</select>
						</label>
					</div>
					<div className='tableCycle'>
						<table>
							<thead>
								<tr>
									<th>Data</th>
									<th>Nazwa</th>
									<th>Kwota</th>
								</tr>
							</thead>
							<tbody>
								{filteredCyclicExpenses.map(expense => (
									<tr key={expense.id}>
										<td>{expense.date}</td>
										<td>{expense.name}</td>
										<td>{expense.amount} zł</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/*Wykres kołowy wydatków*/}

				<div style={{ width: '60%', height: '100%', display: 'flex', justifyContent: 'center' }}>
					<ExpensesBarChart />
				</div>
			</div>
		</div>
	);
};

export default Budget;
