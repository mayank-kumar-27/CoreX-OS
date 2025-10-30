import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useAppContext } from '../context/AppContext';

function MemoryManagement() {
  const { memory, setMemory, setMemoryAlgorithm } = useAppContext();
  
  const [numFrames, setNumFrames] = useState(3);
  const [referenceString, setReferenceString] = useState('');
  
  // Read from global state instead of local state
  const executionSteps = memory.executionSteps || [];
  const localStats = memory.stats || null;

  const simulatePageReplacement = () => {
    if (!referenceString.trim()) {
      alert('Please enter a page reference string!');
      return;
    }

    // Parse reference string (comma or space separated)
    const pages = referenceString
      .split(/[\s,]+/)
      .map(p => parseInt(p.trim()))
      .filter(p => !isNaN(p));

    if (pages.length === 0) {
      alert('Invalid page reference string!');
      return;
    }

    let frameArray = Array(numFrames).fill(null);
    let faults = 0;
    let hits = 0;
    let steps = [];
    let queue = []; // For FIFO
    let recentlyUsed = []; // For LRU

    pages.forEach((page, index) => {
      let isFault = false;

      if (frameArray.includes(page)) {
        // Page Hit
        hits++;
        if (memory.algorithm === 'LRU') {
          // Update recently used
          recentlyUsed = recentlyUsed.filter(p => p !== page);
          recentlyUsed.push(page);
        }
      } else {
        // Page Fault
        faults++;
        isFault = true;

        const emptyIndex = frameArray.indexOf(null);
        
        if (emptyIndex !== -1) {
          // Empty frame available
          frameArray[emptyIndex] = page;
          if (memory.algorithm === 'FIFO') queue.push(page);
          if (memory.algorithm === 'LRU') recentlyUsed.push(page);
        } else {
          // Need to replace a page
          let replaceIndex = 0;

          if (memory.algorithm === 'FIFO') {
            const pageToReplace = queue.shift();
            replaceIndex = frameArray.indexOf(pageToReplace);
            queue.push(page);
          } else if (memory.algorithm === 'LRU') {
            const lruPage = recentlyUsed.shift();
            replaceIndex = frameArray.indexOf(lruPage);
            recentlyUsed.push(page);
          } else if (memory.algorithm === 'OPTIMAL') {
            // Find page not used for longest time in future
            let farthest = -1;
            let replaceIdx = 0;

            for (let i = 0; i < frameArray.length; i++) {
              let j;
              for (j = index + 1; j < pages.length; j++) {
                if (frameArray[i] === pages[j]) {
                  if (j > farthest) {
                    farthest = j;
                    replaceIdx = i;
                  }
                  break;
                }
              }
              // Page not found in future references - replace this one
              if (j === pages.length) {
                replaceIdx = i;
                break;
              }
            }
            replaceIndex = replaceIdx;
          }

          frameArray[replaceIndex] = page;
        }
      }

      steps.push({
        step: index + 1,
        page: page,
        frames: [...frameArray],
        isFault: isFault,
        status: isFault ? 'Fault' : 'Hit'
      });
    });

    const hitRatio = pages.length > 0 ? ((hits / pages.length) * 100).toFixed(2) : '0.00';
    const faultRatio = pages.length > 0 ? ((faults / pages.length) * 100).toFixed(2) : '0.00';

    const calculatedStats = {
      totalReferences: pages.length,
      pageFaults: faults,
      pageHits: hits,
      hitRatio: hitRatio,
      faultRatio: faultRatio,
      algorithm: memory.algorithm,
      frames: numFrames
    };
    
    // Update global memory state for Dashboard
    setMemory({
      ...memory,
      executionSteps: steps,
      stats: calculatedStats,
      page_faults: faults,
      page_hits: hits,
      used_frames: frameArray.filter(f => f !== null).length,
      frames: frameArray.filter(f => f !== null)
    });
  };

  const clearSimulation = () => {
    setReferenceString('');
    setMemory(prev => ({
      ...prev,
      executionSteps: [],
      stats: null
    }));
  };

  const loadExample = () => {
    setReferenceString('7 0 1 2 0 3 0 4 2 3 0 3 2');
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
      
      {/* LEFT SECTION - 25% - Configuration */}
      <div style={{ 
        width: '25%', 
        padding: '15px', 
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(15, 76, 117, 0.2)',
        border: '2px solid rgba(50, 130, 184, 0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '15px',
          fontSize: '1.3rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #0F4C75 0%, #3282B8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 10px rgba(50, 130, 184, 0.3)'
        }}>
          🧠 Memory Management
        </h2>

        <div style={{ 
          height: '2px', 
          background: 'linear-gradient(90deg, #0F4C75 0%, #3282B8 100%)',
          margin: '12px 0',
          borderRadius: '2px'
        }} />

        <h3 className="mb-2" style={{ 
          color: '#2d3748', 
          borderBottom: '2px solid #3282B8', 
          paddingBottom: '6px',
          fontSize: '1.1rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Configuration
        </h3>

        <Form style={{ marginBottom: '15px' }}>
          <Form.Group className="mb-2">
            <Form.Label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2d3748' }}>
              Algorithm
            </Form.Label>
            <Form.Select 
              value={memory.algorithm} 
              onChange={(e) => setMemoryAlgorithm(e.target.value)}
              style={{ 
                fontSize: '0.8rem',
                border: '2px solid #3282B8',
                borderRadius: '8px'
              }}
            >
              <option value="FIFO">FIFO (First-In-First-Out)</option>
              <option value="LRU">LRU (Least Recently Used)</option>
              <option value="OPTIMAL">OPTIMAL (Optimal Page Replacement)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2d3748' }}>
              Number of Frames
            </Form.Label>
            <Form.Control 
              type="number" 
              min="1" 
              max="10"
              value={numFrames}
              onChange={(e) => setNumFrames(parseInt(e.target.value) || 1)}
              style={{ 
                fontSize: '0.8rem',
                border: '2px solid #3282B8',
                borderRadius: '8px'
              }}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2d3748' }}>
              Page Reference String
            </Form.Label>
            <Form.Control 
              as="textarea"
              rows={3}
              placeholder="e.g., 7 0 1 2 0 3 0 4 2 3 0 3 2"
              value={referenceString}
              onChange={(e) => setReferenceString(e.target.value)}
              style={{ 
                fontSize: '0.8rem',
                border: '2px solid #3282B8',
                borderRadius: '8px',
                resize: 'none'
              }}
            />
            <Form.Text style={{ fontSize: '0.65rem', color: '#718096' }}>
              Enter pages separated by spaces or commas
            </Form.Text>
          </Form.Group>

          <Button 
            onClick={loadExample}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #BBE1FA 0%, #3282B8 100%)',
              border: '2px solid #3282B8',
              borderRadius: '8px',
              padding: '6px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: '#0F4C75',
              marginBottom: '8px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #BBE1FA 0%, #3282B8 100%)';
              e.target.style.color = '#0F4C75';
            }}
          >
            📝 Load Example
          </Button>
        </Form>

        <Button 
          onClick={simulatePageReplacement}
          style={{ 
            width: '100%', 
            background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 4px 15px rgba(50, 130, 184, 0.4)',
            transition: 'all 0.3s',
            transform: 'translateY(0)',
            marginBottom: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(50, 130, 184, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(50, 130, 184, 0.4)';
          }}
        >
          Run Simulation
        </Button>

        <Button 
          onClick={clearSimulation}
          style={{ 
            width: '100%', 
            background: 'linear-gradient(135deg, #1B262C 0%, #0F4C75 100%)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 4px 15px rgba(27, 38, 44, 0.4)',
            transition: 'all 0.3s',
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(27, 38, 44, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(27, 38, 44, 0.4)';
          }}
        >
          Clear
        </Button>
      </div>

      {/* RIGHT SECTION - 75% - Visualization */}
      <div style={{ 
        width: '75%', 
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        overflow: 'hidden'
      }}>
        
        {/* Statistics Section */}
        <div style={{ 
          padding: '15px', 
          background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(15, 76, 117, 0.2)',
          border: '2px solid rgba(50, 130, 184, 0.3)',
          maxHeight: '300px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ 
            marginBottom: '12px',
            fontSize: '1rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #0F4C75 0%, #3282B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Performance Statistics
          </h3>

          {localStats ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px',
              overflowY: 'auto',
              paddingRight: '5px'
            }}
            className="custom-scrollbar">
              {/* First Row - Algorithm and Frames */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '10px'
              }}>
                <div style={{ 
                  padding: '10px 12px',
                  background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
                  borderRadius: '8px',
                  boxShadow: '0 3px 10px rgba(50, 130, 184, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>
                    Algorithm:
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#BBE1FA' }}>
                    {localStats.algorithm}
                  </span>
                </div>

                <div style={{ 
                  padding: '10px 12px',
                  background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
                  borderRadius: '8px',
                  boxShadow: '0 3px 10px rgba(50, 130, 184, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>
                    Frames:
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#BBE1FA' }}>
                    {localStats.frames}
                  </span>
                </div>
              </div>

              {/* Second Row - References */}
              <div style={{ 
                padding: '12px',
                background: 'linear-gradient(135deg, #BBE1FA 0%, #3282B8 30%)',
                borderRadius: '8px',
                boxShadow: '0 3px 10px rgba(50, 130, 184, 0.2)',
                textAlign: 'center',
                border: '2px solid #3282B8'
              }}>
                <div style={{ fontSize: '0.65rem', color: '#1B262C', marginBottom: '3px', fontWeight: '600' }}>
                  📄 Total Page References
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0F4C75' }}>
                  {localStats.totalReferences}
                </div>
              </div>

              {/* Third Row - Faults and Hits */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '10px'
              }}>
                <div style={{ 
                  padding: '12px',
                  background: 'linear-gradient(135deg, rgba(229, 62, 62, 0.15) 0%, rgba(229, 62, 62, 0.05) 100%)',
                  borderRadius: '8px',
                  border: '2px solid #fc8181',
                  textAlign: 'center',
                  boxShadow: '0 3px 10px rgba(229, 62, 62, 0.1)'
                }}>
                  <div style={{ fontSize: '0.65rem', color: '#742a2a', marginBottom: '3px', fontWeight: '600' }}>
                    ❌ Page Faults
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e53e3e' }}>
                    {localStats.pageFaults}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#c53030', fontWeight: '700', marginTop: '3px' }}>
                    {localStats.faultRatio}%
                  </div>
                </div>

                <div style={{ 
                  padding: '12px',
                  background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.15) 0%, rgba(72, 187, 120, 0.05) 100%)',
                  borderRadius: '8px',
                  border: '2px solid #68d391',
                  textAlign: 'center',
                  boxShadow: '0 3px 10px rgba(72, 187, 120, 0.1)'
                }}>
                  <div style={{ fontSize: '0.65rem', color: '#22543d', marginBottom: '3px', fontWeight: '600' }}>
                    ✅ Page Hits
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38a169' }}>
                    {localStats.pageHits}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#2f855a', fontWeight: '700', marginTop: '3px' }}>
                    {localStats.hitRatio}%
                  </div>
                </div>
              </div>

              {/* Fourth Row - Efficiency Bar */}
              <div style={{ 
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '8px',
                border: '2px solid #3282B8'
              }}>
                <div style={{ 
                  fontSize: '0.65rem', 
                  color: '#2d3748', 
                  marginBottom: '6px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  💯 Hit Rate Efficiency
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '24px', 
                  background: '#e2e8f0', 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ 
                    width: `${localStats.hitRatio}%`, 
                    height: '100%', 
                    background: parseFloat(localStats.hitRatio) >= 70 
                      ? 'linear-gradient(90deg, #38a169 0%, #48bb78 100%)'
                      : parseFloat(localStats.hitRatio) >= 40
                      ? 'linear-gradient(90deg, #dd6b20 0%, #ed8936 100%)'
                      : 'linear-gradient(90deg, #e53e3e 0%, #fc8181 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '8px',
                    transition: 'width 0.5s ease',
                    borderRadius: '12px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}>
                    <span style={{ 
                      color: 'white', 
                      fontWeight: 'bold', 
                      fontSize: '0.7rem',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      {localStats.hitRatio}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center',
              padding: '30px 15px',
              color: '#a0aec0',
              fontStyle: 'italic'
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                No statistics available
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '5px' }}>
                Run a simulation to see performance metrics
              </div>
            </div>
          )}
        </div>

        {/* Execution Steps Table */}
        <div style={{ 
          padding: '20px', 
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
            marginBottom: '15px',
            fontSize: '1.2rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #0F4C75 0%, #3282B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📋 Execution Timeline
          </h3>

          {executionSteps.length === 0 ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              fontSize: '1rem',
              color: '#718096',
              fontStyle: 'italic'
            }}>
              Run simulation to see page replacement execution
            </div>
          ) : (
            <div style={{ overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
                    color: 'white'
                  }}>
                    <th style={{ padding: '10px', border: '1px solid #0F4C75' }}>Step</th>
                    <th style={{ padding: '10px', border: '1px solid #0F4C75' }}>Page</th>
                    {Array(numFrames).fill(0).map((_, i) => (
                      <th key={i} style={{ padding: '10px', border: '1px solid #0F4C75' }}>
                        Frame {i}
                      </th>
                    ))}
                    <th style={{ padding: '10px', border: '1px solid #0F4C75' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {executionSteps.map((step, idx) => (
                    <tr key={idx} style={{ 
                      background: step.isFault 
                        ? 'rgba(255, 107, 107, 0.1)' 
                        : 'rgba(72, 187, 120, 0.1)'
                    }}>
                      <td style={{ 
                        padding: '8px', 
                        border: '1px solid #BBE1FA',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}>
                        {step.step}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        border: '1px solid #BBE1FA',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #BBE1FA 0%, #3282B8 30%)',
                        color: '#1B262C'
                      }}>
                        {step.page}
                      </td>
                      {step.frames.map((frame, fi) => (
                        <td key={fi} style={{ 
                          padding: '8px', 
                          border: '1px solid #BBE1FA',
                          textAlign: 'center',
                          fontWeight: frame !== null ? 'bold' : 'normal',
                          color: frame !== null ? '#0F4C75' : '#cbd5e0'
                        }}>
                          {frame !== null ? frame : '-'}
                        </td>
                      ))}
                      <td style={{ 
                        padding: '8px', 
                        border: '1px solid #BBE1FA',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: step.isFault ? '#e53e3e' : '#38a169'
                      }}>
                        {step.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemoryManagement;
