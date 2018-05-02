
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import { makeMainRoutes } from './routes';


const routes = makeMainRoutes();


ReactDOM.render(routes, document.getElementById('root'));
registerServiceWorker();
