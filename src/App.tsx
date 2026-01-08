import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import Header from './components/Header';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import { useMenu } from './hooks/useMenu';

function MainApp() {
  const cart = useCart();
  const { menuItems } = useMenu();
  const [currentView, setCurrentView] = React.useState<'menu' | 'cart' | 'checkout'>('menu');
  // const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const handleViewChange = (view: 'menu' | 'cart' | 'checkout') => {
    setCurrentView(view);
  };

  // Filter menu items logic removed as nav is hidden
  const filteredMenuItems = menuItems;

  return (
    <div className="min-h-screen bg-cream-50 font-inter">
      <Header
        onMenuClick={() => handleViewChange('menu')}
      />
      {/* <SubNav selectedCategory={selectedCategory} onCategoryClick={handleCategoryClick} /> */}

      {currentView === 'menu' && (
        <Menu
          menuItems={filteredMenuItems}
          addToCart={(item, quantity, variation, addOns) => {
            cart.addToCart(item, quantity, variation, addOns);
            handleViewChange('checkout');
          }}
          cartItems={cart.cartItems}
          updateQuantity={cart.updateQuantity}
        />
      )}

      {currentView === 'cart' && (
        <Cart
          cartItems={cart.cartItems}
          updateQuantity={cart.updateQuantity}
          removeFromCart={cart.removeFromCart}
          clearCart={cart.clearCart}
          getTotalPrice={cart.getTotalPrice}
          onContinueShopping={() => handleViewChange('menu')}
          onCheckout={() => handleViewChange('checkout')}
        />
      )}

      {currentView === 'checkout' && (
        <Checkout
          cartItems={cart.cartItems}
          totalPrice={cart.getTotalPrice()}
          onBack={() => {
            cart.clearCart();
            handleViewChange('menu');
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;