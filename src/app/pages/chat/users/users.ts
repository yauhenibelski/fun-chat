import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import { userSortValue$ } from '@shared/observables';
import style from './users.module.scss';
import UsersList from './users-list/users-list';

@CustomSelector('Users')
class Users extends Component {
    protected elements = this.childrenElements();

    constructor() {
        super(style);

        this.createComponent();
    }

    protected createComponent(): void {
        const { search } = this.elements;
        const searchField = <HTMLInputElement>search.firstChild;

        userSortValue$.publish('');
        searchField.placeholder = 'Search...';
        searchField.oninput = () => userSortValue$.publish(searchField.value);

        this.appendElements();
    }

    protected childrenElements() {
        return {
            search: createElement({ tag: 'input', style: style.search }, true),
            userList: new UsersList().getElement(),
        };
    }

    protected appendElements(): void {
        this.contentWrap.append(...Object.values(this.elements));
    }
}

export default Users;
