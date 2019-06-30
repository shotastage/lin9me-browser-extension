let dispArea = document.getElementById("shortened_url");

chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
    function(tabs) {

        var currentURL = tabs[0].url;

        getShortenedURL(currentURL);
    }
);


function getShortenedURL(current) {
    var xhr = new XMLHttpRequest();
    var url = "https://lin9.me/shorten_link";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            dispArea.innerText = json.shorten;
        }
    };
    var data = JSON.stringify({"origin": current});
    xhr.send(data);
}
