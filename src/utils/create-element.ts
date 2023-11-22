/* eslint-disable no-redeclare */
interface CreateElementProps<T> {
    tag: T;
    style?: string | string[];
    text?: string;
    html?: string;
}

const setStyle = (elem: HTMLElement, style: string | string[]): void => {
    if (style instanceof Array) {
        elem.classList.add(...style);
    }
    if (typeof style === 'string') {
        elem.classList.add(style);
    }
};

function createElement<T extends keyof HTMLElementTagNameMap>(options: CreateElementProps<T>): HTMLElementTagNameMap[T];
function createElement<T>(options: CreateElementProps<T>, needWrap: boolean): HTMLDivElement;

function createElement<T extends keyof HTMLElementTagNameMap>(
    { tag, style, text, html }: CreateElementProps<T>,
    needWrap?: boolean,
) {
    const elem = document.createElement(tag);
    const elemWrap = document.createElement('div');

    if (text) elem.innerText = text;
    if (html) elem.innerHTML = html;

    if (style && !needWrap) setStyle(elem, style);

    if (needWrap) {
        if (style) setStyle(elemWrap, style);
        elemWrap.append(elem);
    }

    return needWrap ? elemWrap : elem;
}

export default createElement;
