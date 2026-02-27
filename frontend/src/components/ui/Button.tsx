"use client";

import Link from "next/link";
import React from "react";
import Loader from "./Loader";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "solid" | "gas";
  loading?: boolean;
  disabled?: boolean;
  link?: string;
}

/**
 * Button Component
 * Reusable button with loading state and optional link wrapper
 */
const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  onClick = () => {},
  type = "solid",
  loading = false,
  disabled = false,
  link = "",
}) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    link ? <Link href={link}>{children}</Link> : <>{children}</>;
  
  return (
    <Wrapper>
      <button
        className={`flex items-center justify-center relative h-[48px] px-8 rounded-xl my-2 border-[1px] ${
          type === "gas"
            ? "border-themeColor bg-transparent text-themeColor"
            : "border-transparent bg-themeColor text-white"
        } ${className} ${
          loading || disabled ? "opacity-[0.45]" : "opacity-100"
        } ${
          disabled
            ? "cursor-not-allowed"
            : loading
            ? "cursor-progress"
            : "cursor-pointer"
        }`}
        onClick={loading || disabled ? () => {} : onClick}
        disabled={disabled || loading}
      >
        {loading && <Loader size="small" className="absolute left-1/4" />}
        {children}
      </button>
    </Wrapper>
  );
};

export default Button;
