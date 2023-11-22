export const delay = (conditionCallBack: () => boolean): Promise<void> => {
    return new Promise<void>(resolve => {
        const interval = setInterval(() => {
            if (conditionCallBack()) {
                resolve();
                clearInterval(interval);
            }
        });
    });
};
