import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type ButtonVariant = "white" | "black" | "orange";

const BASE =
  "text-data inline-flex cursor-pointer items-center justify-center gap-1.5 px-5 py-4 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-s2-orange";

const VARIANTS: Record<ButtonVariant, string> = {
  white: "bg-s2-white text-s2-black",
  black: "bg-s2-black text-s2-steel",
  orange: "bg-s2-orange text-s2-white",
};

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  withArrow?: boolean;
  // El layout (col-span, ancho, alineación) se pasa desde la página.
  className?: string;
};

type ButtonAsLink = BaseProps &
  Omit<ComponentProps<typeof Link>, "className" | "children">;

type ButtonAsButton = BaseProps &
  Omit<ComponentProps<"button">, "className" | "children"> & { href?: never };

export function Button({
  children,
  variant = "white",
  withArrow = true,
  className = "",
  ...rest
}: ButtonAsLink | ButtonAsButton) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`.trim();
  const content = (
    <>
      {children}
      {withArrow ? (
        <img
          src="/icons/arrow-right.svg"
          alt=""
          width={10}
          height={9}
          className="shrink-0"
        />
      ) : null}
    </>
  );

  if ("href" in rest && rest.href) {
    return (
      <Link {...rest} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button {...(rest as ComponentProps<"button">)} className={classes}>
      {content}
    </button>
  );
}
