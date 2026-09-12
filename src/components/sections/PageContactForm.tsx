"use client";

import { useId, useState } from "react";

/*
  The contact form, and the one honest thing it is allowed to say.

  There is no server behind this website. No route handler, no form service, no
  inbox API — the site is four static pages and a marketing home page. A form
  that collected a name, an email and a message, animated a tick and said
  "Thanks, we will be in touch" would therefore be a lie told to a woman at the
  exact moment she was asking for help, and she would wait for a reply that no
  system anywhere had been asked to produce. That is the worst thing this page
  could do, so it does not do it.

  What it does instead: it says, above the button, what pressing the button
  will do. Pressing it composes the message into a `mailto:` and hands it to
  whatever email app the device has. Nothing is transmitted from this page.
  Afterwards the panel does not congratulate her — it says the message is
  sitting unsent in her drafts and she still has to press send, and it gives
  her the address in plain text in case no email app opened at all.

  Without JavaScript the form still works: `action="mailto:…"` with
  `enctype="text/plain"` is the browser's own version of the same thing, which
  is cruder but real. The `onSubmit` below intercepts it only to write a
  subject line and a readable body first.
*/

/** Where mail to a person actually goes. Also printed in full on the page. */
export const CONTACT_EMAIL = "hello@womsakhi.com";

/*
  A mailto URL is a URL, and some email apps and some versions of Windows still
  truncate one past about two thousand characters. A message that arrives with
  its last paragraph missing is worse than one that was never sent, so the
  field is capped where the encoded URL is comfortably inside that — and the
  cap is stated on the page rather than enforced silently.
*/
const MESSAGE_LIMIT = 1400;

type Status = "idle" | "handed-off";

export function PageContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const ids = useId();
  const nameId = `${ids}-name`;
  const emailId = `${ids}-email`;
  const messageId = `${ids}-message`;
  const hintId = `${ids}-hint`;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const subject = name ? `Message from ${name}` : "Message from the WomSakhi website";
    const body = `${message}\n\n—\n${name}\n${email}\n`;

    const href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    // The status is set before the hand-off, not after it: on a device with no
    // mail handler nothing happens at all when the URL is followed, and the
    // panel explaining that is the only thing she will have to go on.
    setStatus("handed-off");
    window.location.href = href;
  }

  return (
    <form
      onSubmit={onSubmit}
      action={`mailto:${CONTACT_EMAIL}`}
      method="post"
      encType="text/plain"
      className="rounded-3xl border border-line bg-surface p-5 shadow-[0_30px_70px_-50px_rgba(20,16,42,0.55)] sm:p-7"
    >
      <h2 className="font-display text-[1.5rem] font-semibold leading-snug tracking-[-0.015em] text-ink sm:text-[1.75rem]">
        Write to us
      </h2>

      <div className="mt-6 space-y-5">
        <Field
          id={nameId}
          name="name"
          label="Your name"
          autoComplete="name"
          placeholder="Sunita"
        />
        <Field
          id={emailId}
          name="email"
          type="email"
          label="Your email"
          autoComplete="email"
          placeholder="sunita@example.com"
          hint="So a reply has somewhere to go."
        />

        <div>
          <label
            htmlFor={messageId}
            className="block text-[0.9375rem] font-semibold text-ink"
          >
            Your message
          </label>
          <textarea
            id={messageId}
            name="message"
            required
            rows={7}
            maxLength={MESSAGE_LIMIT}
            placeholder="What has happened, and what you need."
            className="mt-2 block w-full rounded-2xl border border-line bg-canvas px-4 py-3 text-base leading-relaxed text-ink placeholder:text-muted/70 focus:border-brand-400 focus:bg-surface"
          />
          <p className="mt-2 text-[0.8125rem] leading-snug text-muted">
            Up to {MESSAGE_LIMIT.toLocaleString("en-IN")} characters. Longer than
            that and some email apps cut the end off without telling you.
          </p>
        </div>
      </div>

      <p
        id={hintId}
        className="mt-7 flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-[0.9375rem] leading-relaxed text-ink-2"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-brand-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.6 6.6h16.8v10.8H3.6z" />
          <path d="m3.9 7.2 8.1 6 8.1-6" />
        </svg>
        <span>
          This form does not send anything by itself. The button opens your own
          email app with what you have written, addressed to {CONTACT_EMAIL} —
          and you press send there.
        </span>
      </p>

      <button
        type="submit"
        aria-describedby={hintId}
        className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-brand-600 px-7 text-base font-semibold text-white shadow-[0_14px_30px_-14px_rgba(118,72,179,0.95)] transition-colors duration-200 hover:bg-brand-700 sm:w-auto"
      >
        Open this in my email app
        <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none">
          <path
            d="M7 13 13 7m0 0H8m5 0v5"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/*
        Announced, because a woman using a screen reader has no other way to
        learn that the page did something — and what it says is that the
        message has NOT been sent.
      */}
      <div aria-live="polite">
        {status === "handed-off" ? (
          <div className="mt-6 rounded-2xl border border-gold/60 bg-gold/10 p-5">
            <h3 className="font-display text-[1.125rem] font-semibold leading-snug text-ink">
              Not sent yet — it is in your email app.
            </h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
              Your email app should have opened with this message ready and
              addressed. Nothing has reached us until you press send there.
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
              If nothing opened, this device has no email app set up. Write to{" "}
              <span className="font-semibold text-ink">{CONTACT_EMAIL}</span>{" "}
              from wherever you do read your email, and say the same thing.
            </p>
          </div>
        ) : null}
      </div>

      <noscript>
        <p className="mt-6 rounded-2xl border border-line bg-canvas p-4 text-[0.9375rem] leading-relaxed text-ink-2">
          JavaScript is switched off, so this button will hand the form straight
          to your email app in whatever shape the browser chooses. If that does
          not work, write to {CONTACT_EMAIL} directly — it is the same inbox.
        </p>
      </noscript>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email";
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
}) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-[0.9375rem] font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-describedby={hintId}
        className="mt-2 block min-h-[52px] w-full rounded-2xl border border-line bg-canvas px-4 text-base text-ink placeholder:text-muted/70 focus:border-brand-400 focus:bg-surface"
      />
      {hint ? (
        <p id={hintId} className="mt-2 text-[0.8125rem] leading-snug text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default PageContactForm;
