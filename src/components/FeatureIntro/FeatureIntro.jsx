import './FeatureIntro.scss';

function FeatureIntro({ title, description }) {
    return (
        <section className="feature-intro" aria-labelledby="feature-intro-title">
            <span className="feature-intro__badge">준비 중</span>
            <h1 id="feature-intro-title" className="feature-intro__title">{title}</h1>
            <p className="feature-intro__description">{description}</p>
        </section>
    );
}

export default FeatureIntro;
