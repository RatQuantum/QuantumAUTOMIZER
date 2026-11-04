"""Start the MCP for Blender add-on server in Blender on a virtual screen (the cloud container has no display).

  xvfb-run -a blender --python tools/blender_mcp_headless.py &     (listens on localhost:9876)

The "blender" MCP server in .mcp.json (uvx mcp-for-blender) talks to it. The add-on refuses `blender -b`
because its commands run on Blender timers, which only fire with the interface running.
Setup once per container: copy addon.py from github.com/ahujasid/mcp-for-blender to
~/.config/blender/4.0/scripts/addons/blender_mcp.py and apt-get install blender python3-requests xvfb xauth.
"""
import importlib

import addon_utils

addon_utils.enable("blender_mcp", default_set=True, persistent=True)
mod = importlib.import_module("blender_mcp")
import bpy  # noqa: E402

server = mod.BlenderMCPServer(port=9876)
server.start()
bpy.types.blendermcp_server = server
print("BlenderMCP ready on localhost:9876", flush=True)
