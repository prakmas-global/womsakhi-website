"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Shown once per browser session. It used to run on every full page load, so a
 * returning visitor waited out the same second of branding each time.
 *
 * Whether to show it at all is decided by the inline script in layout.tsx,
 * which sets `data-splash="skip"` on <html> before first paint when the
 * visitor has already seen it this session or asks for reduced motion. CSS
 * then hides it, so there is no frame where the wrong thing is on screen and
 * no state to set on mount. This component only handles the dismissal.
 */
export function BrandSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;
  return (
    <div className="brandSplash" aria-hidden="true">
      <Image className="brandMarkLight" src="/assets/womsakhi-lockup.png" alt="" width={190} height={190} priority />
      <Image className="brandMarkDark" src="/assets/womsakhi-lockup-dark.png" alt="" width={190} height={190} priority />
      <span>Learn · Work · Earn · Belong</span>
    </div>
  );
}
