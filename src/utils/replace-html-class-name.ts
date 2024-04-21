export const replaceClassStyleNameToModuleClassName = (
    htmlString: string,
    scssModule: { [key: string]: string },
): string => {
    let html = htmlString;

    Object.entries(scssModule).forEach(([styleName, styleModuleName]) => {
        html = html.replaceAll(`{{${styleName}}}`, styleModuleName);
    });
    return html;
};
