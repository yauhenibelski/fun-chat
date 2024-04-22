import createElement from '@utils/create-element';
import { ApiService } from '@shared/api-service/api-service';
import SessionStorage from '@shared/session-storage/session-storage';
import { router } from '../router/router';

class App {
    root = document.body;

    run() {
        const routOutput = createElement({ tag: 'div', style: 'router' });
        this.root.append(routOutput);

        SessionStorage.checkStorage();

        router();

        ApiService.socketRun();
    }
}

export default App;
