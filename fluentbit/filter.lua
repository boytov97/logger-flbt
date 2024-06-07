function process(tag, timestamp, record)
    if record["level"] ~= "DEBUG" and record["env"] == "production" then
        return 0, timestamp, record
    else
        return -1, timestamp, record
    end
end
