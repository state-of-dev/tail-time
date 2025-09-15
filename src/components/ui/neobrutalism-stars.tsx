import React from 'react';

interface StarProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  size?: number;
  stroke?: string;
  pathClassName?: string;
  strokeWidth?: number;
}

// Star 1 - Classic 5-point star
export function Star1(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 10l20.6 63.4h66.8l-54 39.2 20.6 63.4L100 136.8 46 176l20.6-63.4-54-39.2h66.8z" />
    </svg>
  );
}

// Star 2 - 8-point star
export function Star2(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 15l14.14 35.86H150l-28.93 21.04L135.21 107.96 100 86.92 64.79 107.96 78.93 71.9 50 50.86h35.86z M100 113.08l35.21 21.04-14.14-36.06L150 119.1h-35.86L100 185l-14.14-35.86H50l28.93 21.04-14.14 36.06z" />
    </svg>
  );
}

// Star 3 - 6-point star (Star of David style)
export function Star3(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 20l25 43.3h50L150 106.7 125 150H75L50 106.7 25 63.3h50z" />
    </svg>
  );
}

// Star 4 - 4-point diamond star
export function Star4(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 20l30 80 50-30-30 80 30 80-50-30-30 80-30-80-50 30 30-80L20 100l30-80z" />
    </svg>
  );
}

// Star 5 - Complex geometric star
export function Star5(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 10l15 40 40 15-40 15-15 40 25 35-25 35 15 40-40 15 40 15-15 40-25-35-25 35-15-40 40-15-40-15 15-40-25-35 25-35-15-40 40-15-40-15z" />
    </svg>
  );
}

// Star 6 - Sparkle star
export function Star6(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 30l5 20 20 5-20 5-5 20-5-20-20-5 20-5 5-20zM60 60l3 12 12 3-12 3-3 12-3-12-12-3 12-3 3-12zM140 60l3 12 12 3-12 3-3 12-3-12-12-3 12-3 3-12zM100 120l8 32 32 8-32 8-8 32-8-32-32-8 32-8 8-32z" />
    </svg>
  );
}

// Star 7 - Cross-like star
export function Star7(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M85 20h30v45h45v30h-45v45h45v30h-45v45h-30v-45H40v-30h45V95H40V65h45V20z" />
    </svg>
  );
}

// Star 8 - Irregular burst star
export function Star8(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 10l12 35 35-12-12 35 35 12-35 12 12 35-35-12-12 35-12-35-35 12 12-35-35-12 35-12-12-35 35 12z" />
    </svg>
  );
}

// Star 9 - Triangle star burst
export function Star9(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 20l20 40 40-20-20 40 40 20-40 20 20 40-40-20-20 40-20-40-40 20 20-40-40-20 40-20-20-40 40 20z" />
    </svg>
  );
}

// Star 10 - Small detailed star
export function Star10(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 40l8 24 24 8-24 8-8 24-8-24-24-8 24-8 8-24zM70 80l4 12 12 4-12 4-4 12-4-12-12-4 12-4 4-12zM130 80l4 12 12 4-12 4-4 12-4-12-12-4 12-4 4-12zM100 130l10 30 30 10-30 10-10 30-10-30-30-10 30-10 10-30z" />
    </svg>
  );
}

// Star 11-20: More geometric variations
export function Star11(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 15l18 55 55 18-55 18-18 55-18-55-55-18 55-18 18-55zM50 50l9 27 27 9-27 9-9 27-9-27-27-9 27-9 9-27zM150 150l9 27 27 9-27 9-9 27-9-27-27-9 27-9 9-27z" />
    </svg>
  );
}

export function Star12(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 20l25 25 35-10-10 35 25 25-25 25 10 35-35-10-25 25-25-25-35 10 10-35-25-25 25-25-10-35 35 10z" />
    </svg>
  );
}

export function Star13(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 30l15 15 21-6-6 21 15 15-15 15 6 21-21-6-15 15-15-15-21 6 6-21-15-15 15-15-6-21 21 6z M70 70l8 8 11-3-3 11 8 8-8 8 3 11-11-3-8 8-8-8-11 3 3-11-8-8 8-8-3-11 11 3z M130 130l8 8 11-3-3 11 8 8-8 8 3 11-11-3-8 8-8-8-11 3 3-11-8-8 8-8-3-11 11 3z" />
    </svg>
  );
}

export function Star14(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 25l22.5 45 45-22.5-22.5 45 45 22.5-45 22.5 22.5 45-45-22.5-22.5 45-22.5-45-45 22.5 22.5-45-45-22.5 45-22.5-22.5-45 45 22.5z" />
    </svg>
  );
}

export function Star15(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 10l30 30h42l-30 30 30 30h-42l-30 30-30-30H28l30-30-30-30h42z" />
    </svg>
  );
}

// Additional specialized stars (16-40)
export function Star16(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 20l16 48 48 16-48 16-16 48-16-48-48-16 48-16 16-48z M60 60l8 24 24 8-24 8-8 24-8-24-24-8 24-8 8-24z M140 140l8 24 24 8-24 8-8 24-8-24-24-8 24-8 8-24z" />
    </svg>
  );
}

export function Star17(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 15l20 30 35 10-20 30 20 30-35 10-20 30-20-30-35-10 20-30-20-30 35-10z M50 80l10 15 17.5 5-10 15 10 15-17.5 5-10 15-10-15-17.5-5 10-15-10-15 17.5-5z" />
    </svg>
  );
}

export function Star18(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 25l14.14 35.86 35.86 14.14-35.86 14.14L100 125l-14.14-35.86L50 75l35.86-14.14z M75 75l7.07 17.93 17.93 7.07-17.93 7.07L75 125l-7.07-17.93L50 100l17.93-7.07z M125 75l7.07 17.93 17.93 7.07-17.93 7.07L125 125l-7.07-17.93L100 100l17.93-7.07z" />
    </svg>
  );
}

export function Star19(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 30l12 36 36 12-36 12-12 36-12-36-36-12 36-12z M60 120l8 24 24 8-24 8-8 24-8-24-24-8 24-8z M140 120l8 24 24 8-24 8-8 24-8-24-24-8 24-8z M100 160l6 18 18 6-18 6-6 18-6-18-18-6 18-6z" />
    </svg>
  );
}

export function Star20(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 20l18 54 54 18-54 18-18 54-18-54-54-18 54-18 18-54z M50 50l9 27 27 9-27 9-9 27-9-27-27-9 27-9 9-27z M150 50l9 27 27 9-27 9-9 27-9-27-27-9 27-9 9-27z M50 150l9 27 27 9-27 9-9 27-9-27-27-9 27-9 9-27z M150 150l9 27 27 9-27 9-9 27-9-27-27-9 27-9 9-27z" />
    </svg>
  );
}

// Continue with more creative star designs (21-40)
export function Star21(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 15l24 36 42 6-24 36 24 36-42 6-24 36-24-36-42-6 24-36-24-36 42-6z" />
    </svg>
  );
}

export function Star22(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 25l21.21 21.21 30-10.61-10.61 30 21.21 21.21-21.21 21.21 10.61 30-30-10.61L100 175l-21.21-21.21-30 10.61 10.61-30L38.79 113.18l21.21-21.21-10.61-30 30 10.61z" />
    </svg>
  );
}

export function Star23(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 10l26 39 46 7.8-26 39 26 39-46 7.8-26 39-26-39-46-7.8 26-39-26-39 46-7.8z" />
    </svg>
  );
}

export function Star24(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 20l28 28 40-14-14 40 28 28-28 28 14 40-40-14-28 28-28-28-40 14 14-40-28-28 28-28-14-40 40 14z" />
    </svg>
  );
}

export function Star25(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 15l22 44 44 22-44 22-22 44-22-44-44-22 44-22z M70 70l11 22 22 11-22 11-11 22-11-22-22-11 22-11z M130 130l11 22 22 11-22 11-11 22-11-22-22-11 22-11z" />
    </svg>
  );
}

// Stars 26-40 with even more variety
export function Star26(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 20l15 30 33 5-15 30 15 30-33 5-15 30-15-30-33-5 15-30-15-30 33-5z M50 80l7.5 15 16.5 2.5-7.5 15 7.5 15-16.5 2.5-7.5 15-7.5-15-16.5-2.5 7.5-15-7.5-15 16.5-2.5z M150 120l7.5 15 16.5 2.5-7.5 15 7.5 15-16.5 2.5-7.5 15-7.5-15-16.5-2.5 7.5-15-7.5-15 16.5-2.5z" />
    </svg>
  );
}

export function Star27(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M195 195c-54.245-54.245-135.755-54.245-190 0C59.245 140.755 59.245 59.245 5 5c54.245 54.245 135.755 54.245 190 0-54.245 54.245-54.245 135.755 0 190" />
    </svg>
  );
}

export function Star28(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 10l32 48 48 32-48 32-32 48-32-48-48-32 48-32z M60 60l16 24 24 16-24 16-16 24-16-24-24-16 24-16z M140 140l16 24 24 16-24 16-16 24-16-24-24-16 24-16z" />
    </svg>
  );
}

export function Star29(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 25l19.32 38.64 38.64 19.32-38.64 19.32L100 175l-19.32-38.64L42.04 117.04l38.64-19.32z M75 75l9.66 19.32 19.32 9.66-19.32 9.66L75 133.96l-9.66-19.32L46.02 105.32l19.32-9.66z M125 125l9.66 19.32 19.32 9.66-19.32 9.66L125 183.96l-9.66-19.32L96.02 155.32l19.32-9.66z" />
    </svg>
  );
}

export function Star30(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 15l24 48 48 24-48 24-24 48-24-48-48-24 48-24z M50 50l12 24 24 12-24 12-12 24-12-24-24-12 24-12z M150 50l12 24 24 12-24 12-12 24-12-24-24-12 24-12z M100 135l12 24 24 12-24 12-12 24-12-24-24-12 24-12z" />
    </svg>
  );
}

// Final set of stars (31-40)
export function Star31(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 20l17 34 34 17-34 17-17 34-17-34-34-17 34-17z M65 65l8.5 17 17 8.5-17 8.5-8.5 17-8.5-17-17-8.5 17-8.5z M135 65l8.5 17 17 8.5-17 8.5-8.5 17-8.5-17-17-8.5 17-8.5z M65 135l8.5 17 17 8.5-17 8.5-8.5 17-8.5-17-17-8.5 17-8.5z M135 135l8.5 17 17 8.5-17 8.5-8.5 17-8.5-17-17-8.5 17-8.5z" />
    </svg>
  );
}

export function Star32(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 10l36 36 50-18-18 50 36 36-36 36 18 50-50-18-36 36-36-36-50 18 18-50-36-36 36-36-18-50 50 18z" />
    </svg>
  );
}

export function Star33(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M92.874 82.969C36.151-54.164 100 16.636 100 90.762c0-74.221 63.849-144.926 7.126-7.888 56.818-137.038 51.877-41.91-.57 10.548 52.447-52.458 147.65-57.305 10.546-.57 137.104-56.735 66.319 7.128-7.886 7.128 74.205 0 144.895 63.862 7.886 7.127 137.009 56.83 41.901 51.888-10.546-.57 52.447 52.458 57.293 147.682.57 10.549 56.723 137.133-7.126 66.333-7.126-7.888 0 74.221-63.849 144.926-7.126 7.888-56.818 137.038-51.877 41.909.57-10.549-52.447 52.458-147.65 57.305-10.546.57-137.104 56.735-66.32-7.127 7.886-7.127-74.205 0-144.895-63.863-7.886-7.128-137.009-56.83-41.901-51.888 10.546.57-52.447-52.363-57.293-147.586-.57-10.453" />
    </svg>
  );
}

export function Star34(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 15l25 50 50 25-50 25-25 50-25-50-50-25 50-25z M60 60l12.5 25 25 12.5-25 12.5-12.5 25-12.5-25-25-12.5 25-12.5z M140 140l12.5 25 25 12.5-25 12.5-12.5 25-12.5-25-25-12.5 25-12.5z" />
    </svg>
  );
}

export function Star35(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 20l23 46 46 23-46 23-23 46-23-46-46-23 46-23z M70 70l11.5 23 23 11.5-23 11.5-11.5 23-11.5-23-23-11.5 23-11.5z M130 130l11.5 23 23 11.5-23 11.5-11.5 23-11.5-23-23-11.5 23-11.5z M100 160l5.75 11.5 11.5 5.75-11.5 5.75-5.75 11.5-5.75-11.5-11.5-5.75 11.5-5.75z" />
    </svg>
  );
}

export function Star36(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 25l21 42 42 21-42 21-21 42-21-42-42-21 42-21z M65 65l10.5 21 21 10.5-21 10.5-10.5 21-10.5-21-21-10.5 21-10.5z M135 135l10.5 21 21 10.5-21 10.5-10.5 21-10.5-21-21-10.5 21-10.5z M100 170l7 14 14 7-14 7-7 14-7-14-14-7 14-7z" />
    </svg>
  );
}

export function Star37(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 30l19 38 38 19-38 19-19 38-19-38-38-19 38-19z M60 60l9.5 19 19 9.5-19 9.5-9.5 19-9.5-19-19-9.5 19-9.5z M140 60l9.5 19 19 9.5-19 9.5-9.5 19-9.5-19-19-9.5 19-9.5z M60 140l9.5 19 19 9.5-19 9.5-9.5 19-9.5-19-19-9.5 19-9.5z M140 140l9.5 19 19 9.5-19 9.5-9.5 19-9.5-19-19-9.5 19-9.5z" />
    </svg>
  );
}

export function Star38(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 10l27 40.5 40.5 27-40.5 27-27 40.5-27-40.5L32 77.5l40.5-27z M50 50l13.5 20.25 20.25 13.5-20.25 13.5L50 117.5l-13.5-20.25L16.25 83.75l20.25-13.5z M150 150l13.5 20.25 20.25 13.5-20.25 13.5L150 217.5l-13.5-20.25L116.25 183.75l20.25-13.5z" />
    </svg>
  );
}

export function Star39(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M190.791 9.21c14.055 48.529-7.693 106.08-56.222 126.593-10.257 34.474 26.876 54.988 56.222 54.988-48.53 14.055-106.081-7.693-126.594-56.222-34.474-10.257-54.988 26.781-54.988 56.222-14.055-48.53 7.693-106.081 56.222-126.594C75.688 29.723 38.65 9.209 9.21 9.209c48.53-14.055 106.08 7.693 126.593 56.222 34.474 10.257 54.988-26.781 54.988-56.222" />
    </svg>
  );
}

export function Star40(props: StarProps) {
  const { color, size, stroke, strokeWidth, pathClassName, width, height, ...svgProps } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size ?? width} height={size ?? height} {...svgProps}>
      <path fill={color ?? "currentColor"} stroke={stroke} strokeWidth={strokeWidth} className={pathClassName}
        d="M100 15l35 35 49-7-7 49 35 35-35 35 7 49-49-7-35 35-35-35-49 7 7-49-35-35 35-35-7-49 49 7z M70 70l17.5 17.5 24.5-3.5-3.5 24.5 17.5 17.5-17.5 17.5 3.5 24.5-24.5-3.5L70 130l-17.5-17.5-24.5 3.5 3.5-24.5L13 74l17.5-17.5-3.5-24.5 24.5 3.5z" />
    </svg>
  );
}

// Export all stars as an array for easy iteration
export const AllStars = [
  Star1, Star2, Star3, Star4, Star5, Star6, Star7, Star8, Star9, Star10,
  Star11, Star12, Star13, Star14, Star15, Star16, Star17, Star18, Star19, Star20,
  Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28, Star29, Star30,
  Star31, Star32, Star33, Star34, Star35, Star36, Star37, Star38, Star39, Star40
];

// Star size utilities
export const StarSizes = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64,
  '3xl': 96,
  '4xl': 128
} as const;