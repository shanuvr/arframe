import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../api/axios.js';
import {
    HERO_IMAGES_ENDPOINT,
    DEFAULT_HERO_IMAGES,
    buildImageUrl,
} from '../../api/pageSettings.js';
import { invalidateHeroImages } from '../../hooks/useHeroImages.js';
import './AdminHeroImages.css';

let uidCounter = 0;
const makeUid = () => `img-${Date.now()}-${uidCounter++}`;

const mapHome = (list) =>
    (list || []).map((item) => {
        if (typeof item === 'object' && item !== null) {
            const raw = item.image_url || item.src || '';
            return {
                uid: makeUid(),
                id: item.id || null,
                kind: 'existing',
                src: raw,
                preview: buildImageUrl(raw),
                isFirst: Boolean(item.is_first),
                file: null,
            };
        }
        const raw = item || '';
        return {
            uid: makeUid(),
            id: null,
            kind: 'existing',
            src: raw,
            preview: buildImageUrl(raw),
            isFirst: false,
            file: null,
        };
    });

const singleFrom = (src) => {
    const value = src || '';
    return { key: value, src: buildImageUrl(value), removed: false, newFile: null, newPreview: '' };
};

const appendSingle = (fd, name, hero) => {
    if (hero.newFile) {
        fd.append(`${name}_image`, hero.newFile);
    } else if (hero.key && !hero.removed) {
        fd.append(`${name}_keep`, hero.key);
    }
};

const SingleHeroCard = ({ icon, title, desc, hero, onFileChange, onRemove, onRestore }) => {
    const fileRef = useRef(null);
    const shown = hero.newPreview || hero.src;
    const hasImage = !hero.removed && shown;

    return (
        <div className="form-card-container section-card">
            <div className="hero-section-heading">
                <div>
                    <h4>
                        <i className={`fa-solid ${icon} hero-h4-icon`}></i> {title}
                    </h4>
                    <p>{desc}</p>
                </div>
                <span className={`hero-section-badge ${hasImage ? 'set' : 'empty'}`}>
                    {hasImage ? 'Image Set' : 'No Image'}
                </span>
            </div>

            <div className="single-hero-body">
                {hasImage ? (
                    <div className="single-hero-preview">
                        <img src={shown} alt={title} />
                    </div>
                ) : (
                    <div className="single-hero-empty">
                        <i className="fa-solid fa-image"></i>
                        <p>No hero image selected for this page.</p>
                        <span>Add one below or restore the default.</span>
                    </div>
                )}

                <div className="single-hero-info">
                    <p className="single-hero-note">
                        Recommended size: 1920 × 900px. The image is stored in R2 (Heroimages) and displayed as a full-width page banner.
                    </p>
                    <div className="single-hero-actions">
                        <button type="button" className="hero-btn primary" onClick={() => fileRef.current?.click()}>
                            <i className="fa-solid fa-upload"></i> {hero.removed ? 'Choose Image' : 'Change Image'}
                        </button>
                        {hasImage && (
                            <button type="button" className="hero-btn danger" onClick={onRemove}>
                                <i className="fa-solid fa-trash-can"></i> Remove
                            </button>
                        )}
                        {hero.removed && (
                            <button type="button" className="hero-btn ghost" onClick={onRestore}>
                                <i className="fa-solid fa-rotate-left"></i> Restore Default
                            </button>
                        )}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onFileChange(file);
                                e.target.value = '';
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminHeroImages = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const [homeItems, setHomeItems] = useState([]);
    const [projects, setProjects] = useState(singleFrom(''));
    const [about, setAbout] = useState(singleFrom(''));
    const [contact, setContact] = useState(singleFrom(''));

    const homeFileInput = useRef(null);

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            navigate('/admin', { replace: true });
            return;
        }

        let active = true;
        (async () => {
            let raw = {};
            try {
                const res = await api.get(HERO_IMAGES_ENDPOINT);
                raw = (res.data && (res.data.data || res.data)) || {};
            } catch (err) {
                console.error('Failed to load hero images from D1:', err);
            }
            if (!active) return;

            const homeList =
                Array.isArray(raw.home_hero?.items) && raw.home_hero.items.length
                    ? raw.home_hero.items
                    : Array.isArray(raw.home_hero?.images) && raw.home_hero.images.length
                    ? raw.home_hero.images
                    : DEFAULT_HERO_IMAGES.home_hero.images;

            setHomeItems(mapHome(homeList));
            setProjects(singleFrom(raw.projects_hero?.image));
            setAbout(singleFrom(raw.about_hero?.image));
            setContact(singleFrom(raw.contact_hero?.image));
            setLoading(false);
        })();

        return () => {
            active = false;
        };
    }, [navigate]);

    const addHomeFiles = (files) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHomeItems((prev) => [
                    ...prev,
                    {
                        uid: makeUid(),
                        id: null,
                        kind: 'new',
                        src: reader.result,
                        preview: reader.result,
                        file,
                        isFirst: false,
                    },
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const moveItem = (index, dir) => {
        setHomeItems((prev) => {
            const target = index + dir;
            if (target < 0 || target >= prev.length) return prev;
            const next = [...prev];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    };

    const setAsFirst = (index) => {
        setHomeItems((prev) => {
            if (index <= 0 || index >= prev.length) return prev;
            const next = [...prev];
            const [target] = next.splice(index, 1);
            next.unshift(target);
            return next;
        });
    };

    const handleSingleFile = (setter) => (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setter((prev) => ({ ...prev, newFile: file, newPreview: reader.result, removed: false }));
        };
        reader.readAsDataURL(file);
    };

    const restoreSingle = (name, setter) => {
        const fallback = DEFAULT_HERO_IMAGES[name]?.image || '';
        setter({ key: fallback, src: buildImageUrl(fallback), removed: false, newFile: null, newPreview: '' });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatus({ type: '', message: '' });

        try {
            const fd = new FormData();

            fd.append('home_total_items', String(homeItems.length));
            homeItems.forEach((item, index) => {
                if (item.kind === 'new' && item.file) {
                    fd.append(`home_item_${index}_type`, 'new');
                    fd.append(`home_item_${index}_file`, item.file);
                } else {
                    fd.append(`home_item_${index}_type`, 'existing');
                    fd.append(`home_item_${index}_url`, item.src);
                }
            });

            homeItems.forEach((item) => {
                if (item.kind === 'existing') {
                    fd.append('home_keep_images', item.src);
                } else if (item.file) {
                    fd.append('home_new_images', item.file);
                }
            });

            appendSingle(fd, 'projects', projects);
            appendSingle(fd, 'about', about);
            appendSingle(fd, 'contact', contact);

            await api.put(HERO_IMAGES_ENDPOINT, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            invalidateHeroImages();
            setStatus({
                type: 'success',
                message: 'Hero images saved successfully',
            });
        } catch (err) {
            console.error('Failed to save hero images:', err);
            setStatus({
                type: 'error',
                message:
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    'Could not save changes to Cloudflare D1 / R2.',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout title="Manage Hero Images">
            <div className="admin-hero-images-page fade-in-up">
                <div className="page-action-header">
                    <div>
                        <h3>Site Hero Images</h3>
                        <p className="page-subtext">
                            Choose the banner images shown on the homepage carousel and each page hero section.
                        </p>
                    </div>
                    <button className="add-project-btn" onClick={handleSave} disabled={saving || loading}>
                        {saving ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-floppy-disk" style={{ marginRight: '8px' }}></i>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>

                {status.message && (
                    <div className={`save-alert ${status.type}`}>
                        <i className={`fa-solid ${status.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
                        {status.message}
                    </div>
                )}

                {loading ? (
                    <div className="hero-loading">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <p>Loading hero images...</p>
                    </div>
                ) : (
                    <>
                        <div className="form-card-container section-card">
                            <div className="hero-section-heading">
                                <div>
                                    <h4>
                                        <i className="fa-solid fa-house-chimney hero-h4-icon"></i> Home Page Hero
                                        (Carousel)
                                    </h4>
                                    <p>
                                        Every image is added to the rotating homepage banner. Use the arrows to reorder —
                                        the first image is the initial slide shown to visitors.
                                    </p>
                                </div>
                                <span className="hero-count-badge">
                                    {homeItems.length} image{homeItems.length === 1 ? '' : 's'}
                                </span>
                            </div>

                            <div className="hero-dropzone" onClick={() => homeFileInput.current?.click()}>
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                                <p>
                                    <strong>Click to upload hero images</strong>
                                </p>
                                <span>Multiple files allowed — the first photo becomes the first slide.</span>
                            </div>
                            <input
                                ref={homeFileInput}
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={(e) => {
                                    addHomeFiles(Array.from(e.target.files || []));
                                    e.target.value = '';
                                }}
                            />

                            {homeItems.length > 0 && (
                                <div className="hero-thumbnails">
                                    {homeItems.map((item, index) => (
                                        <div key={item.uid} className={`hero-thumb ${index === 0 ? 'is-first' : ''}`}>
                                            <img src={item.preview || buildImageUrl(item.src)} alt={`Hero slide ${index + 1}`} />
                                            {index === 0 ? (
                                                <span className="hero-first-badge">
                                                    <i className="fa-solid fa-star"></i> Primary (First)
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="hero-set-first-btn"
                                                    title="Set as First Image"
                                                    onClick={() => setAsFirst(index)}
                                                >
                                                    <i className="fa-solid fa-star"></i> Set First
                                                </button>
                                            )}
                                            <div className="hero-thumb-top-actions">
                                                <button
                                                    type="button"
                                                    className="hero-thumb-btn danger"
                                                    title="Remove image"
                                                    onClick={() => setHomeItems((prev) => prev.filter((i) => i.uid !== item.uid))}
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                            <div className="hero-thumb-nav">
                                                <button
                                                    type="button"
                                                    className="hero-thumb-btn"
                                                    title="Move earlier"
                                                    disabled={index === 0}
                                                    onClick={() => moveItem(index, -1)}
                                                >
                                                    <i className="fa-solid fa-chevron-left"></i>
                                                </button>
                                                <span className="hero-thumb-index">{index + 1}</span>
                                                <button
                                                    type="button"
                                                    className="hero-thumb-btn"
                                                    title="Move later"
                                                    disabled={index === homeItems.length - 1}
                                                    onClick={() => moveItem(index, 1)}
                                                >
                                                    <i className="fa-solid fa-chevron-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <SingleHeroCard
                            icon="fa-city"
                            title="Projects Page Hero"
                            desc="Full-width banner at the top of the Projects page."
                            hero={projects}
                            onFileChange={handleSingleFile(setProjects)}
                            onRemove={() =>
                                setProjects((prev) => ({ ...prev, removed: true, newFile: null, newPreview: '' }))
                            }
                            onRestore={() => restoreSingle('projects_hero', setProjects)}
                        />
                        <SingleHeroCard
                            icon="fa-building-columns"
                            title="About Page Hero"
                            desc="Full-width banner at the top of the About page."
                            hero={about}
                            onFileChange={handleSingleFile(setAbout)}
                            onRemove={() => setAbout((prev) => ({ ...prev, removed: true, newFile: null, newPreview: '' }))}
                            onRestore={() => restoreSingle('about_hero', setAbout)}
                        />
                        <SingleHeroCard
                            icon="fa-envelope"
                            title="Contact Page Hero"
                            desc="Full-width banner at the top of the Contact page."
                            hero={contact}
                            onFileChange={handleSingleFile(setContact)}
                            onRemove={() =>
                                setContact((prev) => ({ ...prev, removed: true, newFile: null, newPreview: '' }))
                            }
                            onRestore={() => restoreSingle('contact_hero', setContact)}
                        />
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminHeroImages;