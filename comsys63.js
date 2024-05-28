//  v.6.31 (comsys63.ts)
/* users passports base */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var uBase = [
    { name: "Андрей", imgSrc: "img/a.jpg" } /*	uBase[0]	*/,
    { name: "Борис", imgSrc: "img/b.jpg" } /*	uBase[1]	*/,
    { name: "Вика", imgSrc: "img/c.jpg" } /*	uBase[2]	*/,
    { name: "Гоша", imgSrc: "img/g.jpg" },
], /*	uBase[3]	*/ validUser = 0, errorFlag = false, usrID, cBase, rBase, mobile376 = false, auxMockDateTime, // to store the previous function mockDateTime return value
funcPool = []; // to store event handlers functions pool, only for 'buildReplyButtonsHandlers'
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
    function mockDateTime(a) {
        var tday1 = new Date();
        var day, month, monthPlus = false, date1;
        if (a) {
            day = Number(a["date"].slice(0, 2));
            month = Number(a["date"].slice(3, 5));
        }
        else {
            day = 0;
            month = 1;
        }
        day++;
        if (day > 30) {
            day = 1;
            monthPlus = true;
        }
        if (monthPlus) {
            month++;
            monthPlus = false;
            if (month > 12) {
                month = 1;
            }
        }
        date1 = [day, month, tday1.getHours(), tday1.getMinutes()];
        date1.forEach(function (x, n, date1item) {
            if (x < 10) {
                date1item[n] = "0" + x;
            }
        });
        return { date: "".concat(date1[0], ".").concat(date1[1]), time: "".concat(date1[2], ":").concat(date1[3]) };
    }
    ;
    function buildUsersIndexTable() {
        // ext. for new users enrollment to acquire userID by name
        uBase.forEach(function (i, count) {
            usrID["byName"][i["name"]] = count;
        });
    }
    ;
    buildUsersIndexTable();
    baseToStor(usrID);
    var Comment = /** @class */ (function () {
        function Comment(userName) {
            this.user = userName;
            this.showFavoritesOnly = false;
            var loadParams = [
                {
                    keyName: "uFav", initValue: { cIDX: [], rIDX: [] }
                },
                {
                    keyName: "uChange",
                    initValue: { rPermissions: [], cPermissions: [] },
                },
                {
                    keyName: "uSort",
                    initValue: { sortCriteria: null, sortOrder: Comment.iniSortOrder },
                },
            ];
            loadParams.forEach(function (paramObj, n) {
                var sTorKeyName = "".concat(paramObj["keyName"], "-").concat(userName);
                if (sTor(sTorKeyName) === null) {
                    sTor(sTorKeyName, paramObj["initValue"]);
                }
                loadParams[n]["keyName"] = sTorKeyName;
            });
            this.uFav = sTor(loadParams[0]["keyName"]);
            this.uChange = sTor(loadParams[1]["keyName"]);
            this.uSort = sTor(loadParams[2]["keyName"]);
        }
        Object.defineProperty(Comment.prototype, "getName", {
            get: function () {
                return this.user;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Comment.prototype, "getIDByName", {
            get: function () {
                return usrID["byName"][this.user];
            },
            enumerable: false,
            configurable: true
        });
        Comment.prototype.rebuildComments = function () { };
        Comment.prototype.placeComment = function (commentText) { };
        Comment.prototype.placeReply = function (comIDX, orderNumber) { };
        Comment.prototype.allowToChangeRate = function (IDX, base) { return false; };
        Comment.prototype.showFavOnly = function (state) {
            if (state === void 0) { state = false; }
            switch (state) {
                case true:
                    this.showFavoritesOnly = true;
                    break;
                case false:
                    this.showFavoritesOnly = false;
                    break;
            }
            return this.showFavoritesOnly;
        };
        Comment.prototype.setFav = function (commentIndex, baseType) {
            if (baseType === void 0) { baseType = cBase; }
            return false;
        };
        Comment.prototype.findFav = function (commentIndex, baseType) {
            if (baseType === void 0) { baseType = cBase; }
            return false;
        };
        Comment.iniSortOrder = true;
        return Comment;
    }());
    var User = /** @class */ (function (_super) {
        __extends(User, _super);
        function User() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        User.prototype.placeComment = function (commentText) {
            auxMockDateTime = mockDateTime(auxMockDateTime);
            var dateTime1 = auxMockDateTime, cBaseLen;
            // Get real Date and Time if no Date and Time specified
            if (!dateTime1) {
                dateTime1 = getDateTime();
            }
            var messageRecord = {
                text: commentText,
                rate: 0,
                date: dateTime1["date"],
                time: dateTime1["time"],
                answers: 0,
            };
            usrID["byCIDX"].push(this.getIDByName);
            cBase.push(messageRecord);
            baseToStor(usrID);
            baseToStor(cBase);
            cBaseLen = cBase.length - 1;
            showComment(cBaseLen);
            underLineSwitch();
        };
        User.prototype.placeReply = function (comIDX, orderNumber) {
            auxMockDateTime = mockDateTime(auxMockDateTime);
            inputTextForm(this.user, orderNumber, auxMockDateTime, comIDX);
        };
        User.prototype.allowToChangeRate = function (IDX, base) {
            function poolTest(auxPool, IDX) {
                var zero = 0;
                var maxChanges = userRatingChangesLimit, changes = zero;
                maxChanges--;
                if (maxChanges < zero) {
                    maxChanges = zero;
                }
                auxPool.forEach(function (i) {
                    if (i === IDX) {
                        changes++;
                    }
                });
                if (changes > maxChanges) {
                    return false;
                }
                else {
                    return true;
                }
            }
            ;
            if (base === cBase) {
                if (poolTest(this.uChange["cPermissions"], IDX)) {
                    this.uChange["cPermissions"].push(IDX);
                    sTor("uChange-".concat(this.user), this.uChange);
                    return true;
                }
            }
            else {
                if (poolTest(this.uChange["rPermissions"], IDX)) {
                    this.uChange["rPermissions"].push(IDX);
                    sTor("uChange-".concat(this.user), this.uChange);
                    return true;
                }
            }
            return false;
        };
        User.prototype.rebuildComments = function (sortCriteria, reverse) {
            if (sortCriteria === void 0) { sortCriteria = null; }
            if (reverse === void 0) { reverse = false; }
            var ordPic = doc.querySelector(".ordPic"), ordPicStl = ordPic.style;
            var vShift = Math.round(Number(ordPicStl.height.slice(0, 2)) * 2), shiftSign = "", angle = 45;
            if (sortCriteria === null) {
                if (this.uSort["sortCriteria"] === null) {
                    sortCriteria = defaultSortMenuItemNumber;
                }
                else {
                    sortCriteria = this.uSort["sortCriteria"];
                }
            }
            dispChoice(sortCriteria);
            if (this.uSort["sortCriteria"] === sortCriteria) {
                if (reverse) {
                    this.uSort["sortOrder"] = !this.uSort["sortOrder"];
                }
            }
            else {
                this.uSort["sortOrder"] = Comment.iniSortOrder;
            }
            rebuildAll(menuSort[sortCriteria]["krit"], this.uSort["sortOrder"]);
            if (this.uSort["sortOrder"]) {
                angle = -135;
                shiftSign = "-";
                vShift += 15;
            }
            ordPicStl.rotate = "".concat(angle, "deg");
            ordPicStl.translate = "0px ".concat(shiftSign).concat(vShift, "%");
            this.uSort["sortCriteria"] = sortCriteria;
            sTor("uSort-".concat(this.user), this.uSort);
        };
        User.prototype.setFav = function (commentIndex, baseType) {
            if (baseType === void 0) { baseType = cBase; }
            var favAux = [], inBase = true, favTyp = "cIDX";
            if (baseType === rBase) {
                favTyp = "rIDX";
            }
            this.uFav[favTyp].forEach(function (uFavCommentIndex) {
                if (commentIndex === uFavCommentIndex) {
                    inBase = false;
                }
                else {
                    favAux.push(uFavCommentIndex);
                }
            });
            if (inBase) {
                favAux.push(commentIndex);
            }
            this.uFav[favTyp] = favAux;
            sTor("uFav-".concat(this.user), this.uFav);
            heartSwitch();
            return inBase;
        };
        User.prototype.findFav = function (commentIndex, baseType) {
            if (baseType === void 0) { baseType = cBase; }
            var inBase = false, favTyp = "cIDX";
            if (baseType === rBase) {
                favTyp = "rIDX";
            }
            this.uFav[favTyp].forEach(function (uFavCommentIndex) {
                if (commentIndex === uFavCommentIndex) {
                    inBase = true;
                }
            });
            return inBase;
        };
        return User;
    }(Comment));
    var user = [];
    uBase.forEach(function (uBaseItem) {
        user.push(new User(uBaseItem["name"]));
    });
    var activeUser = user[Math.floor(Math.random() * 4)];
    function favPresent() {
        if (activeUser.uFav["cIDX"].length || activeUser.uFav["rIDX"].length) {
            return true;
        }
        else {
            return false;
        }
    }
    ;
    function heartSwitch() {
        var heartPic = inActFavPic;
        if (favPresent()) {
            heartPic = actFavPic;
        }
        doc.querySelector(".heartPic").src = "img/heart".concat(heartPic, ".gif");
    }
    ;
    function cls(remForm) {
        if (remForm === void 0) { remForm = false; }
        /* cls(false) - keep main input form;
       cls(true)  - remove everything (include the form) */
        var iNameToRemove = [
            ".commentBlock",
            ".commentBlockSeparator",
            ".spHoop",
            ".vertMargin",
            ".replyForm",
            ".replyBlock",
        ];
        if (remForm) {
            iNameToRemove.push(".inputForm");
        }
        var blocksToRemove = [];
        iNameToRemove.forEach(function (i) {
            blocksToRemove.push(doc.querySelectorAll(i));
        });
        blocksToRemove.forEach(function (blocks) {
            blocks.forEach(function (block) {
                block.remove();
            });
        });
    }
    ;
    function parentElFind(event) {
        if (event.target instanceof HTMLImageElement) {
            return event.target.parentElement;
        }
        else {
            return event.target;
        }
    }
    ;
    function buildReplyButtonsHandlers() {
        /* old handlers removing */
        funcPool.forEach(function (arg) {
            arg["node"].removeEventListener("click", arg["func"]);
        });
        funcPool = [];
        /* setting new handlers */
        var replyBtn = doc.querySelectorAll(".bottomCommentF0");
        replyBtn.forEach(function (i, orderNumber) {
            function placeReplyForm(event) {
                activeUser.placeReply(Number(parentElFind(event).dataset.cIDX), orderNumber);
            }
            ;
            funcPool.push({ node: i, func: placeReplyForm });
            i.addEventListener("click", placeReplyForm);
        });
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
