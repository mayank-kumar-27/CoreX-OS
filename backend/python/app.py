from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import subprocess
import os

app = Flask(__name__)
CORS(app)

# Global state (in production, use database)
scheduler_data = {
    "processes": [],
    "gantt_chart": [],
    "statistics": {}
}

memory_data = {
    "frames": [],
    "page_faults": 0,
    "page_hits": 0,
    "algorithm": "LRU"
}

vfs_data = {
    "current_dir": "/",
    "files": [],
    "stats": {}
}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "CoreX OS Backend API",
        "version": "1.0.0"
    })

# Scheduler endpoints
@app.route('/api/scheduler/processes', methods=['GET', 'POST', 'DELETE'])
def scheduler_processes():
    """Get, add, or clear processes"""
    if request.method == 'GET':
        return jsonify(scheduler_data['processes'])
    
    elif request.method == 'POST':
        process = request.json
        required_fields = ['name', 'arrival_time', 'burst_time']
        
        if not all(field in process for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        process['pid'] = len(scheduler_data['processes'])
        scheduler_data['processes'].append(process)
        
        return jsonify(process), 201
    
    elif request.method == 'DELETE':
        # Clear all processes
        scheduler_data['processes'] = []
        scheduler_data['gantt_chart'] = []
        scheduler_data['statistics'] = {}
        return jsonify({"message": "All processes cleared"}), 200

@app.route('/api/scheduler/run', methods=['POST'])
def run_scheduler():
    """Run scheduling algorithm"""
    data = request.json
    algorithm = data.get('algorithm', 'fcfs')
    
    # Here you would call the C backend or implement in Python
    # For now, return mock data
    
    scheduler_data['statistics'] = {
        "algorithm": algorithm,
        "avg_waiting_time": 5.2,
        "avg_turnaround_time": 12.4,
        "avg_response_time": 3.1,
        "cpu_utilization": 85.6
    }
    
    # Generate mock Gantt chart
    scheduler_data['gantt_chart'] = [
        {"pid": 0, "process_name": "P1", "start_time": 0, "end_time": 8},
        {"pid": 1, "process_name": "P2", "start_time": 8, "end_time": 12},
        {"pid": 2, "process_name": "P3", "start_time": 12, "end_time": 21}
    ]
    
    return jsonify({
        "statistics": scheduler_data['statistics'],
        "gantt_chart": scheduler_data['gantt_chart']
    })

@app.route('/api/scheduler/gantt', methods=['GET'])
def get_gantt_chart():
    """Get Gantt chart data"""
    return jsonify(scheduler_data['gantt_chart'])

@app.route('/api/scheduler/stats', methods=['GET'])
def get_scheduler_stats():
    """Get scheduler statistics"""
    return jsonify(scheduler_data['statistics'])

# Memory Management endpoints
@app.route('/api/memory/stats', methods=['GET'])
def get_memory_stats():
    """Get memory management statistics"""
    return jsonify({
        "algorithm": memory_data['algorithm'],
        "page_faults": memory_data['page_faults'],
        "page_hits": memory_data['page_hits'],
        "hit_ratio": memory_data['page_hits'] / max(1, memory_data['page_faults'] + memory_data['page_hits']) * 100,
        "total_frames": 256,
        "used_frames": 45
    })

@app.route('/api/memory/frames', methods=['GET'])
def get_frame_table():
    """Get frame table"""
    return jsonify(memory_data['frames'])

@app.route('/api/memory/algorithm', methods=['POST'])
def set_memory_algorithm():
    """Set page replacement algorithm"""
    data = request.json
    algorithm = data.get('algorithm', 'LRU')
    
    if algorithm not in ['FIFO', 'LRU', 'OPTIMAL']:
        return jsonify({"error": "Invalid algorithm"}), 400
    
    memory_data['algorithm'] = algorithm
    return jsonify({"algorithm": algorithm})

# VFS endpoints
@app.route('/api/vfs/ls', methods=['GET'])
def vfs_list_directory():
    """List directory contents"""
    path = request.args.get('path', '/')
    
    # Mock data
    return jsonify({
        "path": path,
        "entries": [
            {"name": "home", "type": "directory", "size": 0},
            {"name": "etc", "type": "directory", "size": 0},
            {"name": "var", "type": "directory", "size": 0},
            {"name": "readme.txt", "type": "file", "size": 1024}
        ]
    })

@app.route('/api/vfs/cat', methods=['GET'])
def vfs_read_file():
    """Read file contents"""
    path = request.args.get('path', '')
    
    if not path:
        return jsonify({"error": "Path required"}), 400
    
    return jsonify({
        "path": path,
        "content": "Sample file content from CoreX OS"
    })

@app.route('/api/vfs/stats', methods=['GET'])
def get_vfs_stats():
    """Get VFS statistics"""
    return jsonify({
        "total_inodes": 256,
        "used_inodes": 12,
        "total_blocks": 1024,
        "used_blocks": 48,
        "block_size": 4096
    })

# Synchronization endpoints
@app.route('/api/sync/producer-consumer', methods=['POST'])
def run_producer_consumer():
    """Run producer-consumer simulation"""
    data = request.json
    num_producers = data.get('producers', 2)
    num_consumers = data.get('consumers', 2)
    
    return jsonify({
        "status": "running",
        "producers": num_producers,
        "consumers": num_consumers,
        "items_produced": 0,
        "items_consumed": 0
    })

@app.route('/api/sync/philosophers', methods=['POST'])
def run_dining_philosophers():
    """Run dining philosophers simulation"""
    return jsonify({
        "status": "running",
        "philosophers": 5,
        "total_meals": 0
    })

# Command execution endpoint
@app.route('/api/shell/execute', methods=['POST'])
def execute_command():
    """Execute shell command"""
    data = request.json
    command = data.get('command', '').strip()
    
    if not command:
        return jsonify({"error": "Command required"}), 400
    
    cmd_parts = command.split()
    cmd = cmd_parts[0]
    
    # Simulate shell command outputs
    output = ""
    
    if cmd == 'help':
        output = """
=== CoreX OS Commands ===

File System:
  ls [path]          - List directory contents
  cd <path>          - Change directory
  pwd                - Print working directory
  cat <file>         - Display file contents
  mkdir <dir>        - Create directory
  rm <file>          - Remove file
  touch <file>       - Create empty file
  echo <text>        - Print text

System Information:
  ps                 - List processes
  meminfo            - Memory statistics
  schedinfo          - Scheduler statistics
  vfsinfo            - File system statistics

Scheduling:
  schedule <algo>    - Run scheduler (fcfs, sjf, rr, priority)
  gantt              - Display Gantt chart

Synchronization:
  prodcons           - Producer-Consumer demo
  philosophers       - Dining Philosophers demo

General:
  help               - Show this help
  clear              - Clear screen
  exit               - Exit CoreX OS
"""
    elif cmd == 'ls':
        output = """
Directory listing:
d  home
d  etc
d  tmp
-  readme.txt
"""
    elif cmd == 'pwd':
        output = "/"
    
    elif cmd == 'ps':
        output = """
PID    Name          State      Arrival  Burst  Priority
----   ------------  ---------  -------  -----  --------
0      Process_A     READY      0        5      2
1      Process_B     READY      1        3      1
2      Process_C     READY      2        8      3
3      Process_D     READY      3        6      2
"""
    
    elif cmd == 'meminfo':
        output = """
Memory Management Unit Statistics:
Algorithm: LRU
Total Frames: 256
Frame Size: 4096 bytes
Page Faults: 15
Page Hits: 85
Hit Ratio: 85.00%
Swap Ins: 15
Swap Outs: 10
"""
    
    elif cmd == 'schedinfo':
        output = """
CPU Scheduler Statistics:
Algorithm: FCFS (First-Come, First-Served)
Total Processes: 4
Average Waiting Time: 9.25
Average Turnaround Time: 14.75
Average Response Time: 9.25
CPU Utilization: 100.00%
"""
    
    elif cmd == 'vfsinfo':
        output = """
Virtual File System Statistics:
Total Inodes: 256
Used Inodes: 5
Free Inodes: 251
Total Blocks: 1024
Used Blocks: 12
Free Blocks: 1012
Block Size: 4096 bytes
Total Storage: 4.00 MB
Used Storage: 0.05 MB
Free Storage: 3.95 MB
"""
    
    elif cmd == 'echo':
        if len(cmd_parts) > 1:
            output = ' '.join(cmd_parts[1:])
        else:
            output = ""
    
    elif cmd == 'mkdir':
        if len(cmd_parts) > 1:
            output = f"Directory created: {cmd_parts[1]}"
        else:
            output = "Usage: mkdir <directory>"
    
    elif cmd == 'touch':
        if len(cmd_parts) > 1:
            output = f"File created: {cmd_parts[1]}"
        else:
            output = "Usage: touch <file>"
    
    elif cmd == 'cat':
        if len(cmd_parts) > 1:
            output = f"Contents of {cmd_parts[1]}:\n(File content would appear here)"
        else:
            output = "Usage: cat <file>"
    
    elif cmd == 'cd':
        if len(cmd_parts) > 1:
            output = f"Changed directory to: {cmd_parts[1]}"
        else:
            output = "Changed directory to: /"
    
    elif cmd == 'gantt':
        output = """
Gantt Chart (FCFS):
Time: 0----5--------8------------16-------22
Proc: | P1  |  P2   |     P3     |  P4   |
"""
    
    elif cmd == 'schedule':
        if len(cmd_parts) > 1:
            algo = cmd_parts[1].upper()
            output = f"""
Running {algo} scheduling...
Processes scheduled successfully!
Use 'gantt' to view the Gantt chart.
Use 'schedinfo' to view statistics.
"""
        else:
            output = "Usage: schedule <algorithm>\nAlgorithms: fcfs, sjf, rr, priority"
    
    else:
        output = f"Command not found: {cmd}\nType 'help' for available commands"
    
    return jsonify({
        "command": command,
        "output": output.strip()
    })

if __name__ == '__main__':
    print("Starting CoreX OS Backend API...")
    print("API Documentation: http://localhost:5000/api/health")
    app.run(debug=True, host='0.0.0.0', port=5000)
