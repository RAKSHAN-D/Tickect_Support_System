import React, { useState } from 'react';
import CreateTicketForm from './components/CreateTicketForm';
import TicketList from './components/TicketList';
import StatsDashboard from './components/StatsDashboard';
import './App.css';

function App() {
  // Holds state variable refreshTrigger (integer starting at 0)
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // onTicketCreated increments refreshTrigger by 1
  const handleTicketCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🎫</span>
            <span className="logo-text">SupportDesk</span>
          </div>
          <p className="header-subtitle">AI-Powered Ticket Management</p>
        </div>
      </header>

      <main className="app-main">
        {/* Renders StatsDashboard and passes refreshTrigger */}
        <StatsDashboard refreshTrigger={refreshTrigger} />

        <div className="dashboard-grid">
          <section className="create-section">
            {/* Renders CreateTicketForm and passes onTicketCreated */}
            <CreateTicketForm onTicketCreated={handleTicketCreated} />
          </section>

          <section className="list-section">
            <div className="section-header">
              <h2>Active Tickets</h2>
              <p>Manage and track all support requests</p>
            </div>
            {/* Renders TicketList and passes refreshTrigger */}
            <TicketList refreshTrigger={refreshTrigger} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
