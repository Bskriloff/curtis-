import { CurtifyStudio } from "@/components/curtify-studio"

export default function Page() {
  return (
    <>
      <div className="noise" aria-hidden="true" />
      <header className="nav">
        <a className="brand" href="#top">
          <span className="brand-mark">C</span>
          <span>CURTIFY</span>
        </a>
        <nav>
          <a href="#studio">Create</a>
          <a href="#how">How it works</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="eyebrow">THE CURTIS IMAGE EDITOR</div>
          <h1>
            Put Curtis
            <br />
            <span>anywhere.</span>
          </h1>
          <p className="hero-copy">
            Upload a photo, tell CURTIFY what you want, and let the AI do the rest.
          </p>
          <a className="hero-button" href="#studio">
            Start creating <b>↓</b>
          </a>
        </section>

        <CurtifyStudio />

        <section className="reference-section">
          <div className="reference-copy">
            <div className="section-kicker">THE REFERENCE</div>
            <h2>
              Every CURTIFY
              <br />
              starts with Curtis.
            </h2>
            <p>
              The supplied Curtis photo is automatically used as the face reference. You
              don&apos;t need to upload it every time.
            </p>
          </div>
          <div className="reference-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/curtis.jpg" alt="Curtis reference" />
            <div>
              <strong>CURTIS</strong>
              <span>BUILT-IN REFERENCE</span>
            </div>
          </div>
        </section>

        <section id="how" className="how">
          <div className="section-kicker">HOW IT WORKS</div>
          <div className="how-grid">
            <div>
              <b>01</b>
              <h3>Upload</h3>
              <p>Pick any image from your phone or computer.</p>
            </div>
            <div>
              <b>02</b>
              <h3>Describe</h3>
              <p>Tell CURTIFY how Curtis should appear in it.</p>
            </div>
            <div>
              <b>03</b>
              <h3>Generate</h3>
              <p>CURTIFY blends the reference into your image.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>CURTIFY © 2026</span>
        <span>THE CURTIS ERA</span>
      </footer>
    </>
  )
}
