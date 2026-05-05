import React from 'react';
import { cn } from '@/lib/utils';
import logoFull from '@/assets/kafiskey-logo.png';
import logoIcon from '@/assets/kafiskey-icon.png';

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
  const LogoFull = ({ height = 36 }: { height?: number }) => (
    <div className={cn("flex items-center", className)}>
      <img src={logoFull} alt="Kafiskey" style={{ height }} className="w-auto object-contain" />
    </div>
  );

  const LogoIcon = () => (
    <img src={logoIcon} alt="Kafiskey" className={cn("w-9 h-9 object-contain", className)} />
  );

  if (variant === 'icon' || (variant === 'sidebar' && isCollapsed)) {
    return <LogoIcon />;
  }

  if (variant === 'auth') {
    return <LogoFull height={64} />;
  }

  return <LogoFull />;
};
