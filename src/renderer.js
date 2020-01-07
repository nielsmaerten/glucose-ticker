
const { ipcRenderer } = window.require('electron');
const apiUrl = "/api/v1/entries/current.json";
function saveUrl() {
    var nsUrl = document.getElementById("nsUrl").value
    var view = document.getElementById("view").value
    var ranges = {
        high: document.getElementById("rangeHigh").value,
        low: document.getElementById("rangeLow").value
    }
    ipcSend({
        nsUrl: nsUrl + apiUrl,
        ranges
    });

    localStorage.setItem("nsUrl", nsUrl);
    localStorage.setItem("view", view);
    localStorage.setItem("ranges", JSON.stringify(ranges));
    window.location.replace(nsUrl + view)
}

if (localStorage.getItem("nsUrl")) {
    var nsUrl = localStorage.getItem("nsUrl")
    var view = localStorage.getItem("view")
    var ranges = JSON.parse(localStorage.getItem("ranges"))
    document.getElementById("nsUrl").value = nsUrl
    ipcSend({
        nsUrl: nsUrl + apiUrl,
        ranges
    });
    window.location.replace(nsUrl + view)
}

function ipcSend(payload) {
    ipcRenderer.send("ipc-message", payload)
}