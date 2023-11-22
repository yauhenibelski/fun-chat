import { getCustomName } from '@utils/get-custom-component-name';

function CustomSelector(name: string): (constructor: Function) => void {
    return function (fnConstructor: Function) {
        const constructor = fnConstructor as unknown as CustomElementConstructor;

        customElements.define(getCustomName(name), constructor);
    };
}

export default CustomSelector;
