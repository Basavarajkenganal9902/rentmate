import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [user, setUser] = useState({
    id: 'me',
    name: 'Basavaraj Kenganal',
    avatar: '/basavaraj.jpg',
    email: 'basavaraj.kenganal@gmail.com',
    rating: 4.9,
    reviews: 42,
    verified: true,
    memberSince: 'Jan 2024',
    location: 'Indiranagar, Bengaluru, KA',
    totalRentals: 15,
    totalListings: 5,
  });
  const [wishlist, setWishlist] = useState([4, 6, 13]);
  const [cartItem, setCartItem] = useState(null);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
    }, 3500);
  }, []);

  const toggleWishlist = useCallback((itemId) => {
    setWishlist(prev => {
      if (prev.includes(itemId)) {
        addToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== itemId);
      } else {
        addToast('Added to wishlist ❤️', 'success');
        return [...prev, itemId];
      }
    });
  }, [addToast]);

  const navigate = useCallback((page, item = null) => {
    setCurrentPage(page);
    if (item) setSelectedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AppContext.Provider value={{
      currentPage, navigate,
      selectedItem, setSelectedItem,
      user, setUser, wishlist, toggleWishlist,
      toasts, addToast,
      cartItem, setCartItem,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
