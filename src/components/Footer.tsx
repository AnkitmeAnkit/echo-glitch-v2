import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Playbooks', href: '/marketplace' },
  { label: 'Blog', href: '/blog' },
  { label: 'News', href: '/news' },
];

const resourceLinks = [
  { label: 'FAQ', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
];

const socialLinks = [
  { label: 'Twitter / X', icon: Twitter, href: '#' },
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
  { label: 'GitHub', icon: Github, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-dark-base text-white">
      <div className="max-w-[1280px] mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div>
            <img src="/echo-glitch-logo.svg" alt="Echo Glitch" className="h-7 mb-4" />
            <p className="text-[#A0AEC0] text-sm leading-relaxed">
              AI execution, zero noise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-clash font-semibold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#A0AEC0] text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-clash font-semibold text-sm tracking-wider uppercase mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#A0AEC0] text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-clash font-semibold text-sm tracking-wider uppercase mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent-violet transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-[#A0AEC0] text-sm">
            &copy; 2025 Echo Glitch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
