import { useEffect, useState } from 'react';
import { fetchHeroImages, DEFAULT_HERO_IMAGES } from '../api/pageSettings.js';

let cachePromise = null;

export const useHeroImages = () => {
    const [settings, setSettings] = useState(DEFAULT_HERO_IMAGES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!cachePromise) {
            cachePromise = fetchHeroImages();
        }
        let active = true;
        cachePromise.then((data) => {
            if (!active) return;
            setSettings(data && data.home_hero ? data : DEFAULT_HERO_IMAGES);
            setLoading(false);
        });
        return () => {
            active = false;
        };
    }, []);

    return { settings, loading };
};

export const invalidateHeroImages = () => {
    cachePromise = null;
};