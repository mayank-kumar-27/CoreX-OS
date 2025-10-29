import React, { createContext, useState, useContext } from 'react';

// Create Context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Provider Component
export const AppProvider = ({ children }) => {
  // Active tab state
  const [activeTab, setActiveTab] = useState('dashboard');

  // File System State
  const [fileSystem, setFileSystem] = useState({
    currentPath: '/',
    files: [
      { name: 'documents', type: 'directory', size: 0, children: [
        { name: 'project_proposal.txt', type: 'file', size: 2048 },
        { name: 'system_design.md', type: 'file', size: 4096 },
        { name: 'meeting_notes.txt', type: 'file', size: 1024 }
      ]},
      { name: 'programs', type: 'directory', size: 0, children: [
        { name: 'cpu_scheduler.c', type: 'file', size: 8192 },
        { name: 'memory_manager.c', type: 'file', size: 6144 },
        { name: 'file_system.c', type: 'file', size: 5120 }
      ]},
      { name: 'config', type: 'directory', size: 0, children: [
        { name: 'system.conf', type: 'file', size: 512 },
        { name: 'network.conf', type: 'file', size: 256 },
        { name: 'security_policy.json', type: 'file', size: 1536 }
      ]},
      { name: 'logs', type: 'directory', size: 0, children: [
        { name: 'system_log.txt', type: 'file', size: 10240 },
        { name: 'error_log.txt', type: 'file', size: 3072 },
        { name: 'access_log.txt', type: 'file', size: 7168 }
      ]},
      { name: 'temp', type: 'directory', size: 0, children: []},
      { name: 'README.md', type: 'file', size: 2048 },
      { name: 'LICENSE.txt', type: 'file', size: 1024 },
      { name: 'user_manual.pdf', type: 'file', size: 524288 }
    ],
    stats: {
      total_inodes: 256,
      used_inodes: 23,
      total_blocks: 1024,
      used_blocks: 89,
      block_size: 4096
    }
  });

  // Scheduler State
  const [scheduler, setScheduler] = useState({
    processes: [],
    ganttChart: [],
    stats: {
      algorithm: 'FCFS',
      avg_waiting_time: 0,
      avg_turnaround_time: 0,
      avg_response_time: 0,
      cpu_utilization: 0
    },
    isRunning: false
  });

  // Memory Management State
  const [memory, setMemory] = useState({
    algorithm: 'LRU',
    frames: [],
    page_faults: 0,
    page_hits: 0,
    total_frames: 256,
    used_frames: 0,
    sequences: []
  });

  // Synchronization State
  const [synchronization, setSynchronization] = useState({
    producerConsumer: {
      buffer: [],
      bufferSize: 10,
      events: []
    },
    diningPhilosophers: {
      philosophers: [
        { id: 0, state: 'thinking' },
        { id: 1, state: 'thinking' },
        { id: 2, state: 'thinking' },
        { id: 3, state: 'thinking' },
        { id: 4, state: 'thinking' }
      ],
      events: []
    }
  });

  // Terminal History
  const [terminalHistory, setTerminalHistory] = useState([
    { text: 'CoreX OS Terminal v1.0', type: 'system' },
    { text: 'Type "help" for available commands', type: 'system' },
    { text: '', type: 'normal' }
  ]);

  // Notification System
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // File System Operations
  const createFile = (path, name, type = 'file') => {
    setFileSystem(prev => {
      const newFiles = JSON.parse(JSON.stringify(prev.files)); // Deep copy to avoid mutations
      const targetPath = path === '/' ? newFiles : getDirectoryByPath(newFiles, path);
      
      // Check if file/directory already exists
      const exists = targetPath.find(f => f.name === name);
      if (exists) {
        return prev; // Don't create duplicate
      }
      
      if (type === 'file') {
        targetPath.push({ name, type: 'file', size: 0, content: '' });
      } else {
        targetPath.push({ name, type: 'directory', size: 0, children: [] });
      }
      
      return {
        ...prev,
        files: newFiles,
        stats: {
          ...prev.stats,
          used_inodes: prev.stats.used_inodes + 1,
          used_blocks: prev.stats.used_blocks + (type === 'file' ? 1 : 0)
        }
      };
    });
  };

  const deleteFile = (path, name) => {
    setFileSystem(prev => {
      const newFiles = JSON.parse(JSON.stringify(prev.files)); // Deep copy to avoid mutations
      const targetPath = path === '/' ? newFiles : getDirectoryByPath(newFiles, path);
      const index = targetPath.findIndex(f => f.name === name);
      
      if (index !== -1) {
        targetPath.splice(index, 1);
        
        return {
          ...prev,
          files: newFiles,
          stats: {
            ...prev.stats,
            used_inodes: prev.stats.used_inodes - 1
          }
        };
      }
      return prev;
    });
  };

  const getDirectoryByPath = (files, path) => {
    const parts = path.split('/').filter(p => p);
    let current = files;
    
    for (const part of parts) {
      const dir = current.find(f => f.name === part && f.type === 'directory');
      if (dir && dir.children) {
        current = dir.children;
      } else {
        return current;
      }
    }
    return current;
  };

  const getFilesAtPath = (path) => {
    if (path === '/') return fileSystem.files;
    return getDirectoryByPath(fileSystem.files, path);
  };

  // Scheduler Operations
  const addProcess = (process) => {
    setScheduler(prev => ({
      ...prev,
      processes: [...prev.processes, { ...process, pid: prev.processes.length }]
    }));
    // addNotification(`Process "${process.name}" added`, 'success');
  };

  const removeProcess = (pid) => {
    setScheduler(prev => ({
      ...prev,
      processes: prev.processes.filter(p => p.pid !== pid)
    }));
    // addNotification(`Process removed`, 'info');
  };

  const clearAllProcesses = () => {
    setScheduler(prev => ({
      ...prev,
      processes: [],
      ganttChart: [],
      stats: {
        algorithm: prev.stats.algorithm,
        avg_waiting_time: 0,
        avg_turnaround_time: 0,
        avg_response_time: 0,
        cpu_utilization: 0
      }
    }));
    // addNotification('All processes cleared', 'info');
  };

  const runScheduler = (algorithm) => {
    if (scheduler.processes.length === 0) {
      // addNotification('No processes to schedule!', 'error');
      return false;
    }

    // Simple scheduling simulation
    let ganttChart = [];
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let totalResponseTime = 0;

    // Sort processes based on algorithm
    let processList = [...scheduler.processes];
    
    if (algorithm === 'fcfs') {
      processList.sort((a, b) => a.arrival_time - b.arrival_time);
    } else if (algorithm === 'sjf') {
      processList.sort((a, b) => a.burst_time - b.burst_time);
    } else if (algorithm === 'priority') {
      processList.sort((a, b) => b.priority - a.priority);
    }

    processList.forEach((process) => {
      const startTime = Math.max(currentTime, process.arrival_time);
      const endTime = startTime + process.burst_time;
      const waitingTime = startTime - process.arrival_time;
      const turnaroundTime = endTime - process.arrival_time;
      const responseTime = waitingTime;

      ganttChart.push({
        pid: process.pid,
        name: process.name,
        start: startTime,
        end: endTime
      });

      totalWaitingTime += waitingTime;
      totalTurnaroundTime += turnaroundTime;
      totalResponseTime += responseTime;

      currentTime = endTime;
    });

    const processCount = processList.length;
    const cpuUtilization = ((ganttChart[ganttChart.length - 1].end - ganttChart[0].start) / currentTime) * 100;

    setScheduler(prev => ({
      ...prev,
      ganttChart,
      stats: {
        algorithm: algorithm.toUpperCase(),
        avg_waiting_time: (totalWaitingTime / processCount).toFixed(2),
        avg_turnaround_time: (totalTurnaroundTime / processCount).toFixed(2),
        avg_response_time: (totalResponseTime / processCount).toFixed(2),
        cpu_utilization: cpuUtilization.toFixed(1)
      },
      isRunning: true
    }));

    // addNotification(`${algorithm.toUpperCase()} scheduling completed`, 'success');
    return true;
  };

  // Memory Operations
  const accessPage = (pageNumber) => {
    setMemory(prev => {
      const newFrames = [...prev.frames];
      const isHit = newFrames.includes(pageNumber);

      if (isHit) {
        // Page hit - update LRU order if using LRU
        if (prev.algorithm === 'LRU') {
          const index = newFrames.indexOf(pageNumber);
          newFrames.splice(index, 1);
          newFrames.push(pageNumber);
        }
        
        return {
          ...prev,
          frames: newFrames,
          page_hits: prev.page_hits + 1,
          sequences: [...prev.sequences, { page: pageNumber, hit: true }]
        };
      } else {
        // Page fault
        if (newFrames.length >= prev.total_frames) {
          // Replace page based on algorithm
          if (prev.algorithm === 'FIFO') {
            newFrames.shift();
          } else if (prev.algorithm === 'LRU') {
            newFrames.shift();
          }
        }
        
        newFrames.push(pageNumber);
        
        return {
          ...prev,
          frames: newFrames,
          page_faults: prev.page_faults + 1,
          used_frames: newFrames.length,
          sequences: [...prev.sequences, { page: pageNumber, hit: false }]
        };
      }
    });
  };

  const setMemoryAlgorithm = (algorithm) => {
    setMemory(prev => ({
      ...prev,
      algorithm: algorithm,
      frames: [],
      page_faults: 0,
      page_hits: 0,
      used_frames: 0,
      sequences: []
    }));
    // addNotification(`Memory algorithm changed to ${algorithm}`, 'info');
  };

  // Terminal command handler
  const executeTerminalCommand = (command) => {
    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let response = { success: false, output: '', error: '' };

    switch (cmd) {
      case 'help':
        response = {
          success: true,
          output: `Available Commands:
  
File System:
  ls [path]          - List directory contents
  cd <path>          - Change directory
  pwd                - Print working directory
  mkdir <name>       - Create directory
  touch <name>       - Create file
  rm <name>          - Remove file/directory
  cat <file>         - Display file contents
  
Scheduler:
  ps                 - List all processes
  addproc <name> <arrival> <burst> <priority> - Add process
  schedule <algo>    - Run scheduler (fcfs|sjf|rr|priority)
  gantt              - Show Gantt chart
  clearproc          - Clear all processes
  
Memory:
  meminfo            - Show memory statistics
  accesspage <num>   - Access memory page
  memalgo <algo>     - Set algorithm (fifo|lru|optimal)
  
Navigation:
  changetab <tab>    - Switch to tab (dashboard|scheduler|memory|filesystem|sync|terminal)
  
Utilities:
  echo <text>        - Display text
  clear              - Clear terminal
  help               - Show this help
  exit               - Exit terminal`
        };
        break;

      case 'ls':
        const path = args[0] || fileSystem.currentPath;
        const files = getFilesAtPath(path);
        response = {
          success: true,
          output: files.map(f => `${f.type === 'directory' ? '📁' : '📄'} ${f.name} ${f.type === 'file' ? `(${(f.size / 1024).toFixed(1)} KB)` : ''}`).join('\n')
        };
        break;

      case 'mkdir':
        if (args.length === 0) {
          response = { success: false, error: 'Usage: mkdir <directory_name>' };
        } else {
          createFile(fileSystem.currentPath, args[0], 'directory');
          response = { success: true, output: `Directory "${args[0]}" created` };
        }
        break;

      case 'touch':
        if (args.length === 0) {
          response = { success: false, error: 'Usage: touch <filename>' };
        } else {
          createFile(fileSystem.currentPath, args[0], 'file');
          response = { success: true, output: `File "${args[0]}" created` };
        }
        break;

      case 'rm':
        if (args.length === 0) {
          response = { success: false, error: 'Usage: rm <filename>' };
        } else {
          deleteFile(fileSystem.currentPath, args[0]);
          response = { success: true, output: `"${args[0]}" removed` };
        }
        break;

      case 'cd':
        if (args.length === 0) {
          response = { success: false, error: 'Usage: cd <path>' };
        } else {
          const targetPath = args[0];
          if (targetPath === '/' || targetPath === '~') {
            setFileSystem(prev => ({ ...prev, currentPath: '/' }));
            response = { success: true, output: 'Changed to root directory' };
          } else if (targetPath === '..') {
            const pathParts = fileSystem.currentPath.split('/').filter(p => p);
            pathParts.pop();
            const newPath = '/' + pathParts.join('/');
            setFileSystem(prev => ({ ...prev, currentPath: newPath || '/' }));
            response = { success: true, output: `Changed to ${newPath || '/'}` };
          } else {
            // Check if directory exists
            const fullPath = fileSystem.currentPath === '/' 
              ? `/${targetPath}` 
              : `${fileSystem.currentPath}/${targetPath}`;
            const files = getFilesAtPath(fileSystem.currentPath);
            const targetDir = files.find(f => f.name === targetPath && f.type === 'directory');
            
            if (targetDir) {
              setFileSystem(prev => ({ ...prev, currentPath: fullPath }));
              response = { success: true, output: `Changed to ${fullPath}` };
            } else {
              response = { success: false, error: `Directory "${targetPath}" not found` };
            }
          }
        }
        break;

      case 'pwd':
        response = { 
          success: true, 
          output: fileSystem.currentPath || '/' 
        };
        break;

      case 'cat':
        if (args.length === 0) {
          response = { success: false, error: 'Usage: cat <filename>' };
        } else {
          const files = getFilesAtPath(fileSystem.currentPath);
          const file = files.find(f => f.name === args[0] && f.type === 'file');
          
          if (file) {
            response = { 
              success: true, 
              output: file.content || `[Content of ${args[0]}]\nThis is a simulated file in CoreX OS.\nUse this file for demonstration purposes.`
            };
          } else {
            response = { success: false, error: `File "${args[0]}" not found` };
          }
        }
        break;

      case 'ps':
        if (scheduler.processes.length === 0) {
          response = { success: true, output: 'No processes currently running' };
        } else {
          response = {
            success: true,
            output: `PID  NAME          ARRIVAL  BURST  PRIORITY\n` +
                   scheduler.processes.map(p => 
                     `${String(p.pid).padEnd(4)} ${String(p.name).padEnd(13)} ${String(p.arrival_time).padEnd(8)} ${String(p.burst_time).padEnd(6)} ${p.priority}`
                   ).join('\n')
          };
        }
        break;

      case 'gantt':
        if (scheduler.ganttChart.length === 0) {
          response = { success: false, error: 'No scheduler data available. Run a scheduler first using "schedule <algorithm>"' };
        } else {
          setActiveTab('scheduler');
          response = { success: true, output: 'Switching to Scheduler tab to display Gantt chart...' };
        }
        break;

      case 'schedule':
        if (args.length === 0) {
          response = { success: false, error: 'Usage: schedule <algorithm> (fcfs|sjf|rr|priority)' };
        } else {
          const algo = args[0].toLowerCase();
          if (['fcfs', 'sjf', 'rr', 'priority'].includes(algo)) {
            const success = runScheduler(algo);
            if (success) {
              response = { success: true, output: `${algo.toUpperCase()} scheduling completed. Type "gantt" to view chart.` };
            } else {
              response = { success: false, error: 'No processes to schedule' };
            }
          } else {
            response = { success: false, error: 'Invalid algorithm. Use: fcfs, sjf, rr, or priority' };
          }
        }
        break;

      case 'addproc':
        if (args.length < 4) {
          response = { success: false, error: 'Usage: addproc <name> <arrival_time> <burst_time> <priority>' };
        } else {
          addProcess({
            name: args[0],
            arrival_time: parseInt(args[1]),
            burst_time: parseInt(args[2]),
            priority: parseInt(args[3])
          });
          response = { success: true, output: `Process "${args[0]}" added successfully` };
        }
        break;

      case 'clearproc':
        clearAllProcesses();
        response = { success: true, output: 'All processes cleared' };
        break;

      case 'meminfo':
        const hitRatio = memory.page_hits / Math.max(1, memory.page_faults + memory.page_hits) * 100;
        response = {
          success: true,
          output: `Memory Statistics:
Algorithm:    ${memory.algorithm}
Total Frames: ${memory.total_frames}
Used Frames:  ${memory.used_frames}
Page Faults:  ${memory.page_faults}
Page Hits:    ${memory.page_hits}
Hit Ratio:    ${hitRatio.toFixed(2)}%`
        };
        break;

      case 'accesspage':
        if (args.length === 0) {
          response = { success: false, error: 'Usage: accesspage <page_number>' };
        } else {
          accessPage(parseInt(args[0]));
          response = { success: true, output: `Accessed page ${args[0]}` };
        }
        break;

      case 'memalgo':
        if (args.length === 0) {
          response = { success: false, error: 'Usage: memalgo <algorithm> (fifo|lru|optimal)' };
        } else {
          const algo = args[0].toUpperCase();
          if (['FIFO', 'LRU', 'OPTIMAL'].includes(algo)) {
            setMemoryAlgorithm(algo);
            response = { success: true, output: `Memory algorithm set to ${algo}` };
          } else {
            response = { success: false, error: 'Invalid algorithm. Use: fifo, lru, or optimal' };
          }
        }
        break;

      case 'changetab':
      case 'tab':
        if (args.length === 0) {
          response = { success: false, error: 'Usage: changetab <tab_name> (dashboard|scheduler|memory|filesystem|sync|terminal)' };
        } else {
          const tab = args[0].toLowerCase();
          const validTabs = ['dashboard', 'scheduler', 'memory', 'filesystem', 'sync', 'terminal'];
          if (validTabs.includes(tab)) {
            setActiveTab(tab);
            response = { success: true, output: `Switching to ${tab} tab...` };
          } else {
            response = { success: false, error: `Invalid tab. Valid options: ${validTabs.join(', ')}` };
          }
        }
        break;

      case 'clear':
        setTerminalHistory([
          { text: 'CoreX OS Terminal v1.0', type: 'system' },
          { text: '', type: 'normal' }
        ]);
        response = { success: true, output: '' };
        break;

      case 'echo':
        response = { 
          success: true, 
          output: args.join(' ') 
        };
        break;

      case 'exit':
        response = { 
          success: true, 
          output: 'To exit, please close the browser tab or use Ctrl+W' 
        };
        break;

      case '':
        response = { success: true, output: '' };
        break;

      default:
        response = { 
          success: false, 
          error: `Command not found: ${cmd}. Type "help" for available commands.` 
        };
    }

    return response;
  };

  // Context value
  const value = {
    // State
    activeTab,
    fileSystem,
    scheduler,
    memory,
    synchronization,
    terminalHistory,
    notifications,
    
    // Setters
    setActiveTab,
    setFileSystem,
    setScheduler,
    setMemory,
    setSynchronization,
    setTerminalHistory,
    
    // Operations
    createFile,
    deleteFile,
    getFilesAtPath,
    addProcess,
    removeProcess,
    clearAllProcesses,
    runScheduler,
    accessPage,
    setMemoryAlgorithm,
    executeTerminalCommand,
    addNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
