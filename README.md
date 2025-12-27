# CoreX OS - Virtual Operating System Simulator

![CoreX OS](https://img.shields.io/badge/CoreX%20OS-v1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Web-lightgrey)

CoreX OS is a comprehensive, web-based operating system simulator with an interactive React frontend that demonstrates core OS concepts including virtual file systems, memory management, CPU scheduling algorithms, and process synchronization. The application features a fully integrated terminal, real-time dashboard, and seamless cross-component communication.

## 🎯 Features

### Interactive Web Dashboard
- **Real-time system monitoring** with live statistics
- **Modern gradient UI** with responsive design
- **Cross-component integration** via global state management
- **Notification system** for user feedback

### 1. Virtual File System (VFS)
- Hierarchical directory structure with meaningful organization
- Pre-configured folders: documents/, programs/, config/, logs/, temp/
- File operations: create, read, delete files and directories
- Path resolution with absolute paths
- Visual file browser interface

### 2. Memory Management Unit (MMU)
- **Page replacement algorithms:**
  - FIFO (First-In-First-Out)
  - LRU (Least Recently Used)
  - OPTIMAL (Optimal Page Replacement)
- Interactive simulation with reference string input
- Real-time statistics (page faults, hits, hit ratio)
- Visual execution steps display
- Configurable number of frames (1-10)
- Dashboard integration for live memory metrics

### 3. CPU Scheduling
- **Multiple scheduling algorithms:**
  - FCFS (First Come First Serve)
  - SJF (Shortest Job First)
  - Round Robin (RR)
  - Priority Scheduling
- Interactive Gantt chart visualization
- Performance metrics (waiting time, turnaround time, response time)
- CPU utilization calculation
- Process management (add, remove, clear)
- Example process templates

### 4. Process Synchronization
- **Producer-Consumer Problem** with bounded buffer
- **Dining Philosophers Problem** with deadlock avoidance
- Real-time event visualization
- Semaphore-based implementation
- Interactive controls (start, pause, stop)
- Animated philosopher states

### 5. Interactive Terminal
- **25+ built-in commands** for full system control
- **File system commands:** `mkdir`, `touch`, `rm`, `ls`, `cd`, `pwd`, `cat`
- **Scheduler commands:** `addproc`, `rmproc`, `clearproc`, `schedule`, `gantt`
- **Memory commands:** `meminfo`, `accesspage`, `memalgo`
- **Navigation commands:** `changetab`, `accesspage`
- **Utilities:** `help`, `clear`, `echo`
- Command history and auto-scroll
- No distracting notifications - clean CLI experience
- Professional terminal styling with syntax highlighting

### 6. Unified Design System
- **Modern blue gradient theme** (#BBE1FA → #3282B8)
- Consistent typography and spacing across all pages
- Responsive card-based layout
- Custom scrollbars matching theme
- Hover effects and smooth animations
- Color-coded status indicators
- Emoji icons for visual hierarchy

## 📋 Prerequisites

- **Node.js** 16+ and npm
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Python 3.8+ (for backend API - optional)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd OS_Project
```

### 2. Install and Run Frontend
```bash
cd frontend
npm install
npm start
```

The application will open at `http://localhost:3000`

### 3. (Optional) Run Python Backend
```bash
cd backend/python
pip install -r requirements.txt
python app.py
```

The API will be available at `http://localhost:5000`

## 💻 Using CoreX OS

### Dashboard
The main dashboard displays:
- **System Overview** with CPU, memory, and file system stats
- **Scheduler Statistics** (processes, algorithms, performance metrics)
- **Memory Management** (page faults, hits, algorithm, frames)
- **File System Statistics** (inodes, blocks, storage usage)
- **Quick Access** buttons to all modules

### Terminal Commands

#### File System Operations
```bash
mkdir <directory>     # Create new directory
touch <file>          # Create new file
rm <path>            # Remove file or directory
ls [path]            # List directory contents
cd <path>            # Change directory
pwd                  # Print working directory
cat <file>           # Display file contents
```

#### Process Scheduler
```bash
addproc <name> <arrival> <burst> <priority>   # Add process
rmproc <pid>                                   # Remove process
clearproc                                      # Clear all processes
schedule <algorithm>                           # Run scheduler (fcfs|sjf|rr|priority)
gantt                                          # Show Gantt chart
```

#### Memory Management
```bash
meminfo              # Display memory statistics
memalgo <algorithm>  # Set algorithm (fifo|lru|optimal)
accesspage <number>  # Access a page
```

#### Navigation
```bash
changetab <tab>      # Switch tabs (dashboard|scheduler|memory|filesystem|sync|terminal)
help                 # Show all commands
clear                # Clear terminal
```

### Example Workflow
```bash
# Create a project structure
mkdir workspace
mkdir workspace/src
touch workspace/src/main.js
touch workspace/README.md

# Add and schedule processes
addproc P1 0 10 5
addproc P2 2 8 3
addproc P3 4 6 7
schedule fcfs
gantt

# Navigate to file system
changetab filesystem

# Check memory stats
meminfo
memalgo lru
```

## 🏗️ Project Structure

```
OS_Project/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── Terminal.js
│   │   │   ├── Scheduler.js
│   │   │   ├── MemoryManagement.js
│   │   │   ├── FileSystem.js
│   │   │   ├── Synchronization.js
│   │   │   └── NotificationBar.js
│   │   ├── context/      # Global state management
│   │   │   └── AppContext.js
│   │   ├── App.js        # Main app component
│   │   ├── App.css       # Global styles
│   │   └── index.js      # Entry point
│   ├── public/           # Static assets
│   └── package.json      # Dependencies
├── backend/
│   └── python/           # Flask API (optional)
│       ├── app.py
│       └── requirements.txt
├── docs/                 # Additional documentation
└── README.md            # This file
```

## 🎨 Architecture

### Frontend Architecture
- **React** 18+ with functional components and hooks
- **Context API** for global state management
- **React Router** for navigation
- **Bootstrap** for UI components
- **Chart.js** for data visualization

### State Management
- Centralized `AppContext` managing all application state
- Real-time synchronization across all components
- Immutable state updates for predictable behavior

### Key Features Implementation
- **Global State:** `fileSystem`, `scheduler`, `memory`, `synchronization`, `terminalHistory`
- **Operations:** File CRUD, process management, scheduling algorithms, memory simulation
- **Communication:** Terminal → State → All Components → Dashboard updates

## 📊 Component Overview

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **Dashboard** | System overview | Live stats, quick access, color-coded metrics |
| **Terminal** | Command-line interface | 25+ commands, history, syntax highlighting |
| **Scheduler** | CPU scheduling | Multiple algorithms, Gantt chart, statistics |
| **Memory** | Page replacement | FIFO/LRU/OPTIMAL, simulation, hit ratio |
| **FileSystem** | File browser | Create/delete, tree view, storage stats |
| **Synchronization** | Classic problems | Producer-Consumer, Dining Philosophers |
| **NotificationBar** | User feedback | Color-coded alerts, auto-dismiss |

## 📈 Performance Metrics

CoreX OS tracks and displays various performance metrics in real-time:

### Scheduler Metrics
- **Average Waiting Time** - Time processes wait in ready queue
- **Average Turnaround Time** - Total time from arrival to completion
- **Average Response Time** - Time from arrival to first execution
- **CPU Utilization** - Percentage of time CPU is busy

### Memory Metrics
- **Page Fault Rate** - Frequency of page faults
- **Page Hit Ratio** - Percentage of successful page accesses
- **Used Frames** - Current frame utilization
- **Algorithm Performance** - Comparison of FIFO vs LRU vs OPTIMAL

### File System Metrics
- **Inode Utilization** - Percentage of inodes used
- **Block Utilization** - Storage space usage
- **Directory Depth** - File system hierarchy complexity

## 🎓 Educational Use

CoreX OS is designed as an educational tool for:
- **Operating Systems courses** - Hands-on demonstration of OS concepts
- **System programming** - Understanding scheduling and memory management
- **Algorithm visualization** - Interactive learning of classic OS algorithms
- **Self-study** - Experiment with different configurations and observe results

### Learning Objectives
✅ Understand CPU scheduling algorithms and their trade-offs  
✅ Learn page replacement strategies and memory management  
✅ Explore process synchronization and deadlock avoidance  
✅ Practice command-line interface operations  
✅ Visualize OS concepts with interactive charts and graphs  

## 🎨 Design Highlights

### Color Palette
- **Primary:** Ocean Blue (#3282B8), Deep Blue (#0F4C75)
- **Light:** Sky Blue (#BBE1FA), Light Blue accents
- **Dark:** Navy (#1B262C)
- **Semantic:** Green (success), Red (error), Orange (warning)

### Typography
- **Headers:** Bold gradient text (32px)
- **Subheaders:** Semi-bold (16-19px)
- **Body:** Regular (14px)
- **Terminal:** Consolas monospace

### UI Features
- Gradient backgrounds on interactive elements
- Smooth hover animations and transitions
- Custom scrollbars matching theme
- Responsive grid layouts
- Card-based component design

## � Future Enhancements

- [ ] Multi-core CPU scheduling simulation
- [ ] Advanced memory management (segmentation, virtual memory)
- [ ] Disk scheduling algorithms (SCAN, C-SCAN, LOOK)
- [ ] File permissions and access control
- [ ] Process priority aging
- [ ] Real-time process monitoring
- [ ] Export simulation results (PDF/CSV)
- [ ] Custom algorithm configuration
- [ ] Performance comparison tools
- [ ] Mobile-responsive design improvements

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or run on different port
PORT=3001 npm start
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Browser Compatibility
- Recommended: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- Enable JavaScript
- Clear browser cache if UI doesn't update

## 📝 License

This project is licensed under the MIT License - free for educational and personal use.

## 👥 Contributors

Developed as an educational Operating Systems project demonstrating:
- Virtual memory management
- CPU scheduling algorithms  
- Process synchronization
- File system operations
- Web-based OS simulation

## 🙏 Acknowledgments

- Inspired by classic OS textbooks (Mayank Kumar)
- Built with modern web technologies (React, Context API, Bootstrap)
- Designed for hands-on learning and experimentation

## 📧 Support

For questions or issues:
- Check the in-app `help` command
- Review component documentation in `docs/`
- Experiment with different commands and configurations

---

**CoreX OS** - Making operating systems concepts interactive, visual, and fun to learn! 🎓✨
