//  v.6.31 (comsys63.ts)
/* users passports base */
"use strict";
var uBase = [
    { name: "Андрей", imgSrc: "img/a.jpg" } /*	uBase[0]	*/,
    { name: "Борис", imgSrc: "img/b.jpg" } /*	uBase[1]	*/,
    { name: "Вика", imgSrc: "img/c.jpg" } /*	uBase[2]	*/,
    { name: "Гоша", imgSrc: "img/g.jpg" },
], /*	uBase[3]	*/ validUser = 0, errorFlag = false, user = [], usrID = null, cBase = null, rBase = null, mobile376 = false, auxMockDateTime = null, // to store the previous function mockDateTime return value
activeUser, funcPool = []; // to store event handlers functions pool, only for 'buildReplyButtonsHandlers'
var doc = document, px = "px", requestString = "https://randomuser.me/api/", normal = "normal", ver = 631, minusColor = "red", plusColor = "rgb(138,197,64)", dec = "-", inc = "+", messageWrap = doc.createElement("div"), progressWrap = doc.createElement("div"), meStyl = messageWrap.style, progStyl = progressWrap.style, uBaseLen = uBase.length, timing1 = 2000, timing2 = timing1 / 4, brdWdth = "1px solid ", shadow = "3px 3px 2px 1px lightgray";
meStyl.border = brdWdth + "red";
meStyl.padding = '8' + px;
meStyl.display = "inline-block";
meStyl.fontSize = '22' + px;
progStyl.border = brdWdth + "blue";
progStyl.minWidth = '100' + px;
progStyl.display = "inline-flex";
meStyl.boxShadow = shadow;
progStyl.marginLeft = '10' + px;
progStyl.background = "green";
progStyl.boxShadow = shadow;
/* mobile version width marker */
var widthBrkPnt = 376, 
/* rating counter changes attempts limit */
userRatingChangesLimit = 1, 
/* in range [0..3] */
defaultSortMenuItemNumber = 2, 
/* user input comment text max length limit */
maxTextLength = 1000, 
/* sort menu items */
menuSort = [
    { text: "По дате", krit: "date" },
    { text: "По количеству оценок", krit: "rate" },
    { text: "По актуальности", krit: normal },
    { text: "По количеству ответов", krit: "answers" },
], inActFavPic = "Gry", actFavPic = "Red", centeredWrap = doc.querySelector(".bin1"), container = doc.querySelector(".commentContainer"), commntsAmount = doc.querySelector(".commntsAmount"), commntsHeaderLine = doc.querySelector(".commntsHeaderLine"), favControl = doc.querySelector(".favCntrl");
function insBrik() {
    var progressBrik = doc.createElement("div"), brikStyl = progressBrik.style;
    brikStyl.width = '20' + px;
    brikStyl.height = '10' + px;
    brikStyl.background = "red";
    progressWrap.appendChild(progressBrik);
}
;
function messageShow() {
    var text;
    var basyP = " базы пользователей ";
    switch (errorFlag) {
        case false:
            text = "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430".concat(basyP, "\u0438\u0437 ").concat(requestString, ": \u0417\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E ").concat(validUser, " \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0438\u0437 ").concat(uBaseLen);
            break;
        case true:
            text = "\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438".concat(basyP, "\u0438\u0437 ").concat(requestString, ". \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u043C \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u0443\u044E \u0431\u0430\u0437\u0443");
            break;
    }
    messageWrap.innerHTML = text + ".";
}
;
function requestUserData() {
    var xhR = new XMLHttpRequest();
    xhR.open("get", requestString);
    xhR.onload = function () {
        if (xhR.status === 200) {
            var xhRResp = JSON.parse(xhR.response)["results"][0], name_1 = xhRResp["name"]["first"] + " " + xhRResp["name"]["last"], picURL = xhRResp["picture"]["large"];
            uBase[validUser] = { name: name_1, imgSrc: picURL };
            validUser++;
            insBrik();
        }
    };
    xhR.onerror = function () {
        errorFlag = true;
    };
    xhR.send();
}
;
/* Data save to and load from local browser storage */
function sTor(keyName, value) {
    if (keyName === void 0) { keyName = null; }
    if (value === void 0) { value = null; }
    var functionOut = null;
    /* if no arguments (i.e. keyName=null) then con('stor: ERR - no args') and return */
    if (keyName === null) {
        console.log("sTor: ERR - function call with no arguments");
    }
    else {
        if (value === null) {
            /* request to local Stor for key named `keyName` */
            value = localStorage.getItem(keyName);
            if (value === null) {
                /* console.log('sTor: no key named - ',keyName,' in storage'); */
            }
            else {
                functionOut = JSON.parse(value);
            }
        }
        else {
            /* save the value named as `keyName` value */
            localStorage.setItem(keyName, JSON.stringify(value));
        }
    }
    return functionOut;
}
;
/* saving base to local storage */
function baseToStor(base) {
    switch (base) {
        case uBase:
            sTor("uBase", uBase);
            break;
        case cBase:
            sTor("cBase", cBase);
            break;
        case rBase:
            sTor("rBase", rBase);
            break;
        case usrID:
            sTor("usrID", usrID);
            break;
    }
}
;
/* bases initialization procedure */
function baseInit(keyName, cbFunction) {
    var xValue = sTor(keyName);
    if (xValue === null) {
        xValue = cbFunction();
        sTor(keyName, xValue);
    }
    return xValue;
}
;
/* load previous users base from storage */
var auxBase = sTor("uBase");
function script2() {
    /*	----	M A i N  	P R O C E D U R E 	----	*/
    var spHoopWidth = sTor("spHoopWidth");
    if (centeredWrap) {
        centeredWrap.style.display = "block";
    }
    /* user ID index base init */
    usrID = baseInit("usrID", function () {
        return {
            byCIDX: [] /* to get user ID number by comment index */,
            byRIDX: [] /* to get user (replier) ID number by reply index */,
            byName: {} /* to get user ID number by user name */,
        };
    });
    /* comments base init */
    cBase = baseInit("cBase", function () {
        return [];
    });
    /* replies base init */
    rBase = baseInit("rBase", function () {
        return [];
    });
    /* Actual Date and Time Acquisition */
    function getDateTime() {
        var tday1 = new Date(), date1 = [
            tday1.getDate(),
            tday1.getMonth() + 1,
            tday1.getHours(),
            tday1.getMinutes(),
        ];
        date1.forEach(function (x, n, date1item) {
            if (x < 10) {
                date1item[n] = "0" + x;
            }
        });
        return { date: "".concat(date1[0], ".").concat(date1[1]), time: "".concat(date1[2], ":").concat(date1[3]) };
    }
    ;
}
;
if (auxBase) {
    uBase = auxBase;
    script2();
}
else {
    doc.body.insertBefore(progressWrap, null);
    doc.body.insertBefore(messageWrap, progressWrap);
    messageShow();
    insBrik();
    uBase.forEach(function () {
        requestUserData();
    });
    var intervalId_1 = setInterval(function () {
        messageShow();
        if (!(validUser < uBaseLen) || errorFlag) {
            clearInterval(intervalId_1);
            if (errorFlag) {
                progressWrap.remove();
            }
            else {
                localStorage.clear();
                baseToStor(uBase);
            }
            setTimeout(function () {
                messageWrap.remove();
                progressWrap.remove();
                script2();
            }, timing1);
        }
    }, timing2);
}
