import React from 'react';

function NotificationBar({ notifications }) {
  if (notifications.length === 0) return null;

  const getNotificationStyle = (type) => {
    const baseStyle = {
      padding: '10px 20px',
      borderRadius: '8px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '0.85rem',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      animation: 'slideIn 0.3s ease-out',
      border: '2px solid'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
          color: 'white',
          borderColor: '#22543d'
        };
      case 'error':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
          color: 'white',
          borderColor: '#742a2a'
        };
      case 'warning':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #f6ad55 0%, #dd6b20 100%)',
          color: 'white',
          borderColor: '#7c2d12'
        };
      default: // info
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
          color: 'white',
          borderColor: '#1B262C'
        };
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      right: '20px',
      zIndex: 9999,
      maxWidth: '400px',
      minWidth: '300px'
    }}>
      {notifications.map((notification) => (
        <div key={notification.id} style={getNotificationStyle(notification.type)}>
          <span style={{ fontSize: '1.2rem' }}>{getIcon(notification.type)}</span>
          <span style={{ flex: 1 }}>{notification.message}</span>
        </div>
      ))}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default NotificationBar;
