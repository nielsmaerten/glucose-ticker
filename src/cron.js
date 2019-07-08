// @ts-check
const fetch = require("node-fetch").default;

const cron = async () => {
    if (!global.sharedObj.nsUrl) {return;}
    // This function is called every 10 seconds
    //console.log("Cron is running now.", JSON.stringify(global.sharedObj))

    // Check the timestamp of the last received datapoint (bg)
    const lastUpdatedTime = global.sharedObj.lastUpdatedTime

    // Are we more than 5 minutes after that?
    const _5minInMs = 1000 * 60 * 5;
    const now = new Date().getTime();
    if (now < lastUpdatedTime + _5minInMs) {
        // Last update was less than 5 minutes ago.
        return;
    } else {
        // Check nightscout site
        const reading = await checkNightscout();

        // Store the timestamp of the 'current' datapoint
        global.sharedObj.lastUpdatedTime = reading.time;

        // Pass the datapoint over to require("./set-icon")
        const setIcon = require("./set-icon");
        setIcon(reading.value, reading.direction)
    }

}

const checkNightscout = async () => {
    const nsUrl = global.sharedObj.nsUrl;
    const res = await fetch(nsUrl)
    const data = (await res.json())[0];
    return {
        value: data.sgv || data.mbg, 
        direction: data.direction,
        time: data.date
    }
}

module.exports = cron;