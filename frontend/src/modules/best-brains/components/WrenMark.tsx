/**
 * WrenMark — the module's Ms. Wren bird motif from the Claude-Design
 * reference screens (design/inbound): teal circles (body, wing, head) +
 * a paper eye-dot + an apricot beak. An original mark, no brand imitation.
 * Purely decorative; always aria-hidden (the persona's presence is carried
 * by copy + audio, not the mark).
 */

export interface WrenMarkProps {
  /** Rendered square size in px (reference uses 32–38). */
  size?: number;
  className?: string;
}

export default function WrenMark({ size = 38, className }: WrenMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="16" cy="24" r="12" fill="#3B7B78" />
      <circle cx="12" cy="27" r="5" fill="#2C5E5C" />
      <circle cx="26" cy="13" r="7.5" fill="#2C5E5C" />
      <circle cx="28.4" cy="11.6" r="1.6" fill="#FAF7F2" />
      <polygon points="33,11.5 39,13.5 33,15.5" fill="#E39A57" />
    </svg>
  );
}
