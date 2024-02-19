import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { supabase } from '../API/supabaseClient';

const ExpensesBarChart = () => {
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [],
	});

	// Kolor dla przychodów
	const incomeColor = {
		backgroundColor: 'rgba(54, 162, 235, 0.5)',
		borderColor: 'rgba(54, 162, 235, 1)',
	};

	// Funkcja do generowania kolorów dla wydatków
	const generateExpenseColor = index => {
		const hue = index * 137; // Złota proporcja dla różnorodności kolorów
		return `hsla(${hue % 360}, 70%, 70%, 0.5)`;
	};

	useEffect(() => {
		const fetchData = async () => {
			const currentYear = new Date().getFullYear();
			const currentMonth = new Date().getMonth();

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

			// Obliczanie łącznej sumy przychodów
			const totalIncome = incomesData.reduce((acc, curr) => acc + curr.amount, 0);

			// Grupowanie wydatków po kategorii
			const expensesByCategory = expensesData.reduce((acc, curr) => {
				const { category, amount } = curr;
				acc[category] = (acc[category] || 0) + amount;
				return acc;
			}, {});

			const categories = Object.keys(expensesByCategory);
			const expensesSums = Object.values(expensesByCategory);
			const expenseColors = categories.map((_, index) => generateExpenseColor(index));

			// Ustawienie danych dla wykresu
			setChartData({
				labels: categories,
				datasets: [
					// Dataset dla przychodów
					{
						label: 'Przychody',
						data: Array(categories.length).fill(totalIncome),
						backgroundColor: incomeColor.backgroundColor,
						borderColor: incomeColor.borderColor,
						borderWidth: 1,
					},
					// Dataset dla wydatków
					{
						label: 'Wydatki',
						data: expensesSums,
						backgroundColor: expenseColors,
						borderColor: expenseColors,
						borderWidth: 1,
					},
				],
			});
		};

		fetchData();
	}, []);

	// Opcje wykresu
	const options = {
		scales: {
			y: {
				beginAtZero: true,
			},
		},
		plugins: {
			legend: {
				display: true,
				position: 'top',
			},
			title: {
				display: true,
				text: 'Przychody i wydatki według kategorii',
				font: {
					size: 34,
					family: 'Poppins, sans-serif',
				},
				color: '#333',
			},
		},
		layout: {
			padding: {               
                top: 30,
                left: 30               
            },
		},
	};

	return <Bar data={chartData} options={options} />;
};

export default ExpensesBarChart;
