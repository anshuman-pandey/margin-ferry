"""Run browser acceptance with disposable browser storage and loopback hosting."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
import subprocess
from threading import Thread
root=Path(__file__).resolve().parents[1]
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(root)))
Thread(target=server.serve_forever,daemon=True).start()
try:
    subprocess.run(['node','browser.test.cjs'],cwd=root,env=dict(os.environ,TEST_URL=f'http://127.0.0.1:{server.server_port}'),check=True,timeout=120)
finally:
    server.shutdown();server.server_close()
