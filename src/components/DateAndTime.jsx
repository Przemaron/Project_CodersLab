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

  // Opcje lokalizacji dla języka polskiego
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  
  // Formatowanie daty i czasu zgodnie z lokalizacją PL
  const formattedDate = currentDateTime.toLocaleDateString('pl-PL', options);
  const formattedTime = currentDateTime.toLocaleTimeString('pl-PL');

  return (
    <div className='asideDateAndTime' style={{textAlign: 'center', marginBottom: '1rem'}}>
      <p style={{fontSize: '1.2rem'}}>{formattedDate}</p>
      <p style={{fontSize: '2rem'}}>{formattedTime}</p>
    </div>
  );
};

export default DateTimeDisplay;
