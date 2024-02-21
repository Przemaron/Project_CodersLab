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
		return `hsla(${hue % 360}, 70%, 50%, 0.5)`;
	};

	// Funkcja do rozjaśniania kolorów HSLA
	const adjustAlphaHSLA = (hsla, alphaMultiplier) => {
		const parts = hsla.match(/hsla\((\d+), (\d+)%, (\d+)%, (\d+(\.\d+)?)\)/);
		if (!parts) return hsla; // Zwraca oryginalny kolor, jeśli nie pasuje do wzorca

		const hue = parseInt(parts[1], 10);
		const saturation = parseInt(parts[2], 10);
		const lightness = parseInt(parts[3], 10);
		let alpha = parseFloat(parts[4]);

		alpha = Math.min(alpha + alphaMultiplier, 1); // Nie przekraczaj 100%

		return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
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
			const borderColor = expenseColors.map(color => adjustAlphaHSLA(color, 20));

			// Ustawienie danych dla wykresu
			setChartData({
				labels: ['Przychody', ...categories],
				datasets: [
					// Dataset dla przychodów
					{
						data: [totalIncome, ...expensesSums],
						backgroundColor: [incomeColor.backgroundColor, ...expenseColors],
						borderColor: [incomeColor.borderColor, ...borderColor],
						borderWidth: 2,
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
				display: true,
				title: {
					display: true,
					text: 'Kwota (PLN)',
					font: {
						size: 18,
						family: 'Poppins, sans-serif',
					},
					color: '#888',
				},
				beginAtZero: true,
				type: 'logarithmic',
				min: 50,
				ticks: {
					stepSize: 50,
				},
			},

			x: {
				display: true,
				title: {
					display: true,
					text: 'Kategoria',
					font: {
						size: 18,
						family: 'Poppins, sans-serif',
					},
					color: '#888',
				},
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: true,
				text: (`Przychody i wydatki według kategorii`),
				font: {
					size: 34,
					family: 'Poppins, sans-serif',
				},
				color: '#888',
				padding: {
					bottom: 30,
				},
			},
			tooltip: {
				enabled: true,
				padding: 10,
				backgroundColor: 'rgba(0, 0, 0, 0.7)',
				titleColor: 'rgba(255, 255, 255, 1)',
				bodyColor: 'rgba(255, 255, 255, 1)',
				titleFont: {
					size: 16,
					family: 'Poppins, sans-serif',
				},
				bodyFont: {
					size: 14,
					family: 'Poppins, sans-serif',
				},
				callbacks: {
					label: category => {
						const label = category.dataset.label || '';
						const value = category.parsed.y || 0;
						return `${label}: ${value.toFixed(2)} PLN`;
					},
				},
			},
		},
		layout: {
			labels: {
				font: {
					size: 16,
					family: 'Poppins, sans-serif',
				},
				color: '#888',
			},
			padding: {
				top: 30,
				left: 30,
			},
		},
	};

	return <Bar data={chartData} options={options} />;
};

export default ExpensesBarChart;
