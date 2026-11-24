import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home, Search, Package, Bell, User, Menu, X,
  ShoppingBag, Heart, LogOut, Settings, ChevronDown,
  Zap, Plus
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home',    label: 'Home',      icon: Home },
  { id: 'browse',  label: 'Browse',    icon: Search },
  { id: 'dashboard', label: 'Dashboard', icon: Package },
];

export default function Navbar() {
  const { currentPage, navigate, user, wishlist } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        {/* Logo */}
        <button onClick={() => navigate('home')} style={styles.logo}>
          <div style={styles.logoIcon}>
            <Zap size={18} color="white" strokeWidth={2.5} />
          </div>
          <span style={styles.logoText}>Rent<span style={{ color: 'var(--primary)' }}>Mate</span></span>
        </button>

        {/* Desktop Nav */}
        <div style={styles.navLinks}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              style={{
                ...styles.navLink,
                ...(currentPage === id ? styles.navLinkActive : {}),
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div style={styles.actions}>
          <button
            onClick={() => navigate('list-item')}
            className="btn btn-primary btn-sm"
            style={{ gap: 6 }}
          >
            <Plus size={15} />
            List Item
          </button>

          <button
            onClick={() => navigate('browse')}
            style={styles.iconBtn}
            aria-label="Wishlist"
          >
            <Heart size={18} color="var(--gray-600)" />
            {wishlist.length > 0 && (
              <span style={styles.badge}>{wishlist.length}</span>
            )}
          </button>

          <button style={styles.iconBtn} aria-label="Notifications">
            <Bell size={18} color="var(--gray-600)" />
            <span style={{ ...styles.badge, background: 'var(--error)' }}>2</span>
          </button>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(o => !o)}
              style={styles.userBtn}
            >
              <img src={user.avatar} alt={user.name} style={styles.avatar} />
              <span style={styles.userName}>{user.name.split(' ')[0]}</span>
              <ChevronDown size={14} color="var(--gray-500)" />
            </button>

            {userMenuOpen && (
              <>
                <div style={styles.overlay} onClick={() => setUserMenuOpen(false)} />
                <div style={styles.userMenu}>
                  <div style={styles.userMenuHeader}>
                    <img src={user.avatar} alt={user.name} style={styles.userMenuAvatar} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)' }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{user.email}</div>
                    </div>
                  </div>
                  <div style={styles.userMenuDivider} />
                  {[
                    { icon: User,      label: 'Profile',   page: 'profile' },
                    { icon: Package,   label: 'My Listings', page: 'dashboard' },
                    { icon: ShoppingBag, label: 'Rentals', page: 'dashboard' },
                    { icon: Heart,     label: 'Wishlist',  page: 'browse' },
                    { icon: Settings,  label: 'Settings',  page: 'home' },
                  ].map(({ icon: Icon, label, page }) => (
                    <button key={label} style={styles.userMenuItem}
                      onClick={() => { navigate(page); setUserMenuOpen(false); }}
                    >
                      <Icon size={15} color="var(--gray-500)" /> {label}
                    </button>
                  ))}
                  <div style={styles.userMenuDivider} />
                  <button style={{ ...styles.userMenuItem, color: 'var(--error)' }}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            style={{ ...styles.iconBtn, display: 'none' }}
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} style={styles.mobileNavLink}
              onClick={() => { navigate(id); setMenuOpen(false); }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
          <button className="btn btn-primary" style={{ margin: '8px 16px' }}
            onClick={() => { navigate('list-item'); setMenuOpen(false); }}
          >
            <Plus size={15} /> List an Item
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .user-name-text { display: none !important; }
          .list-item-btn { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--gray-200)',
    boxShadow: '0 1px 20px rgba(0,0,0,0.06)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    gap: 16,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 800,
    color: 'var(--gray-900)',
    letterSpacing: '-0.5px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 'var(--radius)',
    border: 'none',
    background: 'transparent',
    color: 'var(--gray-600)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'var(--transition)',
    fontFamily: 'var(--font-sans)',
  },
  navLinkActive: {
    background: 'var(--primary-50)',
    color: 'var(--primary)',
    fontWeight: 600,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  iconBtn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--gray-200)',
    background: 'white',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    background: 'var(--primary)',
    color: 'white',
    fontSize: 10,
    fontWeight: 700,
    width: 16,
    height: 16,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid white',
  },
  userBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 10px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--gray-200)',
    background: 'white',
    cursor: 'pointer',
    transition: 'var(--transition)',
    fontFamily: 'var(--font-sans)',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userName: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--gray-700)',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
  },
  userMenu: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: 'white',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-xl)',
    border: '1px solid var(--gray-200)',
    minWidth: 220,
    zIndex: 100,
    overflow: 'hidden',
  },
  userMenuHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
  },
  userMenuAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userMenuDivider: {
    height: 1,
    background: 'var(--gray-100)',
  },
  userMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '10px 16px',
    border: 'none',
    background: 'transparent',
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--gray-700)',
    cursor: 'pointer',
    transition: 'var(--transition)',
    fontFamily: 'var(--font-sans)',
    textAlign: 'left',
  },
  mobileMenu: {
    background: 'white',
    borderTop: '1px solid var(--gray-200)',
    padding: '8px 0',
    display: 'flex',
    flexDirection: 'column',
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 20px',
    border: 'none',
    background: 'transparent',
    fontSize: 15,
    fontWeight: 500,
    color: 'var(--gray-700)',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    textAlign: 'left',
  },
};
