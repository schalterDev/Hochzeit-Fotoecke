require("Settings")

local serverString = "http://" .. server
local lockdir = "/uploaded/" 
local logs = io.open(logfile, "a")
logs:write("Script triggered\n")

function exists(path)
    if lfs.attributes(path) then
        return true
    else
        return false
    end
end

function is_uploaded(path)
    local hash = fa.hash("md5", path, "")
    return exists(lockdir .. hash)
end

function set_uploaded(path)
    local hash = fa.hash("md5", path, "")
    local file = io.open(lockdir .. hash, "w")
    file:close()
end

function upload_file(folder, file)
    local path = folder .. "/" .. file

    logs:write(file .. " start upload with body " .. path .. "\n")
    -- responseBody, statusCode, header
    local b, c, h = fa.request {
        url = serverString, 
        method = "POST", 
        headers = {["Content-Type"] = "text/plain",
        ["Content-Length"] = string.len(path)}, 
        body = path
    }

    --Check to see if it worked, and log the result!
    if (c == 200) then
        logs:write(" Success!\n")
        set_uploaded(path)
    else
        logs:write("Fail ")
	    logs:write("status: " .. c .. ", ")
	    logs:write("body: " .. b .. " \n")
    end
    
end

function walk_directory(folder)
    -- Recursively iterate filesystem
    for file in lfs.dir(folder) do
        local path = folder .. "/" .. file
        local attr = lfs.attributes(path)
        logs:write( "Found "..attr.mode..": " .. path .. "\n")

        if attr.mode == "file" then
            if not is_uploaded(path) then
                logs:write(path .. " needs to be uploaded\n")
                upload_file(folder, file)
            else
                logs:write(path .. " previously uploaded, skipping \n")
            end
        elseif attr.mode == "directory" then
            walk_directory(path)
        end
    end
end

-- wait for wifi to connect
-- while string.sub(fa.ReadStatusReg(),13,13) ~= "a" do
--     logs.write("Wifi not connected. Waiting...")
--     sleep(1000)
-- end

walk_directory(folderUpload)

logs:write("script ended\n")
logs:write("------------\n\n")
logs:close()
