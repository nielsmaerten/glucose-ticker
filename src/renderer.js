
const { ipcRenderer } = window.require('electron');
const apiUrl = "/api/v1/entries/current.json";
function saveUrl() {
    var nsUrl = document.getElementById("nsUrl").value
    var view = document.getElementById("view").value
    ipcRenderer.send('set-url', nsUrl + apiUrl);

    localStorage.setItem("nsUrl", nsUrl);
    localStorage.setItem("view", view)
    window.location.replace(nsUrl + view)
}

if (localStorage.getItem("nsUrl")) {
    var nsUrl = localStorage.getItem("nsUrl")
    var view = localStorage.getItem("view")
    document.getElementById("nsUrl").value = nsUrl
    ipcRenderer.send("set-url", nsUrl + apiUrl);
    window.location.replace(nsUrl + view)
}