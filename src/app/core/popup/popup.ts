import createElement from '@utils/create-element';
import style from './popup.module.scss';

export const Popup = {
    contentWrap: createElement({ tag: 'div', style: style.popup }),

    show(content: HTMLElement | string): void {
        this.createPopup(content);
        document.body.append(this.contentWrap);
    },

    close(): void {
        this.contentWrap.style.opacity = '0';
        this.contentWrap.innerHTML = '';

        document.body.style.overflow = '';

        setTimeout(() => {
            this.contentWrap.remove();
        }, 200);
    },

    createPopup(value: HTMLElement | string): void {
        const currentContent = <HTMLElement | null>this.contentWrap.firstElementChild;
        if (currentContent) currentContent.remove();

        this.contentWrap.style.opacity = '0';
        document.body.style.overflow = 'hidden';

        const content = value instanceof HTMLElement ? value : createElement({ tag: 'h2', text: value });

        this.contentWrap.append(content);
        content.onclick = event => event.stopPropagation();

        this.contentWrap.onclick = () => this.close();

        setTimeout(() => {
            this.contentWrap.style.opacity = '1';
        }, 100);
    },
};
