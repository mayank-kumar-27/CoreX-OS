import json

# Global state (in production, use database) - Note: state won't persist in serverless
memory_data = {
    "frames": [],
    "page_faults": 0,
    "page_hits": 0,
    "algorithm": "LRU"
}

def handler(request):
    """Get memory management statistics"""
    if request.method == 'GET':
        hit_ratio = memory_data['page_hits'] / max(1, memory_data['page_faults'] + memory_data['page_hits']) * 100
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "algorithm": memory_data['algorithm'],
                "page_faults": memory_data['page_faults'],
                "page_hits": memory_data['page_hits'],
                "hit_ratio": hit_ratio,
                "total_frames": 256,
                "used_frames": 45
            })
        }
    
    return {
        "statusCode": 405,
        "body": "Method not allowed"
    }