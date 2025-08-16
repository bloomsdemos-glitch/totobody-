#!/usr/bin/env python3
"""
Simple HTTP server for the TOTOBODY fitness app.
Serves static files on port 5000.
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

class HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler to serve static files."""
    
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        """Handle GET requests."""
        # Serve index.html for root path
        if self.path == '/':
            self.path = '/index.html'
        
        # Check if file exists
        file_path = self.path.lstrip('/')
        if not os.path.exists(file_path):
            self.send_error(404, f"File not found: {file_path}")
            return
            
        return super().do_GET()

def main():
    """Start the HTTP server."""
    port = 5000
    host = '0.0.0.0'
    
    # Change to the current directory
    os.chdir(Path(__file__).parent)
    
    try:
        with socketserver.TCPServer((host, port), HTTPRequestHandler) as httpd:
            print(f"🏋️ TOTOBODY Fitness App running at http://{host}:{port}")
            print("📱 Open this URL in your browser to use the app")
            print("⏹️  Press Ctrl+C to stop the server")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        sys.exit(0)
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ Port {port} is already in use. Please try a different port.")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
