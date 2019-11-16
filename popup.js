let dispArea = document.getElementById("shortened_url");
    loading = document.getElementById("loading");
    message = document.getElementById("message");
    accessCount = document.getElementById("access_count");

chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
    function(tabs) {

        var currentURL = tabs[0].url;

        if (currentURL.match(/^(https?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/) === null) {
            loading.classList.add("invisible");
            dispArea.classList.remove("invisible");
            dispArea.innerText = currentURL;
            message.classList.add("is-active");
            message.innerText = createErrorMessage(currentURL);
            return
        }

        getShortenedURL(currentURL);
    }
);


function getShortenedURL(current) {
    var xhr = new XMLHttpRequest();
    var url = "https://2oo.pw/shorten_link";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            loading.classList.add("invisible");

            message.classList.add("is-active");
            setTimeout(function (){
                message.classList.remove("is-active");
            }, 2000);


            dispArea.classList.remove("invisible");
            dispArea.innerText = json.shorten;

            if (json.count !== 0) {
                accessCount.classList.remove("invisible");
                accessCount.innerText = "このリンクは" + json.count + "回アクセスされています.";
            }

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
    let ua = navigator.userAgent;

    var browser = "Chrome";

    if ( ua.match("Edg")) {
        browser = "Microsoft Edge";
    }

    if ( ua.match("Edg")) {
        browser = "Microsoft Edge";
    }

    if ( ua.match("OPR")) {
        browser = "Opera";
    }

    if (currentURL.match("ftp://")) {
        return "FTPリンクは作成できません. HTTPリンクにしてください.";
    }

    if (currentURL.match("file://")) {
        return "ローカルファイルへのリンクは許可されていません.Webサイトのリンクにしてください.";
    }

    if (currentURL.match("ssh://")) {
        return "SSHはリモートコンピューターにアクセスするプロトコルです. Webサイトのリンクではありません."
    }

    if (currentURL.match("telnet://")) {
        return "Telnetはリモートコンピューターにアクセスするプロトコルです. Webサイトのリンクではありません."
    }

    if (currentURL.match("chrome://settings/") || currentURL.match("edge://settings/") || currentURL.match("opera://settings/")) {
        return "これは" + browser + "の設定ページです. Webサイトではありません.";
    }

    if (currentURL.match("chrome://extensions/") || currentURL.match("edge://extensions/")) {
        return "これは" + browser + "の拡張機能管理画面です. Webサイトではありません.";
    }

    if (currentURL.match("chrome://newtab") || currentURL.match("edge://newtab")) {
        return "これは" + browser +  "の新しいタブです. Google検索ページのリンクを共有する場合はhttps://google.comにアクセスしてください.";
    }


    return "このページは短縮できません." + browser + "の設定ページもしくは, HTTPプロトコルでない可能性があります.";
}
