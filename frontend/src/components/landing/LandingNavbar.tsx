import { useState, useEffect } from 'react';
import { Shield, Menu, X, Terminal, ArrowUpRight, Lock } from 'lucide-react';
import { Button, Badge } from '../common/index.ts';

interface LandingNavbarProps {
  onLoginClick: () => void;
  onLaunchDashboard: () => void;
}

export function LandingNavbar({ onLoginClick, onLaunchDashboard }: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section spy
      const sections = ['home', 'features', 'how-it-works', 'threat-intelligence', 'about'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'features', label: 'Features', href: '#features' },
    { id: 'how-it-works', label: 'How It Works', href: '#how-it-works' },
    { id: 'threat-intelligence', label: 'Threat Intelligence', href: '#threat-intelligence' },
    { id: 'about', label: 'About', href: '#about' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030712]/90 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.7)]'
          : 'bg-transparent border-b border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="flex items-center gap-3 group select-none"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-purple-600 flex items-center justify-center p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_28px_rgba(0,242,254,0.75)] transition-all">
              <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            {/* Pulsing indicator dot */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#030712]" />
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                CYBER CHAKRAVYUHA
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase">
              AI Digital Trust Intelligence
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0b152d]/60 border border-white/[0.08] px-4 py-1.5 rounded-full backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 select-none ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/15 shadow-[0_0_12px_rgba(6,182,212,0.25)] border border-cyan-400/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons: Login + Launch Dashboard */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLoginClick}
            leftIcon={<Lock className="w-3.5 h-3.5 text-slate-400" />}
            className="text-xs text-slate-300 hover:text-white"
          >
            Login
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onLaunchDashboard}
            rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            className="shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Launch Dashboard
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070d1e]/98 border-b border-cyan-500/20 backdrop-blur-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 font-semibold border-l-2 border-cyan-400'
                      : 'text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
              leftIcon={<Terminal className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Operative Login
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchDashboard();
              }}
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Launch Dashboard
            </Button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2">
            <span>PERIMETER: ACTIVE</span>
            <Badge variant="emerald" size="sm">ZERO-TRUST VERIFIED</Badge>
          </div>
        </div>
      )}
    </header>
  );
}

