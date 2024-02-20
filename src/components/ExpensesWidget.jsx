import '../assets/styles/ExpensesWidget.scss';

const ExpenseWidget = ({ expenses }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // Miesiące są indeksowane od 0

  // Funkcja do filtrowania wydatków z bieżącego miesiąca
  const filterCurrentMonthExpenses = (expenses) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === currentYear && expenseDate.getMonth() === currentMonth;
    });
  };

  // Funkcja do obliczenia sumy wydatków
  const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  // Funkcja do pobrania trzech ostatnich wydatków
  const getLastExpenses = (expenses) => {
    return expenses.slice(-5).reverse();
  };

  const currentMonthExpenses = filterCurrentMonthExpenses(expenses);
  const totalExpenses = calculateTotalExpenses(currentMonthExpenses);
  const lastThreeExpenses = getLastExpenses(currentMonthExpenses);
  
  return (
    <div className='expenseWidget'>
      <h2>Wydatki (bieżący miesiąc)</h2>
      <p>{totalExpenses.toFixed(2)} zł</p> {/* Dodano toFixed(2) dla formatowania */}
      <h3>Ostatnie wydatki:</h3>
      <ul>
        {lastThreeExpenses.map((expense) => (
          <li key={expense.id}>{`${expense.date} - ${expense.name} - ${expense.amount.toFixed(2)} zł`}</li> // Dodano toFixed(2)
        ))}
      </ul>
    </div>
  );
};

export default ExpenseWidget;
