import json

# Global state (in production, use database) - Note: state won't persist in serverless
scheduler_data = {
    "processes": [],
    "gantt_chart": [],
    "statistics": {}
}

def handler(request):
    """Run scheduling algorithm"""
    if request.method == 'POST':
        data = request.get_json()
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
        
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "statistics": scheduler_data['statistics'],
                "gantt_chart": scheduler_data['gantt_chart']
            })
        }
    
    return {
        "statusCode": 405,
        "body": "Method not allowed"
    }