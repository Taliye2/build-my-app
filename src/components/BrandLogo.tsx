import React from 'react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'sidebar' | 'navbar' | 'auth' | 'icon';
  className?: string;
  isCollapsed?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'navbar',
  className,
  isCollapsed = false
}) => {
  // SVG-based logo that doesn't depend on external files
  const LogoFull = ({ height = 40 }: { height?: number }) => (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-gradient">
        <span className="text-white font-bold text-lg">K</span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-sm tracking-tight text-foreground">Kafiskey</span>
        <span className="text-[10px] text-muted-foreground -mt-0.5">Service Operations</span>
      </div>
    </div>
  );

  const LogoIcon = () => (
    <div className={cn("flex items-center justify-center w-9 h-9 rounded-xl bg-brand-gradient", className)}>
      <span className="text-white font-bold text-lg">K</span>
    </div>
  );

  if (variant === 'icon' || (variant === 'sidebar' && isCollapsed)) {
    return <LogoIcon />;
  }

  if (variant === 'auth') {
    return <LogoFull height={80} />;
  }

  return <LogoFull />;
};
