import '../assets/styles/SavingsWidget.scss';

const SavingsWidget = ({savings}) => {
    
    return (
      <div className="savingWidget">
        <h2>Oszczędności</h2>
        <p>{savings.toFixed(2)} zł</p>
      </div>
    );
  };
  
  export default SavingsWidget;