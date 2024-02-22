import '../assets/styles/Instruction.scss';

const Instruction = () => {
	return (
		<>
			<div className='instructions'>
                <h1 className='titleInstruction'>O aplikacji</h1>
				<div className='section sectionStart'>
					<h2>Sekcja Start:</h2>
					<div className='point'>
						<p>
							<strong>1. Przychody w bieżącym miesiącu:</strong> Ta karta pokazuje całkowity przychód użytkownika
							zgłoszony na bieżący miesiąc. Użytkownicy mogą wprowadzić swój przychód w pole tekstowe, a następnie
							wybrać procent przychodów, który ma być przeznaczony na oszczędności. Przycisk &quot;Dodaj&quot; pozwala
							zatwierdzić wprowadzone dane.
						</p>
					</div>
					<div className='point'>
						<p>
							<strong>2. Pozostały przychód:</strong> Wykres kołowy prezentuje, jak przychód został podzielony. Wskazuje
							on na ilość środków pozostałych po odjęciu wydatków i zaalokowaniu części przychodu na oszczędności.
						</p>
					</div>
					<div className='point'>
						<p>
							<strong>3. Wydatki (bieżący miesiąc):</strong> W tej karcie wyświetlana jest suma wydatków użytkownika w
							bieżącym miesiącu. Poniżej znajduje się lista pięciu ostatnich operacji z datą i kwotą, co pozwala na
							szybki podgląd ostatniej aktywności finansowej.
						</p>
					</div>
					<div className='point'>
						<p>
							<strong>4. Oszczędności:</strong> Karta pokazuje łączną kwotę oszczędności zgromadzonych przez
							użytkownika. To prosty, ale ważny widżet, który pozwala użytkownikowi na bieżąco śledzić stan swoich
							oszczędności.
						</p>
					</div>
				</div>

				<div className='section sectionBudget'>
					<h2>Sekcja Budżet:</h2>
					<div className='point'>
						<p>
							<strong>1. Dodaj wydatek:</strong> Ten formularz pozwala użytkownikom na dodawanie nowych wydatków, określanie ich
							kategorii oraz daty. Istnieje też opcja oznaczenia wydatku jako cyklicznego, co jest ważne dla planowania
							budżetu na przyszłe miesiące.
						</p>
					</div>
					<div className='point'>
						<p>
							<strong>2. Wszystkie wydatki:</strong> Tabela, która zawiera pełną listę wydatków użytkownika. Wydatki
							można sortować według różnych kryteriów, co ułatwia zarządzanie i analizę wydatków.
						</p>
					</div>
					<div className='point'>
						<p>
							<strong>3. Planowane wydatki:</strong> Tabela przedstawia wydatki, które zostały zaplanowane na przyszłe
							miesiące. Użytkownicy mogą tu śledzić swoje finansowe zobowiązania i planować z wyprzedzeniem.
						</p>
					</div>
					<div className='point'>
						<p>
							<strong>4. Wykres porównawczy:</strong> Prezentuje porównanie przychodów do wydatków w danym miesiącu
							według kategorii, co pozwala użytkownikowi na szybką wizualną ocenę, w które kategorie najwięcej środków
							jest alokowanych.
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default Instruction;
