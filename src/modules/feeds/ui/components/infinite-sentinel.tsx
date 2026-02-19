import { useEffect, useRef } from "react";

export const InfiniteSentinel = ({
  onVisible,
  disabled,
}: {
  onVisible: () => void;
  disabled?: boolean;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onVisible();
      },
      { rootMargin: "600px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [onVisible, disabled]);

  return <div ref={ref} className="h-1" />;
};
