let dispArea = document.getElementById("shortened_url");

let loading = document.getElementById("loading");

let message = document.getElementById("message");

browser.tabs.query({'active': true, 'windowId': browser.windows.WINDOW_ID_CURRENT},
    function(tabs) {

        var currentURL = tabs[0].url;

        if (currentURL.match(/^(https?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/) === null) {
            loading.classList.add("invisible");
            message.classList.remove("invisible");
            message.innerText = createErrorMessage(currentURL);
            return
        }

        getShortenedURL(currentURL);
    }
);


function getShortenedURL(current) {
    var xhr = new XMLHttpRequest();
    var url = "https://l.pnstr.com/shorten_link";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            loading.classList.add("invisible");
            message.classList.remove("invisible");
            dispArea.classList.remove("invisible");
            dispArea.innerText = json.shorten;
            saveToClipboard(json.shorten);
        }
    };
    var data = JSON.stringify({"origin": current});
    xhr.send(data);
}


function saveToClipboard(str) {
    let textArea = document.createElement("textarea");
    textArea.style.cssText = "position:absolute; left:-100%";
    document.body.appendChild(textArea);
    textArea.value = str;
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
}


function createErrorMessage(currentURL) {
    var browser = "Firefox";

    if (currentURL.match("ftp://")) {
        return "FTPプロトコルのURLは共有することができません. HTTP/HTTPSから始まるURLにしてください.";
    }

    return "このページは短縮できません." + browser + "の設定ページもしくは, HTTPプロトコルでない可能性があります.";
}
