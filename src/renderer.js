
const { ipcRenderer } = window.require('electron');
const apiUrl = "/api/v1/entries/current.json";
function saveUrl() {
    var nsUrl = document.getElementById("nsUrl").value
    ipcRenderer.send('set-url', nsUrl + apiUrl);

    localStorage.setItem("nsUrl", nsUrl);
    window.location.replace(nsUrl + "/clock-color.html")
}

if (localStorage.getItem("nsUrl")) {
    var nsUrl = localStorage.getItem("nsUrl")
    document.getElementById("nsUrl").value = nsUrl
    ipcRenderer.send("set-url", nsUrl + apiUrl);
    window.location.replace(nsUrl + "/clock-color.html")
}