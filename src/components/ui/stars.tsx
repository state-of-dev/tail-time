import React from 'react';

interface StarProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  size?: number;
  stroke?: string;
  pathClassName?: string;
  strokeWidth?: number;
}

export function Star33({
  color,
  size,
  stroke,
  strokeWidth,
  pathClassName,
  width,
  height,
  ...props
}: StarProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 200 200"
      width={size ?? width}
      height={size ?? height}
      {...props}
    >
      <path
        fill={color ?? "currentColor"}
        stroke={stroke}
        strokeWidth={strokeWidth}
        className={pathClassName}
        d="M92.874 82.969C36.151-54.164 100 16.636 100 90.762c0-74.221 63.849-144.926 7.126-7.888 56.818-137.038 51.877-41.91-.57 10.548 52.447-52.458 147.65-57.305 10.546-.57 137.104-56.735 66.319 7.128-7.886 7.128 74.205 0 144.895 63.862 7.886 7.127 137.009 56.83 41.901 51.888-10.546-.57 52.447 52.458 57.293 147.682.57 10.549 56.723 137.133-7.126 66.333-7.126-7.888 0 74.221-63.849 144.926-7.126 7.888-56.818 137.038-51.877 41.909.57-10.549-52.447 52.458-147.65 57.305-10.546.57-137.104 56.735-66.32-7.127 7.886-7.127-74.205 0-144.895-63.863-7.886-7.128-137.009-56.83-41.901-51.888 10.546.57-52.447-52.363-57.293-147.586-.57-10.453"
      />
    </svg>
  );
}

export function Star39({
  color,
  size,
  stroke,
  strokeWidth,
  pathClassName,
  width,
  height,
  ...props
}: StarProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 200 200"
      width={size ?? width}
      height={size ?? height}
      {...props}
    >
      <path
        fill={color ?? "currentColor"}
        stroke={stroke}
        strokeWidth={strokeWidth}
        className={pathClassName}
        d="M190.791 9.21c14.055 48.529-7.693 106.08-56.222 126.593-10.257 34.474 26.876 54.988 56.222 54.988-48.53 14.055-106.081-7.693-126.594-56.222-34.474-10.257-54.988 26.781-54.988 56.222-14.055-48.53 7.693-106.081 56.222-126.594C75.688 29.723 38.65 9.209 9.21 9.209c48.53-14.055 106.08 7.693 126.593 56.222 34.474 10.257 54.988-26.781 54.988-56.222"
      />
    </svg>
  );
}

export function Star27({
  color,
  size,
  stroke,
  strokeWidth,
  pathClassName,
  width,
  height,
  ...props
}: StarProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 200 200"
      width={size ?? width}
      height={size ?? height}
      {...props}
    >
      <path
        fill={color ?? "currentColor"}
        stroke={stroke}
        strokeWidth={strokeWidth}
        className={pathClassName}
        d="M195 195c-54.245-54.245-135.755-54.245-190 0C59.245 140.755 59.245 59.245 5 5c54.245 54.245 135.755 54.245 190 0-54.245 54.245-54.245 135.755 0 190"
      />
    </svg>
  );
}