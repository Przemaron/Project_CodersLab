import '../assets/styles/RemainingWidget.scss';

const RemainingWidget = () => {
    // Przykładowe dane, rzeczywista logika powinna uwzględniać przychody minus wydatki
    const remaining = 800; // Przykładowa wartość
  
    return (
      <div className='remainingWidget'>
        <h2>Zostało</h2>
        <p>{remaining} zł</p>
      </div>
    );
  };
  
  export default RemainingWidget;