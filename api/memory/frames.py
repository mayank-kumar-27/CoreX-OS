import json

# Global state (in production, use database) - Note: state won't persist in serverless
memory_data = {
    "frames": [],
    "page_faults": 0,
    "page_hits": 0,
    "algorithm": "LRU"
}

def handler(request):
    """Get frame table"""
    if request.method == 'GET':
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(memory_data['frames'])
        }
    
    return {
        "statusCode": 405,
        "body": "Method not allowed"
    }