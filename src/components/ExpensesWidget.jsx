import '../assets/styles/ExpensesWidget.scss';

const ExpenseWidget = ({ expenses }) => {
  // Funkcja do obliczenia sumy wydatków
  const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  // Funkcja do pobrania trzech ostatnich wydatków
  const getLastThreeExpenses = (expenses) => {
    return expenses.slice(-3).reverse();
  };

  const totalExpenses = calculateTotalExpenses(expenses);
  const lastThreeExpenses = getLastThreeExpenses(expenses);
  console.log(expenses); // Czy widzisz tutaj wydatki?
  return (
    <div>
      <h2>Podsumowanie wydatków</h2>
      <p>Suma wszystkich wydatków: {totalExpenses} zł</p>
      <h3>Ostatnie wydatki:</h3>
      <ul>
        {lastThreeExpenses.map((expense, index) => (
          <li key={index}>{`${expense.date} - ${expense.name} - ${expense.amount} zł`}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseWidget;