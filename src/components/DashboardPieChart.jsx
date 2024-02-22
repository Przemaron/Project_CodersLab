import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { supabase } from '../API/supabaseClient';

const DashboardPieChart = () => {
	const [chartData, setChartData] = useState({
		labels: ['Wydatki', 'Pozostały przychód'],
		datasets: [
			{
				data: [],
				backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'],
				borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
				borderWidth: 3,
			},
		],
	});
	// Pobierz wydatki i przychody z Supabase
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
				.select('remaining')
				.gte('date', new Date(currentYear, currentMonth, 1).toISOString())
				.lte('date', new Date(currentYear, currentMonth + 1, 0).toISOString());

			// Obliczanie łącznej sumy przychodów
			const totalIncome = incomesData.reduce((acc, curr) => acc + curr.remaining, 0);

			// Obliczanie łącznej sumy wydatków
			const totalExpenses = expensesData.reduce((acc, curr) => acc + curr.amount, 0);

			// Obliczanie pozostałego przychodu
			const remainingIncome = Math.max(totalIncome - totalExpenses, 0);

			// Ustawienie danych dla wykresu
			setChartData(prevState => ({
				...prevState,
				datasets: [
					{
						label: 'Wydatki',
						...prevState.datasets[0],
						data: [totalExpenses, remainingIncome],
					},
				],
			}));
		};

		fetchData();
	}, []);

	// Opcje wykresu
	const options = {
		responsive: true,
		maintainAspectRatio: false,
		apsectRatio: 1,
		
		plugins: {
			legend: {
				display: true,
				position: 'top',
				labels: {
					font: {
						size: 16,
						family: 'Poppins, sans-serif',
					},
					color: '#888',
				},
			},
			title: {
				display: true,
				text: `Pozostały przychód: ${chartData.datasets[0].data[1]} zł`,
				font: {
					size: 34,
					family: 'Poppins, sans-serif',
				},
				color: '#888',
				padding: {
					bottom: 10,
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
			},
		},
	};

	return <Pie data={chartData} options={options} />;
};

export default DashboardPieChart;
