interface CreateElementProps<T> {
    tag: T;
    style?: string | string[];
    text?: string;
    html?: string;
}

const setStyle = (elem: HTMLElement, styles: string | string[]): void => {
    if (styles instanceof Array) {
        elem.classList.add(...styles.filter(style => style));
    }
    if (typeof styles === 'string') {
        elem.classList.add(styles);
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
