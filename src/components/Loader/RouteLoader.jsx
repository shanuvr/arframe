import './RouteLoader.css';

const RouteLoader = () => (
    <div className="route-loader">
        <div className="route-loader-inner">
            <img src="/logo/logowhite.png" alt="Aframe Builders" className="route-loader-logo" />
            <span className="route-loader-tagline">A Frame To Transcend Time</span>
            <div className="route-loader-spinner">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
            </div>
            <span className="route-loader-text">Loading…</span>
        </div>
    </div>
);

export default RouteLoader;