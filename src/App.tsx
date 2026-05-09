import { useState, type FormEvent } from 'react';
import { ChevronRight } from 'lucide-react';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Do players install Harbor, or do I?',
    a: "You do. Harbor ships as harbor-launcher.exe alongside your game. Players never install anything separately — they just launch your game normally, and see the Harbor launcher instead of whatever you had before (or nothing).",
  },
  {
    q: 'Does it work with Steam / Epic / GOG?',
    a: "Yes. Harbor sits between the storefront and your game executable. Whatever launched your game before still launches Harbor, and Harbor then launches your game.",
  },
  {
    q: 'Can I white-label it?',
    a: 'Completely. Your game name, logo, colors, fonts, play button text, social links. There is no Harbor branding visible to your players. A small "powered by harbor" footer is optional and off by default on Pro.',
  },
  {
    q: 'What does it cost my players?',
    a: 'Nothing. Harbor is billed to the studio, not the player. No ads, no telemetry we sell, no upsells to your players.',
  },
  {
    q: 'When is Harbor shipping?',
    a: "Q3 2026, give or take. Get on the list and you'll know first.",
  },
];

function App() {
  return (
    <>
      <Hero />
      <FAQ />
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="dotgrid hero-grid" />
      <div className="container hero-inner">
        <a href="/" className="logo hero-logo">
          <span className="logo-mark" />
          Harbor
        </a>

        <h1 className="hero-headline">
          The launcher
          <br />
          between
          <br />
          <span className="text-teal">Steam and</span>
          <br />
          <span className="text-teal">your game.</span>
        </h1>

        <p className="hero-paragraph">
          Harbor is a white-label launcher surface for indie studios. Ship patch notes,
          news, and dev comments to your players at the moment they care most — right
          when they hit play.
        </p>

        <EmailForm />
      </div>
    </section>
  );
}

function EmailForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') params.append(key, value);
    }

    setSubmitting(true);
    setError(null);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        setSubmitted(true);
      })
      .catch(() => setError('Something went wrong. Try again?'))
      .finally(() => setSubmitting(false));
  };

  if (submitted) {
    return (
      <div className="form-success">
        <span className="pill pill-teal">
          <span className="pill-dot" />
          You're in.
        </span>
        <p className="form-success-msg">We'll let you know when Harbor ships.</p>
      </div>
    );
  }

  return (
    <form
      name="waitlist"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="email-form"
    >
      <input type="hidden" name="form-name" value="waitlist" />
      <p className="honeypot">
        <label>
          Don't fill this out: <input name="bot-field" />
        </label>
      </p>
      <input
        type="email"
        name="email"
        placeholder="you@studio.com"
        required
        disabled={submitting}
        className="input email-input"
      />
      <button type="submit" disabled={submitting} className="btn btn-primary btn-lg">
        {submitting ? 'Sending…' : 'Notify me'}
      </button>
      {error && <span className="form-error">{error}</span>}
    </form>
  );
}

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="faq-section">
      <div className="container faq-container">
        <div className="faq-header">
          <div className="eyebrow">FAQ</div>
          <h2 className="display-lg">Things devs ask us.</h2>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="faq-item">
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    size={16}
                    className={`faq-chevron ${isOpen ? 'is-open' : ''}`}
                  />
                </button>
                {isOpen && <div className="faq-answer">{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a href="/" className="logo">
          <span className="logo-mark" />
          Harbor
        </a>
        <p className="footer-tagline">
          A launcher surface for indie devs. Ship patch notes, news, and dev comments
          right when players hit play.
        </p>
        <div className="hairline footer-bottom">
          <span className="mono footer-copy">
            © 2026 Harbor Labs · made for devs who ship
          </span>
        </div>
      </div>
    </footer>
  );
}

export default App;
