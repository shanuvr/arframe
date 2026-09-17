import { useEffect, useState } from 'react';
import { fetchHeroImages, buildImageUrl } from '../../api/pageSettings.js';
import { preloadImages, collectImageUrls } from './preloadAssets.js';
import './Preloader.css';

const MIN_DURATION = 3500;
const MAX_DURATION = 10000;
const FADE_MS = 650;
const TIME_WEIGHT = 55;

const getMessage = (progress) => {
    if (progress < 25) return 'Preparing your experience…';
    if (progress < 55) return 'Curating our finest projects…';
    if (progress < 85) return 'Loading imagery for a seamless scroll…';
    if (progress < 100) return 'Almost there…';
    return 'Ready — welcome in';
};

const buildCriticalList = (settings) => {
    const list = [];
    const push = (u) => {
        const url = buildImageUrl(u);
        if (url) list.push(url);
    };
    (settings?.home_hero?.images || []).forEach(push);
    push(settings?.projects_hero?.image);
    push(settings?.about_hero?.image);
    push(settings?.contact_hero?.image);
    push(settings?.design_hero?.image);
    push('/beyondexpectations.jpeg');
    return list;
};

const waitForHomeImages = (timeout = 3500) =>
    new Promise((resolve) => {
        const start = Date.now();
        const check = () => {
            if (document.querySelectorAll('#root img').length > 2 || Date.now() - start >= timeout) {
                resolve();
            } else {
                setTimeout(check, 120);
            }
        };
        check();
    });

const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const [fading, setFading] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        document.body.classList.add('preload-lock');
        let holdTimer;
        let finishTimer;
        let raf;
        let completed = false;
        let imageWeight = 0;
        let active = true;
        const releaseLock = () => document.body.classList.remove('preload-lock');

        const finish = () => {
            if (completed) return;
            completed = true;
            cancelAnimationFrame(raf);
            releaseLock();
            setProgress(100);
            setFading(true);
            finishTimer = setTimeout(() => setDone(true), FADE_MS);
        };

        const startTime = performance.now();
        const tick = (now) => {
            const elapsed = now - startTime;
            const timeFrac = Math.min(elapsed / MIN_DURATION, 1);
            const display = Math.round(Math.min((timeFrac * TIME_WEIGHT) + (imageWeight * (100 - TIME_WEIGHT)), 100));
            setProgress(display);

            const complete = (timeFrac >= 1 && imageWeight >= 1) || elapsed >= MAX_DURATION;
            if (complete) {
                holdTimer = setTimeout(finish, 400);
            } else {
                raf = requestAnimationFrame(tick);
            }
        };
        raf = requestAnimationFrame(tick);

        const startPreloading = async () => {
            const settings = await fetchHeroImages().catch(() => null);
            if (!active) return;
            await waitForHomeImages();
            if (!active) return;
            const critical = buildCriticalList(settings);
            const domUrls = collectImageUrls();
            preloadImages([...critical, ...domUrls], {
                onProgress: (p) => {
                    imageWeight = p;
                },
            });
        };

        startPreloading();

        return () => {
            active = false;
            document.body.classList.remove('preload-lock');
            cancelAnimationFrame(raf);
            clearTimeout(holdTimer);
            clearTimeout(finishTimer);
        };
    }, []);

    if (done) return null;

    return (
        <div className={`preloader ${fading ? 'preloader-fade-out' : ''}`} aria-hidden="true">
            <div className="preloader-glow"></div>
            <div className="preloader-lines preloader-lines-left"></div>
            <div className="preloader-lines preloader-lines-right"></div>

            <div className="preloader-inner">
                <div className="preloader-logo-holder">
                    <img src="/logo/logowhite.png" alt="Aframe Builders" className="preloader-logo" />
                    <div className="preloader-ring"></div>
                </div>

                <div className="preloader-brand">AFRAME BUILDERS</div>
                <div className="preloader-tagline">A Frame To Transcend Time</div>

                <div className="preloader-progress">
                    <div className="preloader-bar">
                        <div className="preloader-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="preloader-meta">
                        <span className="preloader-percent">{progress}%</span>
                        <span className="preloader-message">{getMessage(progress)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;