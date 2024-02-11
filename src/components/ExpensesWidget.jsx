import '../assets/styles/ExpensesWidget.scss';

const ExpensesWidget = () => {
  // Przykładowe dane, w prawdziwej aplikacji dane te mogłyby pochodzić z API lub stanu globalnego
  const expenses = [
    { id: 1, name: 'Zakupy', amount: 100 },
    { id: 2, name: 'Rachunki', amount: 200 },
  ];

  return (
    <div className="expenseWidget">
      <h2>Wydatki</h2>
      <ul>
        {expenses.map(expense => (
          <li key={expense.id}>{expense.name}: {expense.amount} zł</li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesWidget;