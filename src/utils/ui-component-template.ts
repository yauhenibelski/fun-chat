import createElement from '@utils/create-element';

abstract class Component extends HTMLElement {
    protected contentWrap: HTMLElement;
    protected elements: { [key: string]: HTMLElement } = {};

    constructor(style: { [key: string]: string }) {
        super();
        this.className = style.host;
        this.contentWrap = createElement({
            tag: 'div',
            style: style['content-wrap'],
        });
        this.append(this.contentWrap);
    }

    protected childrenElements(): { [key: string]: HTMLElement } {
        // childrenElements
        return <{ [key: string]: HTMLElement }>{};
    }

    protected appendElements(): void {
        // appendElements
    }

    protected createComponent(): void {
        // create component
    }

    protected connectedCallback(): void {
        // element added to page
    }

    protected disconnectedCallback(): void {
        //  element removed from page
    }

    protected adoptedCallback(): void {
        // element moved to new page
    }

    // attributeChangedCallback(name, oldValue, newValue): void {
    // Attribute ${name} has changed.
    // }

    public getElement(): HTMLElement {
        return this;
    }

    public render(): void {
        this.contentWrap.innerHTML = '';
        this.elements = this.childrenElements();
        this.createComponent();
    }
}
export default Component;
