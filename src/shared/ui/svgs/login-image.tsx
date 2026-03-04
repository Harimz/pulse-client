import * as React from "react";

export const LoginImage = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => {
  return (
    <svg
      ref={ref}
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="110" cy="90" r="80" className="fill-custom-primary/5" />
      <circle cx="110" cy="90" r="55" className="fill-custom-primary/10" />

      <rect
        x="60"
        y="55"
        width="100"
        height="40"
        rx="12"
        className="fill-custom-primary/15 stroke-primary/30"
        strokeWidth="1.5"
      />
      <rect
        x="75"
        y="65"
        width="50"
        height="4"
        rx="2"
        className="fill-custom-primary/40"
      />
      <rect
        x="75"
        y="75"
        width="35"
        height="4"
        rx="2"
        className="fill-custom-primary/25"
      />

      <rect
        x="80"
        y="105"
        width="80"
        height="32"
        rx="10"
        className="fill-custom-primary/10 stroke-primary/20"
        strokeWidth="1.5"
      />
      <rect
        x="92"
        y="115"
        width="40"
        height="4"
        rx="2"
        className="fill-custom-primary/30"
      />

      <circle cx="45" cy="70" r="4" className="fill-custom-primary/20" />
      <circle cx="175" cy="100" r="5" className="fill-custom-primary/15" />
      <circle cx="165" cy="60" r="3" className="fill-custom-primary/25" />
      <circle cx="55" cy="130" r="3.5" className="fill-custom-primary/20" />

      <circle cx="110" cy="45" r="14" className="fill-custom-primary" />
      <path
        d="M110 38v14M104 45h12"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
});
