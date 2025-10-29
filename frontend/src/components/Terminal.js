import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

function Terminal() {
  const { 
    terminalHistory, 
    setTerminalHistory, 
    executeTerminalCommand,
    fileSystem
  } = useAppContext();
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const terminalEndRef = useRef(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleCommand = async (cmd) => {
    if (!cmd.trim()) return;
    
    // Add command to history
    const newHistory = [...terminalHistory, { text: `CoreX ${fileSystem.currentPath}> ${cmd}`, type: 'command' }];
    setTerminalHistory(newHistory);
    setInput('');
    setLoading(true);

    try {
      // Execute command through context
      const response = executeTerminalCommand(cmd);
      
      if (response.success) {
        if (response.output) {
          const outputLines = response.output.split('\n');
          const formattedOutput = outputLines.map(line => ({ text: line, type: 'output' }));
          setTerminalHistory([...newHistory, ...formattedOutput, { text: '', type: 'normal' }]);
        } else {
          // Command executed but no output (like 'clear')
          // History is already updated by the command itself
        }
      } else {
        setTerminalHistory([...newHistory, 
          { text: `Error: ${response.error}`, type: 'error' },
          { text: '', type: 'normal' }
        ]);
      }
    } catch (error) {
      console.error('Error executing command:', error);
      setTerminalHistory([...newHistory, 
        { text: `Error: ${error.message}`, type: 'error' },
        { text: '', type: 'normal' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      padding: '15px',
      background: 'linear-gradient(135deg, #BBE1FA 0%, #3282B8 100%)',
      overflow: 'hidden'
    }}>
      <div style={{ 
        background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(15, 76, 117, 0.2)',
        border: '2px solid rgba(50, 130, 184, 0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        {/* Terminal Header */}
        <div style={{ 
          padding: '12px 20px',
          background: 'linear-gradient(135deg, #1B262C 0%, #0F4C75 100%)',
          borderBottom: '2px solid #3282B8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#BBE1FA', fontSize: '1.1rem', fontWeight: '700' }}>
              💻 CoreX OS Terminal
            </span>
          </div>
          {loading && (
            <div style={{ 
              width: '20px', 
              height: '20px', 
              border: '3px solid rgba(187, 225, 250, 0.3)',
              borderTop: '3px solid #BBE1FA',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          )}
        </div>

        {/* Terminal Body */}
        <div style={{
          backgroundColor: '#1B262C',
          color: '#BBE1FA',
          fontFamily: 'Consolas, "Courier New", monospace',
          padding: '15px',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}
        className="custom-scrollbar">
          {terminalHistory.map((line, i) => {
            let color = '#BBE1FA'; // default light blue
            if (line.type === 'command') color = '#38a169'; // green for commands
            else if (line.type === 'output') color = '#3282B8'; // cyan for output
            else if (line.type === 'error') color = '#fc8181'; // red for errors
            else if (line.type === 'system') color = '#f6ad55'; // yellow for system messages
            
            return (
              <div key={i} style={{whiteSpace: 'pre-wrap', color: color, marginBottom: '2px'}}>
                {line.text}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
          
          {/* Input Line */}
          <div style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
            <span style={{color: '#38a169', fontWeight: 'bold'}}>CoreX {fileSystem.currentPath}&gt; </span>
            <input
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#38a169',
                fontFamily: 'Consolas, "Courier New", monospace',
                outline: 'none',
                flex: 1,
                marginLeft: '5px',
                fontSize: '0.9rem'
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCommand(input);
              }}
              disabled={loading}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        </div>

        {/* Terminal Footer - Help Text */}
        <div style={{ 
          padding: '8px 15px',
          background: 'linear-gradient(135deg, #0F4C75 0%, #1B262C 100%)',
          borderTop: '2px solid #3282B8',
          fontSize: '0.7rem',
          color: '#BBE1FA',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>💡 Type "help" for available commands</span>
          <span style={{ opacity: 0.7 }}>Press Enter to execute</span>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Terminal;
