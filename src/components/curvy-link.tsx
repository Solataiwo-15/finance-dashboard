// src/components/curvy-link.tsx (V3 - With Spacing)

import Link from "next/link";

type CurvyLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function CurvyLink({ href, children }: CurvyLinkProps) {
  return (
    <Link href={href} className="relative inline-block font-semibold">
      {/* --- THE FIX IS HERE --- */}
      <span>{children}</span>

      <svg
        className="absolute left-0 bottom--4 w-full h-3.5 text-[#B4E53B]" // Adjusted bottom position slightly
        viewBox="0 0 100 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M1 6 C 20 2, 80 2, 99 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
