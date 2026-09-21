import api from './axios.js';

export const HERO_IMAGES_ENDPOINT = '/api/hero-images';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-fbba380656084edda4d915551564adce.r2.dev/';

export const buildImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http') || img.startsWith('/')) return img;
    return `${IMAGE_BASE_URL}${img}`;
};

export const DEFAULT_HERO_IMAGES = {
    home_hero: {
        images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1920&q=80',
        ],
    },
    projects_hero: { image: '/pagehero/projectshero.jpg' },
    about_hero: { image: '/pagehero/aboutushero.jpg' },
    contact_hero: { image: '/pagehero/aboutushero.jpg' },
    design_hero: {
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    },
};

export const fetchHeroImages = () =>
    api
        .get(HERO_IMAGES_ENDPOINT)
        .then((res) => (res.data && (res.data.data || res.data)) || DEFAULT_HERO_IMAGES)
        .catch(() => DEFAULT_HERO_IMAGES);