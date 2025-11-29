import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { HTMLMotionProps, motion } from "framer-motion";
import * as React from "react";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "weak" | "destructive" | "ghost";
  size?: "big" | "medium" | "small";
  fullWidth?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "medium",
      fullWidth = false,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : motion.button;

    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95",
      weak: "bg-transparent text-muted-foreground hover:bg-muted/50 active:scale-95",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95",
      ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
    };

    const sizes = {
      big: "h-14 px-8 text-lg rounded-2xl",
      medium: "h-12 px-6 text-base rounded-xl",
      small: "h-10 px-4 text-sm rounded-lg",
    };

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            fullWidth ? "w-full" : "",
            className
          )}
          {...(props as any)}
        >
          {children}
        </Slot>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "",
          className
        )}
        whileTap={{ scale: 0.96 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
