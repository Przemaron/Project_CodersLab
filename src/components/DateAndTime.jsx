import  { useState, useEffect } from 'react';

const DateTimeDisplay = () => {
  // Ustawienie stanu z aktualną datą i czasem
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Ustawienie interwału, który aktualizuje datę i czas co sekundę
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Czyszczenie interwału przy demontażu komponentu
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className='asideDateAndTime' style={{textAlign: 'center', marginBottom: '1rem'}}>
      <p style={{fontSize: '1.2rem'}}>{currentDateTime.toLocaleDateString()}</p>
      <p style={{fontSize: '2rem'}}>{currentDateTime.toLocaleTimeString()}</p>
    </div>
  );
};

export default DateTimeDisplay;
