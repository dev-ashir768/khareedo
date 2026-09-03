"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type ImageSkeletonProps = ImageProps & {
  onLoadingChange?: (loaded: boolean) => void;
};

export function ImageSkeleton({
  className,
  onLoad,
  onLoadingChange,
  ...props
}: ImageSkeletonProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <Image
        {...props}
        className={cn(
          className,
          "transition-opacity duration-600",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={(e) => {
          setLoaded(true);
          onLoadingChange?.(true);
          onLoad?.(e);
        }}
        alt={"image"}
      />
    </>
  );
}
