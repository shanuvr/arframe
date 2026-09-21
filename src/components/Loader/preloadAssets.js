export const preloadImages = (urls, { onProgress } = {}) => {
    const list = [...new Set(urls.filter(Boolean))];
    if (list.length === 0) {
        onProgress?.(1);
        return Promise.resolve();
    }

    let loaded = 0;
    const updateProgress = () => {
        loaded += 1;
        onProgress?.(loaded / list.length);
    };

    return Promise.all(
        list.map(
            (url) =>
                new Promise((resolve) => {
                    const img = new Image();
                    const done = () => {
                        updateProgress();
                        resolve();
                    };

                    img.onload = () => {
                        // Use img.decode() to unpack image into GPU memory before reveal
                        if (typeof img.decode === 'function') {
                            img.decode().then(done).catch(done);
                        } else {
                            done();
                        }
                    };
                    img.onerror = done;
                    img.src = url;
                })
        )
    );
};

export const collectImageUrls = () => {
    const urls = [];
    const push = (u) => {
        if (u && typeof u === 'string' && !u.startsWith('data:')) {
            urls.push(u.trim());
        }
    };

    // Collect standard img elements
    document.querySelectorAll('img').forEach((el) => {
        push(el.currentSrc || el.src || el.getAttribute('src'));
    });

    // Collect all background images across styled elements
    document.querySelectorAll('[style*="background"], section, div').forEach((el) => {
        const inlineBg = el.style?.backgroundImage || '';
        const computedBg = window.getComputedStyle ? window.getComputedStyle(el).backgroundImage : '';
        const bg = inlineBg || computedBg;
        if (bg && bg !== 'none') {
            const match = bg.match(/url\((["']?)(.*?)\1\)/);
            if (match && match[2]) {
                push(match[2]);
            }
        }
    });

    return urls;
};