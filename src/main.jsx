import ReactDOM from 'react-dom/client';
import App from './components/App';
import './assets/styles/index.scss';
import { AuthProvider} from '../src/components/AuthProvider';

//Tutaj będzie lOGIN
//walidacja loginu
//waidacja hasła
//walidacja maila

//router => login, aplikacja

ReactDOM.createRoot(document.getElementById('root')).render(
	<AuthProvider>
		<App />
	</AuthProvider>
);
