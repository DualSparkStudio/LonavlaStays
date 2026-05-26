import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

type AnimationVariant = 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right';

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
};

const hiddenByVariant: Record<AnimationVariant, string> = {
  'fade-up': 'opacity-0 translate-y-8',
  'fade-in': 'opacity-0',
  'scale-in': 'opacity-0 scale-95',
  'slide-left': 'opacity-0 -translate-x-8',
  'slide-right': 'opacity-0 translate-x-8',
};

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  variant = 'fade-up',
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]',
        !visible && hiddenByVariant[variant],
        visible && 'opacity-100 translate-x-0 translate-y-0 scale-100',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
