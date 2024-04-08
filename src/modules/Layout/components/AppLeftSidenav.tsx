"use client";

import Link from "next/link";

import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { IconProps } from "@radix-ui/react-icons/dist/types";

interface NavProps {
  currentSelected: string;
  links: {
    title: string;
    label?: string;
    key: string;
    icon: React.ForwardRefExoticComponent<
      IconProps & React.RefAttributes<SVGSVGElement>
    >;
    variant: "default" | "ghost";
  }[];
}

export function AppLeftSidenav({ links, currentSelected }: NavProps) {
  return (
    <div className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href="#"
            className={cn(
              buttonVariants({ variant: link.variant, size: "lg" }),
              currentSelected === link.key && "bg-muted",
              currentSelected !== link.key && "bg-transparent ",
              "justify-start px-4  text-white hover:bg-muted hover:text-white",
            )}
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.title}
            {link.label && (
              <span
                className={cn(
                  "ml-auto",
                  link.variant === "default" &&
                    "text-background dark:text-white",
                )}
              >
                {link.label}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
