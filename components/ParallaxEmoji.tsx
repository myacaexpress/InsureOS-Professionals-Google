import React, { useEffect, useRef } from "react";

interface ParallaxEmojiProps {
  emoji: string;
  speedY: number;
  speedX: number;
  seed: number;
  className?: string;
}

const ParallaxEmoji: React.FC<ParallaxEmojiProps> = ({ 
  emoji, 
  speedY, 
  speedX, 
  seed, 
  className = "" 
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // We use the initial position to calculate offset
    const rect = element.getBoundingClientRect();
    const initialY = rect.top + window.scrollY;

    let rafId: number | null = null;

    const animate = () => {
      const time = Date.now() * 0.0007;
      const scrollY = window.scrollY;

      // Parallax effect based on scroll position
      const parallaxY = (scrollY - initialY) * speedY;
      const parallaxX = (scrollY - initialY) * speedX;

      // Floating animation (sine/cosine waves)
      const floatY = Math.sin(time * 0.8 + seed * 2) * 15;
      const floatX = Math.cos(time * 0.6 + seed * 2) * 10;
      const rotate = Math.sin(time * 0.4 + seed * 2) * 10;

      // Combine both effects
      const finalX = parallaxX + floatX;
      const finalY = parallaxY + floatY;

      // Use translate3d for hardware acceleration
      element.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) rotate(${rotate}deg)`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [speedY, speedX, seed]);

  return (
    <div 
      ref={ref} 
      className={`absolute pointer-events-none select-none will-change-transform ${className}`}
      aria-hidden="true"
    >
      {emoji}
    </div>
  );
};

export default ParallaxEmoji;