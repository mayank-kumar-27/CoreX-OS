import json

# Global state (in production, use database) - Note: state won't persist in serverless
memory_data = {
    "frames": [],
    "page_faults": 0,
    "page_hits": 0,
    "algorithm": "LRU"
}

def handler(request):
    """Set page replacement algorithm"""
    if request.method == 'POST':
        data = request.get_json()
        algorithm = data.get('algorithm', 'LRU')
        
        if algorithm not in ['FIFO', 'LRU', 'OPTIMAL']:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Invalid algorithm"})
            }
        
        memory_data['algorithm'] = algorithm
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"algorithm": algorithm})
        }
    
    return {
        "statusCode": 405,
        "body": "Method not allowed"
    }