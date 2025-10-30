import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { useAppContext } from '../context/AppContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Scheduler() {
  const { scheduler, setScheduler } = useAppContext();
  const [algorithm, setAlgorithm] = useState('fcfs');
  
  // Use global state instead of local state
  const processes = scheduler.processes || [];
  const ganttData = scheduler.ganttChart || [];
  const stats = scheduler.stats || {};

  const [newProcess, setNewProcess] = useState({
    name: '',
    arrival_time: '',
    burst_time: '',
    priority: ''
  });

  // No need for useEffect - data persists in global state

  const addProcess = () => {
    if (!newProcess.name || !newProcess.arrival_time || !newProcess.burst_time || !newProcess.priority) {
      alert('Please fill all fields');
      return;
    }
    
    const processToAdd = {
      name: newProcess.name,
      arrival_time: parseInt(newProcess.arrival_time),
      burst_time: parseInt(newProcess.burst_time),
      priority: parseInt(newProcess.priority),
      pid: processes.length + 1
    };
    
    const updatedProcesses = [...processes, processToAdd];
    setNewProcess({ name: '', arrival_time: '', burst_time: '', priority: '' });
    
    // Update global scheduler state
    setScheduler({
      ...scheduler,
      processes: updatedProcesses
    });
  };

  const deleteProcess = (index) => {
    const updatedProcesses = processes.filter((_, i) => i !== index);
    
    // Update global scheduler state
    setScheduler({
      ...scheduler,
      processes: updatedProcesses,
      ganttChart: updatedProcesses.length === 0 ? [] : scheduler.ganttChart,
      stats: updatedProcesses.length === 0 ? {} : scheduler.stats
    });
  };

  const runScheduler = () => {
    if (processes.length === 0) {
      alert('Please add at least one process first!');
      return;
    }

    const processCount = processes.length;
    const totalBurstTime = processes.reduce((sum, p) => sum + p.burst_time, 0);
    
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let ganttChart = [];
    
    // Implement different scheduling algorithms
    if (algorithm === 'fcfs') {
      // FCFS: First Come First Served
      const sortedProcesses = [...processes].sort((a, b) => a.arrival_time - b.arrival_time);
      
      sortedProcesses.forEach((proc) => {
          const startTime = Math.max(currentTime, proc.arrival_time);
          const endTime = startTime + proc.burst_time;
          const waitingTime = startTime - proc.arrival_time;
          const turnaroundTime = endTime - proc.arrival_time;
          
          totalWaitingTime += waitingTime;
          totalTurnaroundTime += turnaroundTime;
          
          ganttChart.push({
            pid: proc.pid,
            process_name: proc.name,
            start_time: startTime,
            end_time: endTime
          });
          
          currentTime = endTime;
        });
      } 
      else if (algorithm === 'sjf') {
        // SJF: Shortest Job First (Non-preemptive)
        const remainingProcesses = [...processes].map(p => ({...p, arrived: false, completed: false}));
        currentTime = 0;
        
        while (remainingProcesses.some(p => !p.completed)) {
          // Get all processes that have arrived by current time
          const availableProcesses = remainingProcesses.filter(p => 
            !p.completed && p.arrival_time <= currentTime
          );
          
          if (availableProcesses.length === 0) {
            // No process available, jump to next arrival
            const nextArrival = remainingProcesses
              .filter(p => !p.completed)
              .reduce((min, p) => Math.min(min, p.arrival_time), Infinity);
            currentTime = nextArrival;
            continue;
          }
          
          // Select process with shortest burst time
          const selectedProcess = availableProcesses.reduce((shortest, p) => 
            p.burst_time < shortest.burst_time ? p : shortest
          );
          
          const startTime = currentTime;
          const endTime = startTime + selectedProcess.burst_time;
          const waitingTime = startTime - selectedProcess.arrival_time;
          const turnaroundTime = endTime - selectedProcess.arrival_time;
          
          totalWaitingTime += waitingTime;
          totalTurnaroundTime += turnaroundTime;
          
          ganttChart.push({
            pid: selectedProcess.pid,
            process_name: selectedProcess.name,
            start_time: startTime,
            end_time: endTime
          });
          
          selectedProcess.completed = true;
          currentTime = endTime;
        }
      }
      else if (algorithm === 'srtf') {
        // SRTF: Shortest Remaining Time First (Preemptive SJF)
        const processList = [...processes].map(p => ({
          ...p,
          remaining_time: p.burst_time,
          start_time: -1,
          completion_time: 0
        }));
        
        currentTime = 0;
        let completed = 0;
        const n = processList.length;
        let previousProcess = -1;
        const executionSegments = [];
        
        // Find the minimum and maximum time range
        const minArrival = Math.min(...processList.map(p => p.arrival_time));
        const maxTime = processList.reduce((sum, p) => sum + p.burst_time, 0) + 
                       Math.max(...processList.map(p => p.arrival_time));
        
        currentTime = minArrival;
        
        while (completed < n) {
          // Find process with shortest remaining time among arrived processes
          let shortestIndex = -1;
          let shortestTime = Infinity;
          
          for (let i = 0; i < n; i++) {
            if (processList[i].arrival_time <= currentTime && 
                processList[i].remaining_time > 0 && 
                processList[i].remaining_time < shortestTime) {
              shortestTime = processList[i].remaining_time;
              shortestIndex = i;
            }
          }
          
          if (shortestIndex === -1) {
            // No process available, move time forward
            currentTime++;
            continue;
          }
          
          // Record start time for the process
          if (processList[shortestIndex].start_time === -1) {
            processList[shortestIndex].start_time = currentTime;
          }
          
          // If switching to a different process, save the previous execution segment
          if (previousProcess !== shortestIndex && previousProcess !== -1) {
            if (executionSegments.length > 0 && 
                executionSegments[executionSegments.length - 1].process_index === previousProcess) {
              executionSegments[executionSegments.length - 1].end_time = currentTime;
            }
          }
          
          // Start new segment or continue existing
          if (executionSegments.length === 0 || 
              executionSegments[executionSegments.length - 1].process_index !== shortestIndex ||
              executionSegments[executionSegments.length - 1].end_time !== currentTime) {
            executionSegments.push({
              process_index: shortestIndex,
              start_time: currentTime,
              end_time: currentTime + 1
            });
          } else {
            executionSegments[executionSegments.length - 1].end_time = currentTime + 1;
          }
          
          // Execute for 1 time unit
          processList[shortestIndex].remaining_time--;
          currentTime++;
          previousProcess = shortestIndex;
          
          // Check if process completed
          if (processList[shortestIndex].remaining_time === 0) {
            completed++;
            processList[shortestIndex].completion_time = currentTime;
            
            const turnaroundTime = currentTime - processList[shortestIndex].arrival_time;
            const waitingTime = turnaroundTime - processList[shortestIndex].burst_time;
            
            totalTurnaroundTime += turnaroundTime;
            totalWaitingTime += waitingTime;
          }
        }
        
        // Convert execution segments to gantt chart
        ganttChart = executionSegments.map(segment => ({
          pid: processList[segment.process_index].pid,
          process_name: processList[segment.process_index].name,
          start_time: segment.start_time,
          end_time: segment.end_time
        }));
      }
      else if (algorithm === 'rr') {
        // Round Robin with time quantum = 2
        const timeQuantum = 2;
        const queue = [];
        const remainingProcesses = [...processes].map(p => ({
          ...p,
          remaining_time: p.burst_time,
          first_response: -1
        }));
        
        currentTime = 0;
        let processIndex = 0;
        const arrivalSorted = [...remainingProcesses].sort((a, b) => a.arrival_time - b.arrival_time);
        
        // Add first process to queue
        if (arrivalSorted.length > 0) {
          currentTime = arrivalSorted[0].arrival_time;
          queue.push(arrivalSorted[processIndex++]);
        }
        
        while (queue.length > 0 || processIndex < arrivalSorted.length) {
          if (queue.length === 0) {
            // Jump to next arrival
            currentTime = arrivalSorted[processIndex].arrival_time;
            queue.push(arrivalSorted[processIndex++]);
          }
          
          const currentProcess = queue.shift();
          const startTime = currentTime;
          const executeTime = Math.min(timeQuantum, currentProcess.remaining_time);
          const endTime = startTime + executeTime;
          
          if (currentProcess.first_response === -1) {
            currentProcess.first_response = startTime;
          }
          
          ganttChart.push({
            pid: currentProcess.pid,
            process_name: currentProcess.name,
            start_time: startTime,
            end_time: endTime
          });
          
          currentProcess.remaining_time -= executeTime;
          currentTime = endTime;
          
          // Add newly arrived processes to queue
          while (processIndex < arrivalSorted.length && 
                 arrivalSorted[processIndex].arrival_time <= currentTime) {
            queue.push(arrivalSorted[processIndex++]);
          }
          
          // Re-add current process if not finished
          if (currentProcess.remaining_time > 0) {
            queue.push(currentProcess);
          } else {
            // Process completed
            const turnaroundTime = currentTime - currentProcess.arrival_time;
            const waitingTime = turnaroundTime - currentProcess.burst_time;
            totalTurnaroundTime += turnaroundTime;
            totalWaitingTime += waitingTime;
          }
        }
      }
      else if (algorithm === 'priority') {
        // Priority Scheduling (Non-preemptive, lower number = higher priority)
        const remainingProcesses = [...processes].map(p => ({...p, completed: false}));
        currentTime = 0;
        
        while (remainingProcesses.some(p => !p.completed)) {
          const availableProcesses = remainingProcesses.filter(p => 
            !p.completed && p.arrival_time <= currentTime
          );
          
          if (availableProcesses.length === 0) {
            const nextArrival = remainingProcesses
              .filter(p => !p.completed)
              .reduce((min, p) => Math.min(min, p.arrival_time), Infinity);
            currentTime = nextArrival;
            continue;
          }
          
          // Select process with highest priority (lowest number)
          const selectedProcess = availableProcesses.reduce((highest, p) => 
            p.priority < highest.priority ? p : highest
          );
          
          const startTime = currentTime;
          const endTime = startTime + selectedProcess.burst_time;
          const waitingTime = startTime - selectedProcess.arrival_time;
          const turnaroundTime = endTime - selectedProcess.arrival_time;
          
          totalWaitingTime += waitingTime;
          totalTurnaroundTime += turnaroundTime;
          
          ganttChart.push({
            pid: selectedProcess.pid,
            process_name: selectedProcess.name,
            start_time: startTime,
            end_time: endTime
          });
          
          selectedProcess.completed = true;
          currentTime = endTime;
        }
    }
    
    const avgWaitingTime = (totalWaitingTime / processCount).toFixed(2);
    const avgTurnaroundTime = (totalTurnaroundTime / processCount).toFixed(2);
    const cpuUtilization = ((totalBurstTime / currentTime) * 100).toFixed(2);
    
    const calculatedStats = {
      algorithm: algorithm.toUpperCase(),
      avg_waiting_time: avgWaitingTime,
      avg_turnaround_time: avgTurnaroundTime,
      cpu_utilization: cpuUtilization,
      total_processes: processCount,
      total_time: currentTime
    };
    
    // Update global scheduler state for Dashboard
    setScheduler({
      ...scheduler,
      processes: processes,
      ganttChart: ganttChart,
      stats: calculatedStats,
      isRunning: true
    });
  };

  const ganttChartData = {
    labels: ganttData.map(entry => entry.process_name || `P${entry.pid}`),
    datasets: [{
      label: 'Start Time',
      data: ganttData.map(entry => entry.start_time),
      backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent - represents idle time before process starts
      borderColor: 'rgba(0, 0, 0, 0)',
      borderWidth: 0
    }, {
      label: 'Execution Time',
      data: ganttData.map(entry => entry.end_time - entry.start_time),
      backgroundColor: ganttData.map((entry, index) => {
        const colors = [
          'rgba(15, 76, 117, 0.9)',      // Dark Blue
          'rgba(50, 130, 184, 0.9)',     // Medium Blue
          'rgba(27, 38, 44, 0.9)',       // Dark Gray
          'rgba(220, 53, 69, 0.9)',      // Red
          'rgba(40, 167, 69, 0.9)',      // Green
          'rgba(255, 193, 7, 0.9)',      // Amber
          'rgba(111, 66, 193, 0.9)',     // Purple
          'rgba(23, 162, 184, 0.9)',     // Cyan
        ];
        return colors[index % colors.length];
      }),
      borderColor: ganttData.map((entry, index) => {
        const colors = [
          'rgba(15, 76, 117, 1)',        // Dark Blue
          'rgba(50, 130, 184, 1)',       // Medium Blue
          'rgba(27, 38, 44, 1)',         // Dark Gray
          'rgba(220, 53, 69, 1)',        // Red
          'rgba(40, 167, 69, 1)',        // Green
          'rgba(255, 193, 7, 1)',        // Amber
          'rgba(111, 66, 193, 1)',       // Purple
          'rgba(23, 162, 184, 1)',       // Cyan
        ];
        return colors[index % colors.length];
      }),
      borderWidth: 2
    }]
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100%', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #BBE1FA 0%, #3282B8 100%)',
      padding: '20px',
      gap: '20px'
    }}>
      {/* LEFT SECTION - 40% - Add Process */}
      <div style={{ 
        width: '40%', 
        padding: '15px', 
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(255, 164, 164, 0.2)',
        border: '2px solid rgba(255, 164, 164, 0.3)'
      }}>
        <h3 className="mb-2" style={{ 
          color: '#2d3748', 
          borderBottom: '2px solid #0F4C75', 
          paddingBottom: '6px',
          fontSize: '1.1rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #0F4C75 0%, #1B262C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Add New Process
        </h3>
        
        <Form style={{ marginBottom: '12px' }}>
          <Form.Group className="mb-1">
            <Form.Label style={{ fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', marginBottom: '3px' }}>
              Process Name
            </Form.Label>
            <Form.Control
              type="text"
              value={newProcess.name}
              onChange={(e) => setNewProcess({...newProcess, name: e.target.value})}
              placeholder="e.g., P1, Task-A"
              style={{ 
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                padding: '6px 8px',
                fontSize: '0.8rem',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label style={{ fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', marginBottom: '3px' }}>
              Arrival Time (ms)
            </Form.Label>
            <Form.Control
              type="number"
              value={newProcess.arrival_time}
              onChange={(e) => setNewProcess({...newProcess, arrival_time: e.target.value})}
              placeholder="Arrival time"
              style={{ 
                borderRadius: '8px',
                border: '2px solid #3282B8',
                padding: '6px 8px',
                fontSize: '0.8rem',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(186, 223, 219, 0.3)'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0F4C75'}
              onBlur={(e) => e.target.style.borderColor = '#3282B8'}
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label style={{ fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', marginBottom: '3px' }}>
              Burst Time (ms)
            </Form.Label>
            <Form.Control
              type="number"
              value={newProcess.burst_time}
              onChange={(e) => setNewProcess({...newProcess, burst_time: e.target.value})}
              placeholder="Execution time"
              style={{ 
                borderRadius: '8px',
                border: '2px solid #3282B8',
                padding: '6px 8px',
                fontSize: '0.8rem',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(186, 223, 219, 0.3)'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0F4C75'}
              onBlur={(e) => e.target.style.borderColor = '#3282B8'}
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label style={{ fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', marginBottom: '3px' }}>
              Priority (1=highest)
            </Form.Label>
            <Form.Control
              type="number"
              value={newProcess.priority}
              onChange={(e) => setNewProcess({...newProcess, priority: e.target.value})}
              placeholder="Priority"
              style={{ 
                borderRadius: '8px',
                border: '2px solid #3282B8',
                padding: '6px 8px',
                fontSize: '0.8rem',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(186, 223, 219, 0.3)'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0F4C75'}
              onBlur={(e) => e.target.style.borderColor = '#3282B8'}
            />
          </Form.Group>

          <Button 
            onClick={addProcess} 
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
              marginTop: '8px'
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
            Add Process to Queue
          </Button>

          <Button 
            onClick={() => {
              const examples = [
                { name: 'P1', arrival_time: 0, burst_time: 8, priority: 2, pid: 1 },
                { name: 'P2', arrival_time: 1, burst_time: 4, priority: 1, pid: 2 },
                { name: 'P3', arrival_time: 2, burst_time: 9, priority: 3, pid: 3 },
                { name: 'P4', arrival_time: 3, burst_time: 5, priority: 2, pid: 4 }
              ];
              
              // Update global scheduler state with examples
              setScheduler({
                ...scheduler,
                processes: examples,
                ganttChart: [],
                stats: {}
              });
            }}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #BBE1FA 0%, #3282B8 100%)',
              border: '2px solid #3282B8',
              borderRadius: '8px',
              padding: '6px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: '#0F4C75',
              marginTop: '8px',
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
            Load Example Processes
          </Button>
        </Form>

        <div style={{ 
          height: '1px', 
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
          Scheduling Algorithm
        </h3>
        
        <Form.Group className="mb-1">
          <Form.Label style={{ fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', marginBottom: '3px' }}>
            Select Algorithm
          </Form.Label>
          <Form.Select 
            value={algorithm} 
            onChange={(e) => setAlgorithm(e.target.value)}
            style={{ 
              borderRadius: '8px',
              border: '2px solid #3282B8',
              padding: '6px 8px',
              fontSize: '0.8rem',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(186, 223, 219, 0.3)'
            }}
          >
            <option value="fcfs">🔵 First Come First Serve (FCFS)</option>
            <option value="sjf">🟢 Shortest Job First (SJF)</option>
            <option value="srtf">🟡 Shortest Remaining Time First (SRTF)</option>
            <option value="rr">🟠 Round Robin (RR)</option>
            <option value="priority">🔴 Priority Scheduling</option>
          </Form.Select>
        </Form.Group>

        <Button 
          onClick={runScheduler} 
          disabled={processes.length === 0}
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
            cursor: processes.length === 0 ? 'not-allowed' : 'pointer',
            transform: 'translateY(0)',
            marginTop: '8px'
          }}
          onMouseEnter={(e) => {
            if (processes.length > 0) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(50, 130, 184, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            if (processes.length > 0) {
              e.target.style.boxShadow = '0 4px 15px rgba(50, 130, 184, 0.4)';
            }
          }}
        >
          Run Scheduler
        </Button>
        
        {processes.length === 0 && (
          <p style={{ 
            textAlign: 'center', 
            marginTop: '6px', 
            color: '#718096',
            fontSize: '0.7rem',
            fontStyle: 'italic'
          }}>
            Add at least one process to run
          </p>
        )}
      </div>

      {/* MIDDLE SECTION - 20% - Process List */}
      <div style={{ 
        width: '20%', 
        padding: '30px 20px', 
        overflowY: 'auto',
        background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(255, 189, 189, 0.2)',
        border: '2px solid rgba(255, 189, 189, 0.3)'
      }}>
        <h3 className="mb-4" style={{ 
          color: '#2d3748', 
          borderBottom: '4px solid #1B262C', 
          paddingBottom: '15px',
          fontSize: '1.5rem',
          fontWeight: '700',
          textAlign: 'center'
        }}>
          📋 Queue
        </h3>
        
        <div style={{ 
          fontSize: '0.9rem', 
          marginBottom: '20px', 
          textAlign: 'center',
          padding: '10px',
          background: 'linear-gradient(135deg, #0F4C75 0%, #1B262C 100%)',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(255, 164, 164, 0.3)'
        }}>
          Total: {processes.length} process(es)
        </div>

        {processes.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 15px', 
            color: '#a0aec0',
            fontSize: '0.95rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📭</div>
            <div style={{ fontWeight: '500' }}>Empty Queue</div>
            <div style={{ fontSize: '0.85rem', marginTop: '8px' }}>Add processes to get started</div>
          </div>
        ) : (
          <div>
            {processes.map((proc, index) => (
              <div 
                key={index} 
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #BBE1FA 100%)',
                  padding: '15px',
                  marginBottom: '12px',
                  border: '2px solid #3282B8',
                  borderLeft: '5px solid #0F4C75',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(255, 164, 164, 0.15)',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 164, 164, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 164, 164, 0.15)';
                }}
              >
                <button
                  onClick={() => deleteProcess(index)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'linear-gradient(135deg, #0F4C75 0%, #1B262C 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(255, 164, 164, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.15)';
                    e.target.style.boxShadow = '0 3px 8px rgba(255, 164, 164, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 4px rgba(255, 164, 164, 0.3)';
                  }}
                  title="Delete process"
                >
                  ×
                </button>
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '1.1rem', 
                  color: '#2d3748', 
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingRight: '30px'
                }}>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #0F4C75 0%, #1B262C 100%)',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </span>
                  {proc.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#4a5568', lineHeight: '1.8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Arrival:</span>
                    <strong>{proc.arrival_time} ms</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Burst:</span>
                    <strong>{proc.burst_time} ms</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Priority:</span>
                    <strong>{proc.priority}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SECTION - 40% - Stats and Gantt Chart */}
      <div style={{ 
        width: '40%', 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        gap: '20px'
      }}>
        {/* TOP HALF - Statistics */}
        <div style={{ 
          height: 'calc(50% - 10px)', 
          padding: '30px', 
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(186, 223, 219, 0.2)',
          border: '2px solid rgba(186, 223, 219, 0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 className="mb-3" style={{ 
            color: '#2d3748', 
            borderBottom: '3px solid #3282B8', 
            paddingBottom: '10px',
            fontSize: '1.3rem',
            fontWeight: '700',
            flexShrink: 0
          }}>
            Statistics
          </h3>
          
          {ganttData.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#a0aec0',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '1rem', fontWeight: '500' }}>No Data Yet</div>
              <div style={{ fontSize: '0.85rem', marginTop: '8px' }}>
                Add processes and run scheduler to see statistics
              </div>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              gap: '15px',
              flex: 1,
              alignItems: 'stretch'
            }}>
              <div style={{ 
                flex: 1,
                background: 'linear-gradient(135deg, #0F4C75 0%, #1B262C 100%)',
                color: 'white', 
                padding: '15px', 
                borderRadius: '16px',
                boxShadow: '0 6px 20px rgba(255, 164, 164, 0.4)',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '120px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '0.75rem', opacity: 0.95, marginBottom: '8px', textAlign: 'center', fontWeight: '600' }}>Avg Waiting</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', lineHeight: '1' }}>
                  {stats.avg_waiting_time}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '5px' }}>ms</div>
              </div>

              <div style={{ 
                flex: 1,
                background: 'linear-gradient(135deg, #1B262C 0%, #3282B8 100%)',
                color: 'white', 
                padding: '15px', 
                borderRadius: '16px',
                boxShadow: '0 6px 20px rgba(255, 189, 189, 0.4)',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '120px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '0.75rem', opacity: 0.95, marginBottom: '8px', textAlign: 'center', fontWeight: '600' }}>Avg Turnaround</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', lineHeight: '1' }}>
                  {stats.avg_turnaround_time}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '5px' }}>ms</div>
              </div>

              <div style={{ 
                flex: 1,
                background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
                color: 'white', 
                padding: '15px',
                borderRadius: '16px',
                boxShadow: '0 6px 20px rgba(186, 223, 219, 0.4)',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '120px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '0.75rem', opacity: 0.95, marginBottom: '8px', textAlign: 'center', fontWeight: '600' }}>CPU Utilization</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', lineHeight: '1' }}>
                  {stats.cpu_utilization}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '5px' }}>%</div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM HALF - Gantt Chart */}
        <div style={{ 
          height: 'calc(50% - 10px)', 
          padding: '30px', 
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #BBE1FA 0%, #3282B8 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(186, 223, 219, 0.2)',
          border: '2px solid rgba(186, 223, 219, 0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 className="mb-3" style={{ 
            color: '#2d3748', 
            borderBottom: '3px solid #0F4C75', 
            paddingBottom: '10px',
            fontSize: '1.3rem',
            fontWeight: '700',
            flexShrink: 0
          }}>
            Gantt Chart
          </h3>
          
          {ganttData.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#a0aec0',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📉</div>
              <div style={{ fontSize: '1rem', fontWeight: '500' }}>No Chart Data</div>
              <div style={{ fontSize: '0.85rem', marginTop: '8px' }}>
                Run scheduler to visualize the execution timeline
              </div>
            </div>
          ) : (
            <div style={{ 
              backgroundColor: '#ffffff', 
              padding: '20px', 
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0
            }}>
              <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                <Bar 
                  data={ganttChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                      legend: {
                        display: false
                      },
                      title: {
                        display: true,
                        text: `Process Execution Timeline (${stats.algorithm})`,
                        font: {
                          size: 14,
                          weight: 'bold'
                        },
                        color: '#2d3748'
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            if (context.datasetIndex === 0) return null; // Hide tooltip for transparent "Start Time" bars
                            const entry = ganttData[context.dataIndex];
                            return [
                              `Process: ${entry.process_name || 'P' + entry.pid}`,
                              `Start: ${entry.start_time} ms`,
                              `End: ${entry.end_time} ms`,
                              `Duration: ${entry.end_time - entry.start_time} ms`
                            ];
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        stacked: true,
                        title: {
                          display: true,
                          text: 'Time (ms)',
                          font: {
                            size: 12,
                            weight: 'bold'
                          }
                        },
                        ticks: {
                          font: {
                            size: 11
                          }
                        }
                      },
                      y: {
                        stacked: true,
                        title: {
                          display: true,
                          text: 'Processes',
                          font: {
                            size: 12,
                            weight: 'bold'
                          }
                        },
                        ticks: {
                          font: {
                            size: 11
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Scheduler;

