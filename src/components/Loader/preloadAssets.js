export const preloadImages = (urls, { onProgress } = {}) => {
    const list = [...new Set(urls.filter(Boolean))];
    if (list.length === 0) {
        onProgress?.(1);
        return Promise.resolve();
    }

    let loaded = 0;
    return Promise.all(
        list.map(
            (url) =>
                new Promise((resolve) => {
                    const img = new Image();
                    const done = () => {
                        loaded += 1;
                        onProgress?.(loaded / list.length);
                        resolve();
                    };
                    img.onload = done;
                    img.onerror = done;
                    img.src = url;
                })
        )
    );
};

export const collectImageUrls = () => {
    const urls = [];
    const push = (u) => {
        if (u && !u.startsWith('data:')) urls.push(u);
    };

    document.querySelectorAll('img').forEach((el) => {
        push(el.currentSrc || el.src);
    });

    document.querySelectorAll('[style]').forEach((el) => {
        const bg = el.style.backgroundImage || '';
        const match = bg.match(/url\((["']?)(.*?)\1\)/);
        if (match) push(match[2]);
    });

    return urls;
};