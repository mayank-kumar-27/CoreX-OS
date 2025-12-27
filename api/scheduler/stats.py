import json

# Global state (in production, use database) - Note: state won't persist in serverless
scheduler_data = {
    "processes": [],
    "gantt_chart": [],
    "statistics": {}
}

def handler(request):
    """Get scheduler statistics"""
    if request.method == 'GET':
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(scheduler_data['statistics'])
        }
    
    return {
        "statusCode": 405,
        "body": "Method not allowed"
    }