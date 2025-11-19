import React, { useEffect, useRef } from "react";

interface TravelingEmojiProps {
  emoji: string;
  initialX: number; // percent 0-100
  initialY: number; // percent 0-100
  speedX: number; // pixels per frame
  speedY: number; // pixels per frame
  rotationSpeed?: number;
  size?: string;
}

const TravelingEmoji: React.FC<TravelingEmojiProps> = ({
  emoji,
  initialX,
  initialY,
  speedX,
  speedY,
  rotationSpeed = 0,
  size = "text-4xl"
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Initialize position based on percentage of current viewport
    let x = (window.innerWidth * initialX) / 100;
    let y = (window.innerHeight * initialY) / 100;
    let rotation = 0;
    let rafId: number;

    const animate = () => {
      // Update physics
      x += speedX;
      y += speedY;
      rotation += rotationSpeed;

      const { innerWidth, innerHeight } = window;
      const buffer = 150; // Allow emoji to fully clear screen before wrapping

      // Wrap around logic
      if (speedX > 0 && x > innerWidth + buffer) x = -buffer;
      else if (speedX < 0 && x < -buffer) x = innerWidth + buffer;
      
      if (speedY > 0 && y > innerHeight + buffer) y = -buffer;
      else if (speedY < 0 && y < -buffer) y = innerHeight + buffer;

      // Apply transform
      element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [initialX, initialY, speedX, speedY, rotationSpeed]);

  return (
    <div
      ref={ref}
      className={`absolute top-0 left-0 pointer-events-none select-none will-change-transform opacity-20 ${size}`}
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {emoji}
    </div>
  );
};

export default TravelingEmoji;