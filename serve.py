import http.server, os
os.chdir('/Users/dame/Desktop/timebudget')
handler = http.server.SimpleHTTPRequestHandler
with http.server.HTTPServer(('', 4322), handler) as httpd:
    httpd.serve_forever()
