import createElement from '@utils/create-element';
import { router } from '../router/router';

class App {
    root = document.body;
    socket = new WebSocket('ws://localhost:4000/');

    run() {
        const routOutput = createElement({ tag: 'main', style: 'router' });

        this.root.append(routOutput);

        router();
    }
}

export default App;
