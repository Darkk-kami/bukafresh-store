import React from "react";

const NairaIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="0"
      y="18"
      fontSize={Number(size) * 0.9}
      fontWeight="bold"
      fill="currentColor"
    >
      ₦
    </text>
  </svg>
);

export default NairaIcon;
