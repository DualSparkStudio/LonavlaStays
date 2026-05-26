import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { navIconClassName, type NavIconComponent } from './NavIcons';

type NavLinkProps = {
  label: string;
  href: string;
  active: boolean;
  Icon: NavIconComponent;
  onClick?: () => void;
  className?: string;
  index?: number;
};

const NavLink: React.FC<NavLinkProps> = ({
  label,
  href,
  active,
  Icon,
  onClick,
  className,
  index = 0,
}) => (
  <Link
    to={href}
    onClick={onClick}
    style={{ animationDelay: `${200 + index * 110}ms` }}
    className={cn(
      'nav-link-item nav-link-enter group inline-flex flex-col items-center pb-0.5 transition-colors duration-300',
      active
        ? 'text-[#222222] dark:text-white'
        : 'text-[#717171] dark:text-gray-400',
      'hover:text-airbnb-red',
      className
    )}
  >
    <span className="inline-flex items-center gap-2">
      <span className="nav-icon-wrap">
        <Icon
          className={cn(
            navIconClassName,
            'nav-icon-motion drop-shadow-sm motion-safe:animate-nav-pop'
          )}
          style={{ animationDelay: `${280 + index * 110}ms` }}
        />
      </span>
      <span className="nav-link-label text-base leading-none font-bold transition-transform duration-300">
        {label}
      </span>
    </span>
    <span
      className={cn(
        'mt-2 h-0.5 w-full rounded-full transition-all duration-300',
        active
          ? 'bg-[#222222] dark:bg-white opacity-100 group-hover:bg-airbnb-red dark:group-hover:bg-airbnb-red'
          : 'bg-transparent opacity-0 group-hover:opacity-100 group-hover:bg-airbnb-red group-hover:scale-x-110'
      )}
      aria-hidden
    />
  </Link>
);

export default NavLink;
