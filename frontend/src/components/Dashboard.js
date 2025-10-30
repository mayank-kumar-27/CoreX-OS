import React from 'react';
import { useAppContext } from '../context/AppContext';

function Dashboard() {
  const { scheduler, memory, fileSystem } = useAppContext();

  return (
    <div style={{ 
      height: '100%', 
      padding: '12px',
      background: 'linear-gradient(135deg, #BBE1FA 0%, #3282B8 100%)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <h1 style={{ 
        margin: '0',
        fontSize: '1.3rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #0F4C75 0%, #3282B8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
        padding: '0'
      }}>
        CoreX OS Dashboard
      </h1>
      
      {/* Main Grid Layout */}
      <div style={{ 
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: 'auto 1fr 1fr',
        gap: '10px',
        overflow: 'hidden'
      }}>
        {/* Top Stats Cards - Row 1 */}
        <div style={{
          padding: '10px',
          background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(15, 76, 117, 0.3)',
          border: '2px solid rgba(187, 225, 250, 0.3)',
          color: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '0.7rem', marginBottom: '4px', opacity: 0.9 }}>
            CPU Utilization
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
            {scheduler.stats.cpu_utilization || 0}%
          </div>
        </div>
        
        <div style={{
          padding: '10px',
          background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(56, 161, 105, 0.3)',
          border: '2px solid rgba(187, 225, 250, 0.3)',
          color: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '0.7rem', marginBottom: '4px', opacity: 0.9 }}>
            Memory Hit Ratio
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
            {memory.page_hits && (memory.page_faults + memory.page_hits) > 0
              ? ((memory.page_hits / (memory.page_faults + memory.page_hits)) * 100).toFixed(1)
              : 0}%
          </div>
        </div>
        
        <div style={{
          padding: '10px',
          background: 'linear-gradient(135deg, #0F4C75 0%, #1B262C 100%)',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(15, 76, 117, 0.3)',
          border: '2px solid rgba(187, 225, 250, 0.3)',
          color: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '0.7rem', marginBottom: '4px', opacity: 0.9 }}>
            Storage Used
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {fileSystem.stats.used_blocks || 0} / {fileSystem.stats.total_blocks || 0}
          </div>
        </div>

        {/* CPU Scheduler - Row 2, Column 1 */}
        <div style={{
          padding: '12px',
          background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(15, 76, 117, 0.2)',
          border: '2px solid rgba(50, 130, 184, 0.3)',
          gridRow: 'span 2',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <h3 style={{ 
            fontSize: '0.9rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #0F4C75 0%, #3282B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 10px 0',
            flexShrink: 0
          }}>
            CPU Scheduler
          </h3>
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '8px',
              flex: 1
            }}>
              <div style={{ 
                padding: '10px',
                background: 'rgba(50, 130, 184, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #3282B8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#2d3748', marginBottom: '4px', fontWeight: '700' }}>
                  Algorithm
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0F4C75' }}>
                  {scheduler.stats.algorithm || 'N/A'}
                </div>
              </div>
              <div style={{ 
                padding: '10px',
                background: 'rgba(50, 130, 184, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #3282B8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#2d3748', marginBottom: '4px', fontWeight: '700' }}>
                  Avg Wait
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F4C75' }}>
                  {scheduler.stats.avg_waiting_time || 0}<span style={{ fontSize: '0.85rem' }}> ms</span>
                </div>
              </div>
              <div style={{ 
                padding: '10px',
                background: 'rgba(50, 130, 184, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #3282B8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#2d3748', marginBottom: '4px', fontWeight: '700' }}>
                  Avg TAT
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F4C75' }}>
                  {scheduler.stats.avg_turnaround_time || 0}<span style={{ fontSize: '0.85rem' }}> ms</span>
                </div>
              </div>
              <div style={{ 
                padding: '10px',
                background: 'rgba(50, 130, 184, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #3282B8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#2d3748', marginBottom: '4px', fontWeight: '700' }}>
                  CPU Utilization
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F4C75' }}>
                  {scheduler.stats.cpu_utilization || 0}<span style={{ fontSize: '0.85rem' }}> %</span>
                </div>
              </div>
            </div>
            <div style={{ 
              padding: '8px 10px',
              background: 'rgba(50, 130, 184, 0.05)',
              borderRadius: '6px',
              fontSize: '0.68rem',
              color: '#4a5568',
              lineHeight: '1.4',
              borderLeft: '3px solid #3282B8',
              flexShrink: 0
            }}>
              <strong>Info:</strong> Manages process execution using FCFS, SJF, Round Robin, and Priority algorithms for optimal CPU utilization.
            </div>
          </div>
        </div>

        {/* Memory Management - Row 2, Column 2 */}
        <div style={{
          padding: '12px',
          background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(15, 76, 117, 0.2)',
          border: '2px solid rgba(50, 130, 184, 0.3)',
          gridRow: 'span 2',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <h3 style={{ 
            fontSize: '0.9rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #0F4C75 0%, #3282B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 10px 0',
            flexShrink: 0
          }}>
            🧠 Memory Management
          </h3>
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '8px',
              flex: 1
            }}>
              <div style={{ 
                padding: '10px',
                background: 'rgba(50, 130, 184, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #3282B8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#2d3748', marginBottom: '4px', fontWeight: '700' }}>
                  Algorithm
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0F4C75' }}>
                  {memory.algorithm || 'N/A'}
                </div>
              </div>
              <div style={{ 
                padding: '10px',
                background: 'rgba(229, 62, 62, 0.15)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #fc8181',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#742a2a', marginBottom: '4px', fontWeight: '700' }}>
                  Page Faults
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#c53030' }}>
                  {memory.page_faults || 0}
                </div>
              </div>
              <div style={{ 
                padding: '10px',
                background: 'rgba(72, 187, 120, 0.15)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #68d391',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#22543d', marginBottom: '4px', fontWeight: '700' }}>
                  Page Hits
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#2f855a' }}>
                  {memory.page_hits || 0}
                </div>
              </div>
              <div style={{ 
                padding: '10px',
                background: 'rgba(50, 130, 184, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #3282B8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#2d3748', marginBottom: '4px', fontWeight: '700' }}>
                  Frames Used
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0F4C75' }}>
                  {memory.used_frames || 0} / {memory.total_frames || 0}
                </div>
              </div>
            </div>
            <div style={{ 
              padding: '8px 10px',
              background: 'rgba(50, 130, 184, 0.05)',
              borderRadius: '6px',
              fontSize: '0.68rem',
              color: '#4a5568',
              lineHeight: '1.4',
              borderLeft: '3px solid #38a169',
              flexShrink: 0
            }}>
              <strong>Info:</strong> Implements FIFO, LRU, and Optimal page replacement algorithms with {memory.total_frames || 256} frames for efficient memory usage.
            </div>
          </div>
        </div>

        {/* File System Status - Row 2-3, Column 3 */}
        <div style={{
          padding: '12px',
          background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(15, 76, 117, 0.2)',
          border: '2px solid rgba(50, 130, 184, 0.3)',
          gridRow: 'span 2',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <h3 style={{ 
            fontSize: '0.9rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #0F4C75 0%, #3282B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 10px 0',
            flexShrink: 0
          }}>
            File System Status
          </h3>
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '8px',
              flex: 1
            }}>
              <div style={{ 
                padding: '10px',
                background: 'rgba(50, 130, 184, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #3282B8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#2d3748', marginBottom: '4px', fontWeight: '700' }}>
                  Total Inodes
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F4C75' }}>
                  {fileSystem.stats.total_inodes || 0}
                </div>
              </div>
              <div style={{ 
                padding: '10px',
                background: 'rgba(50, 130, 184, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #3282B8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#2d3748', marginBottom: '4px', fontWeight: '700' }}>
                  Used Inodes
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F4C75' }}>
                  {fileSystem.stats.used_inodes || 0}
                </div>
              </div>
              <div style={{ 
                padding: '10px',
                background: 'rgba(50, 130, 184, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #3282B8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#2d3748', marginBottom: '4px', fontWeight: '700' }}>
                  Total Blocks
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F4C75' }}>
                  {fileSystem.stats.total_blocks || 0}
                </div>
              </div>
              <div style={{ 
                padding: '10px',
                background: 'rgba(50, 130, 184, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #3282B8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#2d3748', marginBottom: '4px', fontWeight: '700' }}>
                  Block Size
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F4C75' }}>
                  {fileSystem.stats.block_size || 0}<span style={{ fontSize: '0.85rem' }}>B</span>
                </div>
              </div>
            </div>
            <div style={{ 
              padding: '8px 10px',
              background: 'rgba(50, 130, 184, 0.05)',
              borderRadius: '6px',
              fontSize: '0.68rem',
              color: '#4a5568',
              lineHeight: '1.4',
              borderLeft: '3px solid #0F4C75',
              flexShrink: 0
            }}>
              <strong>Info:</strong> Virtual File System with hierarchical directory structure supporting file creation, deletion, and navigation operations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
