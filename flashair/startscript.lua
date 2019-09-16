require("Settings")

local serverString = 'http://' .. server
local lockdir = "/uploaded/"
local logs = io.open(logfile, "a")
logs:write("startscript\n")
logs:close()