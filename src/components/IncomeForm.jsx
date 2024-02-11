import { useState } from "react";
import "../assets/styles/IncomeForm.scss";

const IncomeForm = ({addSavings}) => {
  const [income, setIncome] = useState('');
  const [savingsRate, setSavingsRate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addSavings(parseFloat(income), parseFloat(savingsRate));
    console.log(`Income: ${income}, Savings Rate: ${savingsRate}%`);
    // Reset form
    setIncome('');
    setSavingsRate('');
  };

  return (
    <form className="incomeForm" onSubmit={handleSubmit}>
      <h2>Przychody</h2>
      <input
        type="number"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        placeholder="Wprowadź przychód"
        required
      />
      <select value={savingsRate} onChange={(e) => setSavingsRate(e.target.value)} required>
        <option value="">Wybierz oszczędności</option>
        <option value="0">0%</option>
        <option value="3">3%</option>
        <option value="5">5%</option>
        <option value="10">10%</option>
      </select>
      <button type="submit">Dodaj</button>
    </form>
  );
};

export default IncomeForm;