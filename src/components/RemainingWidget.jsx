import '../assets/styles/RemainingWidget.scss';

const RemainingWidget = ({ expenses, incomes }) => {
  // Pobierz bieżący miesiąc i rok
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filtruj przychody i wydatki dla bieżącego miesiąca
  const totalIncomes = incomes.reduce((acc, income) => {
    const incomeDate = new Date(income.date);
    if (incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear) {
      return acc + parseFloat(income.amount || 0);
    }
    return acc;
  }, 0);

  const totalExpenses = expenses.reduce((acc, expense) => {
    const expenseDate = new Date(expense.date);
    if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
      return acc + parseFloat(expense.amount || 0);
    }
    return acc;
  }, 0);

  // Obliczanie pozostałych środków
  const remaining = totalIncomes - totalExpenses;

  return (
    <div className='remainingWidget'>
      <h2>Zostało</h2>
      <p>{remaining.toFixed(2)} zł</p>
    </div>
  );
};

export default RemainingWidget;
