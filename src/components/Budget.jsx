import { useState } from 'react';
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

	const capitalizeFirstLetter = string => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

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

	const handleSubmit = e => {
		e.preventDefault();
		const newName = capitalizeFirstLetter(name);
		const newExpense = { date, name: newName, category, amount: parseFloat(amount), isRecurring };
		setExpenses([...expenses, newExpense]);
		// Reset form
		setDate(new Date().toISOString().split('T')[0]);
		setName('');
		setCategory(categories[0]);
		setAmount('');
		setIsRecurring(false);
	};

	const getSortDirectionIndicator = key => {
		if (sortConfig.key !== key) {
			return;
		}
		return sortConfig.direction === 'ascending' ? '↓' : '↑';
	};

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

	const { uniqueMonths, monthlySums } = prepareDataForTable(expenses);

	return (
		<div className='budget'>
			<div style={{ width: '100%', display: 'flex' }}>
				<div style={{width: '50%'}}>
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
				<div style={{width: '50%'}}>
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
				<table>
					<thead>
						<tr>
							<th onClick={() => sortExpenses('date')}>Data {getSortDirectionIndicator('date')}</th>
							<th onClick={() => sortExpenses('name')}>Nazwa wydatku {getSortDirectionIndicator('name')}</th>
							<th onClick={() => sortExpenses('category')}>Kategoria {getSortDirectionIndicator('category')}</th>
							<th onClick={() => sortExpenses('amount')}>Kwota {getSortDirectionIndicator('amount')}</th>
							<th onClick={() => sortExpenses('isRecurring')}>Cykliczny {getSortDirectionIndicator('isRecurring')}</th>
						</tr>
					</thead>
					<tbody>
						{expenses.map((expense, index) => (
							<tr key={index}>
								<td>{expense.date}</td>
								<td>{expense.name}</td>
								<td>{expense.category}</td>
								<td>{`${expense.amount} zł`}</td>
								<td>{expense.isRecurring ? 'Tak' : 'Nie'}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div></div>
		</div>
	);
};

export default Budget;
