import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { AppProvider, useAppContext } from './context/AppContext';
import Dashboard from './components/Dashboard';
import Scheduler from './components/Scheduler';
import MemoryManagement from './components/MemoryManagement';
import FileSystem from './components/FileSystem';
import Synchronization from './components/Synchronization';
import Terminal from './components/Terminal';
import NotificationBar from './components/NotificationBar';

function AppContent() {
  const { activeTab, setActiveTab, notifications } = useAppContext();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'scheduler':
        return <Scheduler />;
      case 'memory':
        return <MemoryManagement />;
      case 'filesystem':
        return <FileSystem />;
      case 'sync':
        return <Synchronization />;
      case 'terminal':
        return <Terminal />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* Notification Bar */}
      <NotificationBar notifications={notifications} />
      
      <Navbar bg="dark" variant="dark" expand="lg" style={{ 
        flexShrink: 0,
        backgroundColor: '#2d3e50',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderBottom: '3px solid #0F4C75'
      }}>
        <Container fluid>
          <Navbar.Brand href="#home" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
            <span style={{ color: '#0F4C75' }}>Core</span><span style={{ color: '#fff' }}>X</span> <span style={{ color: '#3282B8' }}>OS</span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <Nav.Link 
                onClick={() => setActiveTab('dashboard')} 
                active={activeTab === 'dashboard'}
                style={{ 
                  fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal',
                  color: activeTab === 'dashboard' ? '#3282B8' : '#fff',
                  borderBottom: activeTab === 'dashboard' ? '2px solid #3282B8' : 'none'
                }}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link 
                onClick={() => setActiveTab('scheduler')} 
                active={activeTab === 'scheduler'}
                style={{ 
                  fontWeight: activeTab === 'scheduler' ? 'bold' : 'normal',
                  color: activeTab === 'scheduler' ? '#3282B8' : '#fff',
                  borderBottom: activeTab === 'scheduler' ? '2px solid #3282B8' : 'none'
                }}
              >
                Scheduler
              </Nav.Link>
              <Nav.Link 
                onClick={() => setActiveTab('memory')} 
                active={activeTab === 'memory'}
                style={{ 
                  fontWeight: activeTab === 'memory' ? 'bold' : 'normal',
                  color: activeTab === 'memory' ? '#3282B8' : '#fff',
                  borderBottom: activeTab === 'memory' ? '2px solid #3282B8' : 'none'
                }}
              >
                Memory
              </Nav.Link>
              <Nav.Link 
                onClick={() => setActiveTab('filesystem')} 
                active={activeTab === 'filesystem'}
                style={{ 
                  fontWeight: activeTab === 'filesystem' ? 'bold' : 'normal',
                  color: activeTab === 'filesystem' ? '#3282B8' : '#fff',
                  borderBottom: activeTab === 'filesystem' ? '2px solid #3282B8' : 'none'
                }}
              >
                File System
              </Nav.Link>
              <Nav.Link 
                onClick={() => setActiveTab('sync')} 
                active={activeTab === 'sync'}
                style={{ 
                  fontWeight: activeTab === 'sync' ? 'bold' : 'normal',
                  color: activeTab === 'sync' ? '#3282B8' : '#fff',
                  borderBottom: activeTab === 'sync' ? '2px solid #3282B8' : 'none'
                }}
              >
                Synchronization
              </Nav.Link>
              <Nav.Link 
                onClick={() => setActiveTab('terminal')} 
                active={activeTab === 'terminal'}
                style={{ 
                  fontWeight: activeTab === 'terminal' ? 'bold' : 'normal',
                  color: activeTab === 'terminal' ? '#3282B8' : '#fff',
                  borderBottom: activeTab === 'terminal' ? '2px solid #3282B8' : 'none'
                }}
              >
                Terminal
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div style={{ 
        flex: 1, 
        overflow: 'hidden',
        padding: activeTab === 'terminal' || activeTab === 'scheduler' ? 0 : '1rem',
        background: activeTab === 'terminal' || activeTab === 'scheduler' ? '#fff' : 'transparent'
      }}>
        {renderContent()}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
