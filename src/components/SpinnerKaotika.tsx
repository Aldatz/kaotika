import {extendVariants, Spinner} from "@nextui-org/react";

export const SpinnerKaotika = extendVariants(Spinner, {
    variants: {
        size: {
          sm: {
            wrapper: "w-5 h-5",
            circle1: "border-2",
            circle2: "border-2",
            label: "text-small",
          },
          md: {
            wrapper: "w-8 h-8",
            circle1: "border-3",
            circle2: "border-3",
            label: "text-medium",
          },
          lg: {
            wrapper: "w-36 h-36",
            circle1: "border-3",
            circle2: "border-3",
            label: "text-large",
          },
        }
    }
});