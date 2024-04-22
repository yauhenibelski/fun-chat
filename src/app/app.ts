import createElement from '@utils/create-element';
import { ApiService } from '@shared/api-service/api-service';
import SessionStorage from '@shared/session-storage/session-storage';
import { router } from '../router/router';
import Loader from './core/loader/loader';

class App {
    root = document.body;

    run(): void {
        const routOutput = createElement({ tag: 'div', style: 'router' });
        const loader = new Loader();

        this.root.append(routOutput, loader.getElement());

        SessionStorage.checkStorage();

        router();

        ApiService.socketRun();
    }
}

export default App;
