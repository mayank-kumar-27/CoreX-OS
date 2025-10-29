import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

function Synchronization() {
  const [activeDemo, setActiveDemo] = useState('producer-consumer');
  const [isRunning, setIsRunning] = useState(false);
  
  // Producer-Consumer state
  const [numProducers, setNumProducers] = useState(2);
  const [numConsumers, setNumConsumers] = useState(2);
  const [bufferSize, setBufferSize] = useState(5);
  const [buffer, setBuffer] = useState([]);
  const [produced, setProduced] = useState(0);
  const [consumed, setConsumed] = useState(0);
  const [logs, setLogs] = useState([]);
  
  // Dining Philosophers state
  const [philosophers, setPhilosophers] = useState([
    { id: 0, state: 'thinking', meals: 0 },
    { id: 1, state: 'thinking', meals: 0 },
    { id: 2, state: 'thinking', meals: 0 },
    { id: 3, state: 'thinking', meals: 0 },
    { id: 4, state: 'thinking', meals: 0 }
  ]);
  const [forks, setForks] = useState([true, true, true, true, true]); // true = available
  const [philosopherLogs, setPhilosopherLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev.slice(-9), { time: new Date().toLocaleTimeString(), message }]);
  };

  const addPhilosopherLog = (message) => {
    setPhilosopherLogs(prev => [...prev.slice(-9), { time: new Date().toLocaleTimeString(), message }]);
  };

  const startProducerConsumer = () => {
    setIsRunning(true);
    setBuffer([]);
    setProduced(0);
    setConsumed(0);
    setLogs([]);
    addLog('🚀 Producer-Consumer simulation started');
    
    // Simulate producer-consumer
    const interval = setInterval(() => {
      // Random producer action
      if (Math.random() > 0.5 && buffer.length < bufferSize) {
        const item = Math.floor(Math.random() * 100);
        setBuffer(prev => [...prev, item]);
        setProduced(prev => prev + 1);
        addLog(`✅ Producer: Added item ${item} to buffer`);
      }
      
      // Random consumer action
      if (Math.random() > 0.5 && buffer.length > 0) {
        setBuffer(prev => {
          const item = prev[0];
          addLog(`🔽 Consumer: Removed item ${item} from buffer`);
          setConsumed(c => c + 1);
          return prev.slice(1);
        });
      }
    }, 1000);

    // Store interval ID for cleanup
    window.pcInterval = interval;
  };

  const stopProducerConsumer = () => {
    setIsRunning(false);
    if (window.pcInterval) {
      clearInterval(window.pcInterval);
      window.pcInterval = null;
    }
    addLog('⏹️ Simulation stopped');
  };

  const startDiningPhilosophers = () => {
    setIsRunning(true);
    setPhilosophers([
      { id: 0, state: 'thinking', meals: 0 },
      { id: 1, state: 'thinking', meals: 0 },
      { id: 2, state: 'thinking', meals: 0 },
      { id: 3, state: 'thinking', meals: 0 },
      { id: 4, state: 'thinking', meals: 0 }
    ]);
    setForks([true, true, true, true, true]);
    setPhilosopherLogs([]);
    addPhilosopherLog('🚀 Dining Philosophers simulation started');

    const interval = setInterval(() => {
      setPhilosophers(prevPhil => {
        const newPhil = [...prevPhil];
        const availableForks = [...forks];
        
        newPhil.forEach((p, i) => {
          const leftFork = i;
          const rightFork = (i + 1) % 5;
          
          if (p.state === 'thinking' && Math.random() > 0.6) {
            // Try to pick up forks
            if (availableForks[leftFork] && availableForks[rightFork]) {
              newPhil[i] = { ...p, state: 'eating' };
              availableForks[leftFork] = false;
              availableForks[rightFork] = false;
              addPhilosopherLog(`🍴 Philosopher ${i} picked up forks ${leftFork} and ${rightFork}`);
            } else {
              newPhil[i] = { ...p, state: 'hungry' };
              addPhilosopherLog(`⏳ Philosopher ${i} is hungry, waiting for forks`);
            }
          } else if (p.state === 'eating' && Math.random() > 0.5) {
            // Finish eating
            newPhil[i] = { ...p, state: 'thinking', meals: p.meals + 1 };
            availableForks[leftFork] = true;
            availableForks[rightFork] = true;
            addPhilosopherLog(`✅ Philosopher ${i} finished eating (${p.meals + 1} meals)`);
          }
        });
        
        setForks(availableForks);
        return newPhil;
      });
    }, 1500);

    window.dpInterval = interval;
  };

  const stopDiningPhilosophers = () => {
    setIsRunning(false);
    if (window.dpInterval) {
      clearInterval(window.dpInterval);
      window.dpInterval = null;
    }
    addPhilosopherLog('⏹️ Simulation stopped');
  };

  useEffect(() => {
    return () => {
      if (window.pcInterval) clearInterval(window.pcInterval);
      if (window.dpInterval) clearInterval(window.dpInterval);
    };
  }, []);

  const getPhilosopherColor = (state) => {
    switch(state) {
      case 'thinking': return '#3282B8';
      case 'hungry': return '#f6ad55';
      case 'eating': return '#38a169';
      default: return '#718096';
    }
  };

  const getPhilosopherEmoji = (state) => {
    switch(state) {
      case 'thinking': return '🤔';
      case 'hungry': return '😋';
      case 'eating': return '🍽️';
      default: return '👤';
    }
  };

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      gap: '15px', 
      padding: '15px',
      background: 'linear-gradient(135deg, #BBE1FA 0%, #3282B8 100%)',
      overflow: 'hidden'
    }}>
      
      {/* LEFT SECTION - 30% - Control Panel */}
      <div style={{ 
        width: '30%', 
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        overflow: 'hidden'
      }}>
        
        {/* Demo Selector */}
        <div style={{ 
          padding: '15px', 
          background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(15, 76, 117, 0.2)',
          border: '2px solid rgba(50, 130, 184, 0.3)'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '15px',
            fontSize: '1.3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #0F4C75 0%, #3282B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🔄 Synchronization
          </h2>

          <div style={{ 
            height: '2px', 
            background: 'linear-gradient(90deg, #0F4C75 0%, #3282B8 100%)',
            margin: '12px 0',
            borderRadius: '2px'
          }} />

          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2d3748' }}>
              Select Demo
            </Form.Label>
            <Form.Select 
              value={activeDemo} 
              onChange={(e) => {
                if (isRunning) {
                  activeDemo === 'producer-consumer' ? stopProducerConsumer() : stopDiningPhilosophers();
                }
                setActiveDemo(e.target.value);
              }}
              style={{ 
                fontSize: '0.85rem',
                border: '2px solid #3282B8',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              <option value="producer-consumer">🏭 Producer-Consumer Problem</option>
              <option value="dining-philosophers">🍽️ Dining Philosophers Problem</option>
            </Form.Select>
          </Form.Group>

          {/* Producer-Consumer Controls */}
          {activeDemo === 'producer-consumer' && (
            <>
              <Form.Group className="mb-2">
                <Form.Label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2d3748' }}>
                  Number of Producers
                </Form.Label>
                <Form.Control 
                  type="number" 
                  min="1" 
                  max="5"
                  value={numProducers}
                  onChange={(e) => setNumProducers(parseInt(e.target.value) || 1)}
                  disabled={isRunning}
                  style={{ 
                    fontSize: '0.8rem',
                    border: '2px solid #3282B8',
                    borderRadius: '8px'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2d3748' }}>
                  Number of Consumers
                </Form.Label>
                <Form.Control 
                  type="number" 
                  min="1" 
                  max="5"
                  value={numConsumers}
                  onChange={(e) => setNumConsumers(parseInt(e.target.value) || 1)}
                  disabled={isRunning}
                  style={{ 
                    fontSize: '0.8rem',
                    border: '2px solid #3282B8',
                    borderRadius: '8px'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2d3748' }}>
                  Buffer Size
                </Form.Label>
                <Form.Control 
                  type="number" 
                  min="1" 
                  max="10"
                  value={bufferSize}
                  onChange={(e) => setBufferSize(parseInt(e.target.value) || 1)}
                  disabled={isRunning}
                  style={{ 
                    fontSize: '0.8rem',
                    border: '2px solid #3282B8',
                    borderRadius: '8px'
                  }}
                />
              </Form.Group>
            </>
          )}

          <Button 
            onClick={() => {
              if (isRunning) {
                activeDemo === 'producer-consumer' ? stopProducerConsumer() : stopDiningPhilosophers();
              } else {
                activeDemo === 'producer-consumer' ? startProducerConsumer() : startDiningPhilosophers();
              }
            }}
            style={{ 
              width: '100%', 
              background: isRunning 
                ? 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)'
                : 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 4px 15px rgba(50, 130, 184, 0.4)',
              transition: 'all 0.3s',
              marginBottom: '8px'
            }}
          >
            {isRunning ? '⏹️ Stop Simulation' : '▶️ Start Simulation'}
          </Button>

          <Button 
            onClick={() => {
              if (activeDemo === 'producer-consumer') {
                setBuffer([]);
                setProduced(0);
                setConsumed(0);
                setLogs([]);
              } else {
                setPhilosophers([
                  { id: 0, state: 'thinking', meals: 0 },
                  { id: 1, state: 'thinking', meals: 0 },
                  { id: 2, state: 'thinking', meals: 0 },
                  { id: 3, state: 'thinking', meals: 0 },
                  { id: 4, state: 'thinking', meals: 0 }
                ]);
                setForks([true, true, true, true, true]);
                setPhilosopherLogs([]);
              }
            }}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #1B262C 0%, #0F4C75 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: 'white',
              transition: 'all 0.3s'
            }}
          >
            🔄 Reset
          </Button>
        </div>

        {/* Statistics */}
        <div style={{ 
          padding: '12px', 
          background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(15, 76, 117, 0.2)',
          border: '2px solid rgba(50, 130, 184, 0.3)',
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ 
            fontSize: '0.9rem',
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '8px',
            flexShrink: 0
          }}>
            📊 Statistics
          </h3>

          <div style={{ 
            overflowY: 'auto',
            flex: 1,
            paddingRight: '4px'
          }}
          className="custom-scrollbar">
            {activeDemo === 'producer-consumer' ? (
              <div style={{ fontSize: '0.75rem', color: '#2d3748' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '6px 8px',
                  background: 'rgba(72, 187, 120, 0.15)',
                  borderRadius: '6px',
                  marginBottom: '5px',
                  border: '2px solid #38a169',
                  minHeight: '36px'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.75rem' }}>✅ Produced:</span>
                  <span style={{ color: '#38a169', fontWeight: 'bold', fontSize: '1rem' }}>{produced}</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '6px 8px',
                  background: 'rgba(255, 107, 107, 0.15)',
                  borderRadius: '6px',
                  marginBottom: '5px',
                  border: '2px solid #e53e3e',
                  minHeight: '36px'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.75rem' }}>🔽 Consumed:</span>
                  <span style={{ color: '#e53e3e', fontWeight: 'bold', fontSize: '1rem' }}>{consumed}</span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '6px 8px',
                  background: 'rgba(50, 130, 184, 0.15)',
                  borderRadius: '6px',
                  border: '2px solid #3282B8',
                  minHeight: '36px'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.75rem' }}>📦 Buffer:</span>
                  <span style={{ color: '#0F4C75', fontWeight: 'bold', fontSize: '1rem' }}>
                    {buffer.length} / {bufferSize}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.7rem', color: '#2d3748' }}>
                {philosophers.map((p, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '6px 8px',
                    background: `rgba(${p.state === 'eating' ? '72, 187, 120' : p.state === 'hungry' ? '246, 173, 85' : '50, 130, 184'}, 0.15)`,
                    borderRadius: '6px',
                    marginBottom: '5px',
                    border: `2px solid ${getPhilosopherColor(p.state)}`,
                    minHeight: '36px'
                  }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
                      {getPhilosopherEmoji(p.state)} P{i}:
                    </span>
                    <span style={{ 
                      color: getPhilosopherColor(p.state), 
                      fontWeight: 'bold',
                      fontSize: '0.7rem'
                    }}>
                      {p.state} ({p.meals}🍽️)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - 70% - Visualization & Logs */}
      <div style={{ 
        width: '70%', 
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        overflow: 'hidden'
      }}>
        
        {/* Visualization */}
        <div style={{ 
          padding: '20px', 
          background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(15, 76, 117, 0.2)',
          border: '2px solid rgba(50, 130, 184, 0.3)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ 
            marginBottom: '15px',
            fontSize: '1.2rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #0F4C75 0%, #3282B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {activeDemo === 'producer-consumer' ? '🏭 Buffer Visualization' : '🍽️ Philosophers Table'}
          </h3>

          <div style={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '20px'
          }}>
            {activeDemo === 'producer-consumer' ? (
              <div style={{ width: '100%', maxWidth: '600px' }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '10px',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  {Array(bufferSize).fill(0).map((_, i) => (
                    <div key={i} style={{ 
                      width: '80px',
                      height: '80px',
                      border: '3px solid #3282B8',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      background: buffer[i] !== undefined 
                        ? 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)' 
                        : 'rgba(187, 225, 250, 0.3)',
                      color: buffer[i] !== undefined ? 'white' : '#cbd5e0',
                      transition: 'all 0.3s',
                      boxShadow: buffer[i] !== undefined ? '0 4px 15px rgba(50, 130, 184, 0.4)' : 'none'
                    }}>
                      {buffer[i] !== undefined ? buffer[i] : '□'}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative', width: '400px', height: '400px' }}>
                {/* Table */}
                <div style={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
                  boxShadow: '0 8px 32px rgba(50, 130, 184, 0.4)',
                  border: '5px solid #0F4C75'
                }} />

                {/* Philosophers */}
                {philosophers.map((p, i) => {
                  const angle = (i * 72 - 90) * (Math.PI / 180);
                  const radius = 160;
                  const x = 200 + radius * Math.cos(angle);
                  const y = 200 + radius * Math.sin(angle);
                  
                  return (
                    <div key={i} style={{ 
                      position: 'absolute',
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)',
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: getPhilosopherColor(p.state),
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '1.5rem',
                      border: '3px solid white',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s'
                    }}>
                      {getPhilosopherEmoji(p.state)}
                      <div style={{ fontSize: '0.6rem', color: 'white', fontWeight: 'bold', marginTop: '2px' }}>
                        P{i}
                      </div>
                    </div>
                  );
                })}

                {/* Forks */}
                {forks.map((available, i) => {
                  const angle = (i * 72 - 54) * (Math.PI / 180);
                  const radius = 120;
                  const x = 200 + radius * Math.cos(angle);
                  const y = 200 + radius * Math.sin(angle);
                  
                  return (
                    <div key={i} style={{ 
                      position: 'absolute',
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)',
                      fontSize: '1.5rem',
                      filter: available ? 'none' : 'grayscale(100%) opacity(0.5)',
                      transition: 'all 0.3s'
                    }}>
                      🍴
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Event Logs */}
        <div style={{ 
          padding: '20px', 
          background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(15, 76, 117, 0.2)',
          border: '2px solid rgba(50, 130, 184, 0.3)',
          height: '200px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ 
            marginBottom: '10px',
            fontSize: '1rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #0F4C75 0%, #3282B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📝 Event Logs
          </h3>

          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            background: '#1B262C',
            borderRadius: '8px',
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '0.75rem'
          }}
          className="custom-scrollbar">
            {(activeDemo === 'producer-consumer' ? logs : philosopherLogs).map((log, i) => (
              <div key={i} style={{ 
                color: '#BBE1FA',
                marginBottom: '4px',
                padding: '4px 8px',
                background: 'rgba(187, 225, 250, 0.1)',
                borderRadius: '4px',
                borderLeft: '3px solid #3282B8'
              }}>
                <span style={{ color: '#0F4C75', fontWeight: 'bold' }}>[{log.time}]</span> {log.message}
              </div>
            ))}
            {(activeDemo === 'producer-consumer' ? logs : philosopherLogs).length === 0 && (
              <div style={{ color: '#718096', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
                No events yet. Start the simulation to see logs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Synchronization;
