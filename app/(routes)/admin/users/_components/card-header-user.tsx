"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@prisma/client";
import Link from "next/link";
import { useEffect, useRef } from "react";

function CardHeaderUser({ user }: { user: User }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    resizeText();

    window.addEventListener("resize", resizeText);

    return () => {
      window.removeEventListener("resize", resizeText);
    };
  }, []);

  const resizeText = () => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) {
      return;
    }

    const containerWidth = container.offsetWidth;
    let min = 1;
    let max = 40;

    while (min <= max) {
      const mid = Math.floor((min + max) / 2);
      text.style.fontSize = mid + "px";

      if (text.offsetWidth <= containerWidth) {
        min = mid + 1;
      } else {
        max = mid - 1;
      }
    }

    text.style.fontSize = max + "px";
  };

  return (
    <CardHeader className="p-2">
      <CardTitle
        ref={containerRef}
        className="w-full flex items-center text-center  leading-8 relative h-10 justify-center"
      >
        <Link
          ref={textRef}
          href={`/admin/users/${user.id}`}
          className="capitalize  hover:underline absolute bottom-0 left-0 mx-auto whitespace-nowrap font-bold text-center"
        >
          {user.company ? user.company : user.name ? user.name : user.email}
        </Link>
      </CardTitle>
    </CardHeader>
  );
}

export default CardHeaderUser;
