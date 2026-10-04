import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 font-medium select-none transition-[background-color,border-color,color,transform] duration-150 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-45";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-on-accent hover:bg-accent-hover border border-transparent rounded-[5px]",
  secondary:
    "bg-elevated text-ink border border-line hover:border-line-strong hover:bg-elevated-hover rounded-[5px]",
  ghost:
    "bg-transparent text-ink-soft border border-transparent hover:text-ink hover:bg-elevated rounded-[5px]",
  danger:
    "bg-transparent text-danger border border-danger/40 hover:bg-danger/10 rounded-[5px]",
  link: "text-accent-blue hover:underline underline-offset-4 rounded-none",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-2.5 text-[13px]",
  md: "h-9.5 px-3.5 text-[13.5px]",
  lg: "h-11 px-5 text-[15px]",
};

export function buttonVariants(
  variant: ButtonVariant = "secondary",
  size: ButtonSize = "md",
): string {
  return cn(BASE, VARIANTS[variant], variant === "link" ? "" : SIZES[size]);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  leadingIcon,
  trailingIcon,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(buttonVariants(variant, size), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  );
}

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
  title?: string;
  prefetch?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

/** Same visual language as Button, but a real link where navigation is intended. */
export function LinkButton({
  href,
  children,
  variant = "secondary",
  size = "md",
  className,
  external,
  ariaLabel,
  title,
  prefetch,
  leadingIcon,
  trailingIcon,
}: LinkButtonProps) {
  const classes = cn(buttonVariants(variant, size), className);
  const inner = (
    <>
      {leadingIcon}
      {children}
      {trailingIcon}
    </>
  );
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={ariaLabel}
        title={title}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} aria-label={ariaLabel} title={title} prefetch={prefetch}>
      {inner}
    </Link>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: ButtonVariant;
  size?: "sm" | "md";
}

export function IconButton({
  label,
  variant = "ghost",
  size = "md",
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-[5px] transition-colors duration-150",
        size === "sm" ? "size-7" : "size-9",
        VARIANTS[variant],
        "border border-line/70",
        variant === "ghost" && "hover:border-line-strong",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block size-3.5 animate-spin rounded-full border border-current border-t-transparent"
      role="status"
      aria-label="Working"
    />
  );
}
