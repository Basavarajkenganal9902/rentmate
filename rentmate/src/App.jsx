import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ItemDetailPage from './pages/ItemDetailPage';
import ListItemPage from './pages/ListItemPage';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import {
  SAMPLE_ITEMS,
  SAMPLE_RENTALS,
  INCOMING_REQUESTS,
  MY_LISTINGS
} from './data/mockData';

function MainRouter() {
  const { currentPage } = useApp();

  // App-wide reactive state
  const [items, setItems] = useState(SAMPLE_ITEMS);
  const [rentals, setRentals] = useState(SAMPLE_RENTALS);
  const [incomingRequests, setIncomingRequests] = useState(INCOMING_REQUESTS);
  const [myListings, setMyListings] = useState(MY_LISTINGS);

  // Handlers for rental features
  const handleAddNewItem = (newItem) => {
    setItems(prev => [newItem, ...prev]);
    setMyListings(prev => [newItem, ...prev]);
  };

  const handleCreateRentRequest = (requestData) => {
    const newRental = {
      id: `r-${Date.now()}`,
      itemId: requestData.itemId,
      item: requestData.item,
      renterId: requestData.renterId,
      renterName: requestData.renterName,
      ownerId: requestData.item.owner.id,
      startDate: requestData.startDate,
      endDate: requestData.endDate,
      totalDays: requestData.totalDays,
      totalCost: requestData.totalCost,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      returnTrackingCode: `RM-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: requestData.notes,
    };

    setRentals(prev => [newRental, ...prev]);

    // Also simulate incoming request for owner view
    const newIncoming = {
      id: `req-${Date.now()}`,
      itemId: requestData.itemId,
      item: requestData.item,
      renterId: requestData.renterId,
      renterName: requestData.renterName,
      renterAvatar: requestData.renterAvatar,
      startDate: requestData.startDate,
      endDate: requestData.endDate,
      totalDays: requestData.totalDays,
      totalCost: requestData.totalCost,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      notes: requestData.notes,
    };
    setIncomingRequests(prev => [newIncoming, ...prev]);
  };

  const handleApproveRequest = (requestId) => {
    setIncomingRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'approved' } : r))
    );
    // Also update any matching rental to active
    setRentals(prev =>
      prev.map(r => (r.status === 'pending' ? { ...r, status: 'active' } : r))
    );
  };

  const handleRejectRequest = (requestId) => {
    setIncomingRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );
  };

  const handleUpdateReturnStatus = (rentalId, nextStatus, notes) => {
    setRentals(prev =>
      prev.map(r => {
        if (r.id === rentalId) {
          return {
            ...r,
            status: nextStatus,
            returnTrackingNotes: notes || r.returnTrackingNotes,
          };
        }
        return r;
      })
    );
  };

  const handleToggleListingAvailability = (itemId) => {
    setMyListings(prev =>
      prev.map(i => (i.id === itemId ? { ...i, available: !i.available } : i))
    );
    setItems(prev =>
      prev.map(i => (i.id === itemId ? { ...i, available: !i.available } : i))
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <ToastContainer />
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'browse' && <BrowsePage />}
        {currentPage === 'item-detail' && (
          <ItemDetailPage
            onRentRequest={handleCreateRentRequest}
            onToggleItemAvailability={handleToggleListingAvailability}
          />
        )}
        {currentPage === 'list-item' && (
          <ListItemPage onAddItem={handleAddNewItem} />
        )}
        {currentPage === 'dashboard' && (
          <DashboardPage
            rentals={rentals}
            incomingRequests={incomingRequests}
            myListings={myListings}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onUpdateReturnStatus={handleUpdateReturnStatus}
            onToggleListingAvailability={handleToggleListingAvailability}
          />
        )}
        {currentPage === 'profile' && <UserProfilePage />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
