import json

# Global state (in production, use database) - Note: state won't persist in serverless
scheduler_data = {
    "processes": [],
    "gantt_chart": [],
    "statistics": {}
}

def handler(request):
    """Get, add, or clear processes"""
    if request.method == 'GET':
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(scheduler_data['processes'])
        }
    
    elif request.method == 'POST':
        process = request.get_json()
        required_fields = ['name', 'arrival_time', 'burst_time']
        
        if not all(field in process for field in required_fields):
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Missing required fields"})
            }
        
        process['pid'] = len(scheduler_data['processes'])
        scheduler_data['processes'].append(process)
        
        return {
            "statusCode": 201,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(process)
        }
    
    elif request.method == 'DELETE':
        # Clear all processes
        scheduler_data['processes'] = []
        scheduler_data['gantt_chart'] = []
        scheduler_data['statistics'] = {}
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": "All processes cleared"})
        }
    
    return {
        "statusCode": 405,
        "body": "Method not allowed"
    }