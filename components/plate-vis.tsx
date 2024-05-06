"use client";
import { plugins } from "@/lib/plate/plate-plugins";
import { Plate } from "@udecode/plate-common";
import { Editor } from "./plate-ui/editor";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const PlateVis = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  return (
    <Plate initialValue={JSON.parse(value)} plugins={plugins}>
      <Editor
        className={cn("cursor-default bg-background p-4 ", className)}
        autoFocus
        focusRing={false}
        variant="ghost"
        size="md"
        readOnly
      />
    </Plate>
  );
};
