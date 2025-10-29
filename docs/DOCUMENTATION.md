# CoreX OS - Project Documentation

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Module Specifications](#module-specifications)
3. [Algorithm Details](#algorithm-details)
4. [API Reference](#api-reference)
5. [Testing Strategy](#testing-strategy)
6. [Performance Analysis](#performance-analysis)

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                 │
│  ┌─────────────────┐         ┌─────────────────┐       │
│  │  Command Shell  │         │  Web Dashboard  │       │
│  └────────┬────────┘         └────────┬────────┘       │
└───────────┼──────────────────────────┼─────────────────┘
            │                          │
┌───────────┼──────────────────────────┼─────────────────┐
│           │      Core OS Layer       │                 │
│  ┌────────▼────────┐        ┌────────▼────────┐       │
│  │  VFS Manager    │        │  REST API       │       │
│  └────────┬────────┘        └────────┬────────┘       │
│           │                          │                 │
│  ┌────────┴─────────┬────────────────┴────────┐       │
│  │                  │                          │       │
│  ▼                  ▼                          ▼       │
│ ┌─────────┐  ┌──────────┐  ┌────────────┐  ┌───────┐ │
│ │   VFS   │  │   MMU    │  │ Scheduler  │  │ Sync  │ │
│ └─────────┘  └──────────┘  └────────────┘  └───────┘ │
└─────────────────────────────────────────────────────────┘
```

### Component Interaction

```
User Command → Shell Parser → Command Executor
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
              VFS Operations   MMU Access    Scheduler Control
                    │               │               │
                    └───────────────┴───────────────┘
                                    │
                            System State Update
                                    │
                            ┌───────┴────────┐
                            │                │
                            ▼                ▼
                    Statistics Update    Log Event
```

## Module Specifications

### 1. Virtual File System (VFS)

#### Data Structures

**Inode Structure:**
```c
typedef struct {
    uint32_t inode_number;      // Unique inode identifier
    FileType type;              // Regular file or directory
    uint32_t size;              // File size in bytes
    uint32_t block_count;       // Number of blocks allocated
    uint32_t blocks[12];        // Direct block pointers
    uint32_t indirect_block;    // Single indirect block
    uint32_t link_count;        // Number of hard links
    time_t created_time;        // Creation timestamp
    time_t modified_time;       // Last modification time
    time_t accessed_time;       // Last access time
    uint32_t permissions;       // File permissions (Unix-style)
    int is_used;                // Allocation flag
} Inode;
```

**Directory Entry:**
```c
typedef struct {
    char filename[MAX_FILENAME];    // File name (256 chars max)
    uint32_t inode_number;          // Associated inode
    int is_used;                    // Entry validity flag
} DirectoryEntry;
```

#### Key Operations

1. **File Creation**: `vfs_create_file()`
   - Allocates new inode
   - Adds entry to parent directory
   - Time complexity: O(1) average case

2. **File Read/Write**: `vfs_read()`, `vfs_write()`
   - Block-based I/O operations
   - Automatic block allocation on write
   - Time complexity: O(n) where n = number of blocks

3. **Directory Navigation**: `vfs_change_directory()`
   - Path resolution with support for . and ..
   - Absolute and relative path handling

### 2. Memory Management Unit (MMU)

#### Page Table Structure

```c
typedef struct {
    uint32_t frame_number;      // Physical frame number
    bool valid;                 // Page is in memory
    bool dirty;                 // Page has been modified
    bool referenced;            // Recently accessed flag
    uint32_t protection;        // Access permissions
    uint32_t last_access_time;  // For LRU algorithm
} PageTableEntry;
```

#### Page Replacement Algorithms

**FIFO (First-In-First-Out):**
- Maintains queue of loaded pages
- Replaces oldest page on fault
- Simple but may suffer from Belady's anomaly
- Time complexity: O(1)

**LRU (Least Recently Used):**
- Tracks access time for each page
- Replaces least recently accessed page
- Better performance than FIFO
- Time complexity: O(n) where n = number of frames

#### Memory Access Flow

```
Virtual Address → Page Number + Offset
        │
        ▼
Page Table Lookup
        │
    ┌───┴───┐
    │       │
Valid?   Invalid?
    │       │
    │       ▼
    │   Page Fault Handler
    │       │
    │       ├─→ Find Victim (FIFO/LRU)
    │       ├─→ Swap Out if Dirty
    │       └─→ Swap In New Page
    │
    ▼
Physical Address = Frame Number + Offset
```

### 3. CPU Scheduler

#### Scheduling Algorithms Comparison

| Algorithm | Preemptive | Time Complexity | Advantages | Disadvantages |
|-----------|-----------|-----------------|------------|---------------|
| FCFS | No | O(n) | Simple, fair | Poor avg waiting time |
| SJF | No | O(n²) | Optimal avg waiting | Requires burst time |
| SRTF | Yes | O(n²) | Optimal preemptive | High overhead |
| Round Robin | Yes | O(n) | Fair time sharing | Context switch overhead |
| Priority | Yes/No | O(n²) | Flexible control | Starvation risk |

#### Process Control Block (PCB)

```c
typedef struct {
    uint32_t pid;               // Process ID
    char name[32];              // Process name
    ProcessState state;         // Current state
    uint32_t priority;          // Scheduling priority
    uint32_t arrival_time;      // Arrival time
    uint32_t burst_time;        // Total CPU time needed
    uint32_t remaining_time;    // Time left to execute
    uint32_t completion_time;   // Finish time
    uint32_t waiting_time;      // Total wait time
    uint32_t turnaround_time;   // Completion - Arrival
    uint32_t response_time;     // First run - Arrival
} PCB;
```

#### Performance Metrics

1. **Average Waiting Time** = Σ(waiting_time) / n
2. **Average Turnaround Time** = Σ(turnaround_time) / n
3. **CPU Utilization** = (Total Burst Time / Total Time) × 100
4. **Throughput** = Processes Completed / Total Time

### 4. Process Synchronization

#### Semaphore Implementation

```c
typedef struct {
    int value;                  // Semaphore counter
    pthread_mutex_t mutex;      // Mutual exclusion
    pthread_cond_t cond;        // Condition variable
} Semaphore;
```

#### Classic Problems

**Producer-Consumer:**
- Bounded buffer (size = 10)
- Semaphores: empty, full, mutex
- Prevents buffer overflow/underflow

**Dining Philosophers:**
- 5 philosophers, 5 forks
- Deadlock prevention: resource ordering
- Ensures mutual exclusion and progress

## Algorithm Details

### 1. FIFO Page Replacement

```
Algorithm FIFO_PageReplacement:
Input: Page reference string
Output: Number of page faults

1. Initialize frame queue (FIFO)
2. For each page reference:
   a. Check if page in memory (page table)
   b. If present: Page hit, update access time
   c. If not present: Page fault
      - If free frames available:
        * Allocate frame
        * Load page
        * Add to queue
      - Else:
        * Select victim (front of queue)
        * Swap out if dirty
        * Load new page
        * Update queue
3. Return page fault count
```

### 2. LRU Page Replacement

```
Algorithm LRU_PageReplacement:
Input: Page reference string
Output: Number of page faults

1. Initialize frame table with timestamps
2. For each page reference:
   a. Check if page in memory
   b. If present: 
      - Page hit
      - Update timestamp
   c. If not present: Page fault
      - Find frame with oldest timestamp
      - Swap out if dirty
      - Load new page
      - Update timestamp
3. Return page fault count
```

### 3. Round Robin Scheduling

```
Algorithm RoundRobin:
Input: Process list, Time quantum Q
Output: Gantt chart, Statistics

1. Initialize ready queue
2. While processes remain:
   a. Dequeue process P
   b. Execute for min(Q, remaining_time)
   c. Update metrics
   d. If P not complete:
      - Enqueue P
   e. Check for new arrivals
   f. Add to ready queue
3. Calculate statistics
4. Generate Gantt chart
```

## API Reference

### REST API Endpoints

#### Scheduler API

```
POST /api/scheduler/processes
Request: {
  "name": "P1",
  "arrival_time": 0,
  "burst_time": 8,
  "priority": 2
}
Response: {
  "pid": 0,
  "name": "P1",
  ...
}

POST /api/scheduler/run
Request: {
  "algorithm": "fcfs"
}
Response: {
  "statistics": {...},
  "gantt_chart": [...]
}
```

#### Memory API

```
GET /api/memory/stats
Response: {
  "algorithm": "LRU",
  "page_faults": 45,
  "page_hits": 155,
  "hit_ratio": 77.5
}

POST /api/memory/algorithm
Request: {
  "algorithm": "FIFO"
}
```

## Testing Strategy

### Unit Tests

1. **VFS Tests**
   - File creation/deletion
   - Directory operations
   - Path resolution
   - I/O operations

2. **MMU Tests**
   - Page table operations
   - FIFO replacement correctness
   - LRU replacement correctness
   - Swap operations

3. **Scheduler Tests**
   - Each algorithm correctness
   - Gantt chart generation
   - Statistics calculation

### Integration Tests

1. Shell command execution
2. API endpoint functionality
3. Frontend-backend communication

## Performance Analysis

### Benchmark Results (Example)

| Metric | FCFS | SJF | Round Robin | Priority |
|--------|------|-----|-------------|----------|
| Avg Wait Time | 12.4 | 8.2 | 10.1 | 9.5 |
| Avg Turnaround | 20.6 | 16.4 | 18.3 | 17.8 |
| CPU Utilization | 85% | 88% | 82% | 86% |

### Memory Performance

- **Page Fault Rate**: 15-25% (typical)
- **LRU vs FIFO**: LRU typically 10-15% fewer faults
- **Hit Ratio**: 75-85% (depends on locality)

## Conclusion

CoreX OS provides a comprehensive simulation environment for understanding operating system concepts. The modular design allows for easy extension and modification, making it an ideal platform for education and experimentation.
