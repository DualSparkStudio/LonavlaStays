import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavLink from './NavLink';
import { mainNavConfig } from './NavIcons';
import { RESORT_NAME } from '../../data/resort';
import ThemeToggle from '../ui/ThemeToggle';

type PublicHeaderProps = {
  currentPage?: string;
};

const PublicHeader: React.FC<PublicHeaderProps> = ({ currentPage = 'home' }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`nav-header ${scrolled ? 'nav-header-scrolled' : 'nav-header-top'} motion-safe:animate-slide-down`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            to="/"
            className="nav-link-enter flex items-center transition-transform duration-300 hover:scale-[1.02]"
            style={{ animationDelay: '80ms' }}
          >
            <svg
              viewBox="0 0 32 32"
              className="h-8 w-8 shrink-0 motion-safe:animate-nav-pop"
              style={{ animationDelay: '120ms' }}
              aria-hidden
            >
              <circle cx="16" cy="16" r="16" fill="#FF385C" />
              <path
                fill="#fff"
                d="M16 7c-4.5 3.5-9 7.2-9 12.2a4.5 4.5 0 109 0c0-1.2-.4-2.3-1-3.2.6 2.2 2.5 3.8 4.8 3.8a4.8 4.8 0 100-9.6c-1.2 0-2.3.4-3.2 1.1.9-3.5 3.5-6.2 6.4-7.3z"
              />
            </svg>
            <span className="font-heading ml-2 text-xl text-[#FF385C] uppercase tracking-wide">{RESORT_NAME}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {mainNavConfig.map((item, index) => (
              <NavLink
                key={item.page}
                index={index}
                label={item.label}
                href={item.href}
                Icon={item.Icon}
                active={currentPage === item.page}
              />
            ))}
          </nav>

          <div className="nav-link-enter" style={{ animationDelay: '720ms' }}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
