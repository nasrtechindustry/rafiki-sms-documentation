'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import {
  BookOpen,
  Lock,
  MessageSquare,
  CreditCard,
  User,
  Code2,
  AlertCircle,
  Zap,
  SlidersHorizontal,
  List,
  FileText,
  Webhook,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const nav = [
  { href: '/', label: 'Overview', icon: BookOpen },
  { href: '/authentication', label: 'Authentication', icon: Lock },
  {
    label: 'SMS',
    icon: MessageSquare,
    children: [
      { href: '/sms/send-sms', label: 'Send SMS' },
      { href: '/sms/send-bulk-sms', label: 'Send Bulk SMS' },
      { href: '/sms/logs', label: 'SMS Logs' },
    ],
  },
  {
    label: 'OTP Verification',
    icon: Lock,
    children: [
      { href: '/otp/generate', label: 'Generate OTP' },
      { href: '/otp/verify', label: 'Verify OTP' },
    ],
  },
  {
    label: 'Sender Names',
    icon: User,
    children: [
      { href: '/sender-names/get', label: 'Get Sender Names' },
      { href: '/sender-names/balance', label: 'Check Balance' },
      { href: '/sender-names/delivery-reports', label: 'Delivery Reports' },
      { href: '/sender-names/request', label: 'Request Sender Name' },
    ],
  },
  { href: '/webhooks', label: 'Webhooks', icon: Webhook },
  { href: '/sdks', label: 'SDKs & Tools', icon: Code2 },
  { href: '/rate-limiting', label: 'Rate Limiting', icon: Zap },
  { href: '/parameters', label: 'Parameters', icon: SlidersHorizontal },
  { href: '/pagination', label: 'Pagination', icon: List },
  { href: '/errors', label: 'Errors', icon: AlertCircle },
];

const CHILD_HEIGHT = 32;
const CHILD_GAP = 2;

function NavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: (typeof nav)[number];
  pathname: string;
  onNavigate?: () => void;
}) {
  const hasChildren = 'children' in item && item.children;
  const isChildActive = hasChildren && item.children.some(c => pathname === c.href);
  const [open, setOpen] = useState(isChildActive);
  const Icon = item.icon;

  const activeIndex = useMemo(() => {
    if (!hasChildren) return -1;
    return item.children.findIndex(c => pathname === c.href);
  }, [pathname, hasChildren, item]);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Icon size={16} className="shrink-0 text-gray-500 dark:text-gray-400" />
            {item.label}
          </span>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {open && (
          <div className="ml-6 mt-1 flex flex-col gap-0.5 relative pl-3">
            {/* Static track */}
            <div className="absolute left-0 top-1 bottom-1 w-px bg-gray-200 dark:bg-gray-700 rounded-full" />
            {/* Animated indicator */}
            <div
              className="absolute left-0 w-0.5 bg-teal-500 dark:bg-teal-400 rounded-full transition-all duration-300 ease-out"
              style={{
                height: CHILD_HEIGHT - 4,
                top: activeIndex >= 0 ? activeIndex * (CHILD_HEIGHT + CHILD_GAP) + 2 : -9999,
                opacity: activeIndex >= 0 ? 1 : 0,
              }}
            />
            {item.children.map((child, idx) => {
              const active = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  style={{ height: CHILD_HEIGHT }}
                  className={`flex items-center px-2 py-1.5 rounded-md text-sm transition-all duration-200 ${
                    active
                      ? 'text-teal-600 dark:text-teal-400 font-medium bg-teal-50 dark:bg-teal-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/40'
                  }`}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const active = pathname === (item as { href: string }).href;
  return (
    <Link
      href={(item as { href: string }).href}
      onClick={onNavigate}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
      }`}
    >
      <Icon size={16} className="shrink-0 text-gray-500 dark:text-gray-400" />
      {item.label}
    </Link>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-3 mb-4 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/rafiki.svg" alt="RafikiSMS" className="w-9 h-9 object-contain shrink-0" />
          <span className="text-lg font-semibold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent leading-tight">
            RafikiSMS API
          </span>
        </Link>
        <input
          type="search"
          placeholder="Search docs..."
          className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
        />
      </div>

      <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5">
        {nav.map((item, i) => (
          <NavItem key={i} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">v1.0.0</span>
        <ThemeToggle />
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/rafiki.svg" alt="RafikiSMS" className="w-8 h-8 object-contain" />
          <span className="font-semibold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
            RafikiSMS API
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed top-0 left-0 bottom-0 z-40 w-72 bg-white dark:bg-gray-900 shadow-xl">
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-20">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}
