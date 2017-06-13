"use strict";
function createButton(hashKey, name, script) {
    var tryScript = "try{" + script + "}catch(err){alert('There is an error in your code.\\n'+err)}";
    var newCon = document.createElement("div");
    newCon.setAttribute("key", hashKey);
    newCon.classList.add("btnbox");
    var newBtn = document.createElement("div");
    newBtn.classList.add("button");
    newBtn.innerText = name;
    chrome.tabs.query({ active: true }, function (tab) {
        try {
            if ((/chrome:\/\//).test(tab[0].url)) {
                newBtn.addEventListener("click", showMessage.bind(null,
                    "Don't use it in a \"chrome://\" page."));
            } else {
                newBtn.addEventListener("click", function () {
                    chrome.tabs.executeScript(null, { code: tryScript });
                });
            }
        }
        catch (err) {
            newBtn.addEventListener("click", showMessage.bind(null,
                "There is an error occured while add event listener."));
        }
    })
    newCon.appendChild(newBtn);
    var delBtn = document.createElement("div");
    delBtn.innerText = "×";
    delBtn.classList.add("delbtn")
    delBtn.addEventListener("click", deleteButton.bind(null, hashKey));
    newCon.appendChild(delBtn);
    document.body.insertBefore(newCon, document.querySelector(".addform"));
}

function deleteButton(hashKey) {
    document.querySelector(".btnbox[key='" + hashKey + "']").remove();
    var lsJson = JSON.parse(localStorage.myextension);
    delete lsJson[hashKey];
    localStorage.myextension = JSON.stringify(lsJson);
}

function showMessage(message) {
    clearTimeout(showMessage.timeout);
    document.querySelector(".message").style.display = "block";
    document.querySelector(".message").innerHTML = message;
    showMessage.timeout = setTimeout(function () {
        document.querySelector(".message").style.display = "none";
        document.querySelector(".message").innerHTML = "";
    }, 3000);
}

function getButtonsFromLocalStroage() {
    if (!localStorage.myextension) {
        localStorage.myextension = "{}";
    }
    var lsJson = JSON.parse(localStorage.myextension);
    for (var h in lsJson) {
        createButton(h, lsJson[h].name, lsJson[h].script);
    }
}

function addButton() {
    if (showAddButton) {
        showAddButton = false;
        document.querySelector(".add").innerHTML = "add a button";
        document.querySelector(".addform").classList.remove("show");
        var btnNameNode = document.querySelector("input[name='name']");
        var btnName = btnNameNode.value;
        btnNameNode.value = "";
        var btnScriptNode = document.querySelector("input[name='script']");
        var btnScript = btnScriptNode.value;
        btnScriptNode.value = "";
        if (btnName === "" || btnScript === "") {
            return;
        }
        var hashKey = (new Date()).valueOf().toString(36);
        var lsJson = JSON.parse(localStorage.myextension);
        lsJson[hashKey] = {};
        lsJson[hashKey].name = btnName;
        lsJson[hashKey].script = btnScript;
        localStorage.myextension = JSON.stringify(lsJson);
        createButton(hashKey, btnName, btnScript);
    } else {
        showAddButton = true;
        document.querySelector(".add").innerHTML = "add this button";
        document.querySelector(".addform").classList.add("show");
    }
}
var showAddButton = false;
document.querySelector(".add").addEventListener('click', addButton);
getButtonsFromLocalStroage();