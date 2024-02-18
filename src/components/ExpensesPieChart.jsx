import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { supabase } from '../API/supabaseClient'; // Zaimportuj klienta Supabase

const ExpensesPieChart = () => {
	const [totalExpenses, setTotalExpenses] = useState(0);
	const [remainingIncome, setRemainingIncome] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			const currentYear = new Date().getFullYear();
			const currentMonth = new Date().getMonth(); // Pamiętaj, getMonth() zwraca miesiące od 0 do 11

			// Pobieranie wydatków
			const { data: expensesData } = await supabase
				.from('expensesTable')
				.select('*')
				.gte('date', new Date(currentYear, currentMonth, 1).toISOString())
				.lte('date', new Date(currentYear, currentMonth + 1, 0).toISOString());

			// Pobieranie przychodów
			const { data: incomesData } = await supabase
				.from('incomeTable')
				.select('*')
				.gte('date', new Date(currentYear, currentMonth, 1).toISOString())
				.lte('date', new Date(currentYear, currentMonth + 1, 0).toISOString());

			// Obliczanie sumy wydatków i przychodów
			const expensesSum = expensesData?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
			const incomesSum = incomesData?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

			setTotalExpenses(expensesSum);
			setRemainingIncome(incomesSum - expensesSum);
		};

		fetchData();
	}, []);

	// Przygotowanie danych do wykresu
	const data = {
		labels: ['Wydatki', 'Pozostały przychód'],
		datasets: [
			{
				data: [totalExpenses, Math.max(remainingIncome, 0)],
				backgroundColor: ['#FF6384', '#36A2EB'],
				hoverBackgroundColor: ['#FF6384', '#36A2EB'],
			},
		],
	};

	// Opcje wykresu
	const options = {
		plugins: {
			legend: {
				display: true,
				position: 'top',
				labels: {
					font: {
						size: 16,
					},
				},
			},
			title: {
				display: true,
				text: 'Porównanie wydatków do przychodu',
				font: {
					size: 20,
				},
			},
		},
	};

	return <Pie data={data} options={options} />;
};

export default ExpensesPieChart;
