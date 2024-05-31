//  v.6.31 (comsys63.ts)
/* users passports base */
"use strict";
type userPassportType  ={name:string, imgSrc:string};
type userBaseType = userPassportType[];
type cBaseItem = {text:string,rate:number,date:string,time:string,answers:number};
type cBaseType = cBaseItem[];
type rBaseItem = {toCIDX:number,text:string,rate:number,date:string,time:string};
type rBaseType = rBaseItem[];
    type crBaseType = cBaseType|rBaseType;
type usrIDType = {byCIDX:number[],byRIDX:number[],byName:{[key:string]:number}};
type menuSortItem = {text:string, krit:string};
type menuSortType = menuSortItem [];
type nStr = string|null;
type dateTimeObject = {date:string,time:string};  
let uBase:userBaseType = [
  { name: "Андрей", imgSrc: "img/a.jpg" } /*	uBase[0]	*/,

  { name: "Борис", imgSrc: "img/b.jpg" } /*	uBase[1]	*/,

  { name: "Вика", imgSrc: "img/c.jpg" } /*	uBase[2]	*/,

  { name: "Гоша", imgSrc: "img/g.jpg" },
], /*	uBase[3]	*/
  validUser:number = 0,
  errorFlag:boolean = false,
  usrID:usrIDType,
  cBase:cBaseType,
  rBase:rBaseType,
  mobile376:boolean = false,
  auxMockDateTime:dateTimeObject, // to store the previous function mockDateTime return value
  funcPool:{ node: HTMLDivElement, func: Function }[] = []; // to store event handlers functions pool, only for 'buildReplyButtonsHandlers'
const doc:Document = document,
  px:string = "px",
  requestString:string = "https://randomuser.me/api/",
  normal:string = "normal",
  ver:number = 631,
  minusColor:string = "red",
  plusColor:string = "rgb(138,197,64)",
  dec:string = "-",
  inc:string = "+",
  messageWrap:HTMLDivElement = doc.createElement("div"),
  progressWrap:HTMLDivElement = doc.createElement("div"),
  meStyl:CSSStyleDeclaration = messageWrap.style,
  progStyl:CSSStyleDeclaration = progressWrap.style,
  uBaseLen:number = uBase.length,
  timing1:number = 2000,
  timing2:number = timing1 / 4,
  brdWdth:string = "1px solid ",
  shadow:string = "3px 3px 2px 1px lightgray";
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
const widthBrkPnt:number = 376,
  /* rating counter changes attempts limit */
  userRatingChangesLimit:number = 1,
  /* in range [0..3] */
  defaultSortMenuItemNumber:number = 2,
  /* user input comment text max length limit */
  maxTextLength:number = 1000,
  /* sort menu items */
 
  menuSort:menuSortType = [
    { text: "По дате", krit: "date" },
    { text: "По количеству оценок", krit: "rate" },
    { text: "По актуальности", krit: normal },
    { text: "По количеству ответов", krit: "answers" },
  ],
  inActFavPic:string = "Gry",
  actFavPic:string = "Red",
  centeredWrap:HTMLDivElement  = doc.querySelector(".bin1") as HTMLDivElement,
  container:HTMLDivElement   = doc.querySelector(".commentContainer") as HTMLDivElement,
  commntsAmount:HTMLDivElement   = doc.querySelector(".commntsAmount") as HTMLDivElement,
  commntsHeaderLine:HTMLDivElement   = doc.querySelector(".commntsHeaderLine") as HTMLDivElement,
  favControl:HTMLDivElement   = doc.querySelector(".favCntrl") as HTMLDivElement;

  function insBrik():void  {
    const progressBrik:HTMLDivElement = doc.createElement("div"),
      brikStyl:CSSStyleDeclaration = progressBrik.style;
    brikStyl.width = '20' + px;
    brikStyl.height = '10'+ px;
    brikStyl.background = "red";
    progressWrap.appendChild(progressBrik);
  };

  function messageShow():void  {
    let text:string;
    const basyP:string = " базы пользователей ";
    switch (errorFlag) {
      case false:
        text = `Загрузка${basyP}из ${requestString}: Загружено ${validUser} записей из ${uBaseLen}`;
        break;
      case true:
        text = `Ошибка загрузки${basyP}из ${requestString}. Используем локальную базу`;
        break;
    }
    messageWrap.innerHTML = text + ".";
  };

  function requestUserData():void  {
    let xhR:XMLHttpRequest = new XMLHttpRequest();
    xhR.open("get", requestString);
    xhR.onload = function ():void  {
      if (xhR.status === 200) {
        let xhRResp:any = JSON.parse(xhR.response)["results"][0],
          name : string = xhRResp["name"]["first"] + " " + xhRResp["name"]["last"] ,
          picURL:string  = xhRResp["picture"]["large"];
        uBase[validUser] = { name: name, imgSrc: picURL };
        validUser++;
        insBrik();
      }
    };
    xhR.onerror = function():void  {
      errorFlag = true;
    };
    xhR.send();
  };

  /* Data save to and load from local browser storage */
 function sTor (keyName:string|null = null, value:any = null) :any {
    let functionOut:any = null;
    /* if no arguments (i.e. keyName=null) then con('stor: ERR - no args') and return */
    if (keyName === null) {
      console.log("sTor: ERR - function call with no arguments");
    } else {
      if (value === null) {
        /* request to local Stor for key named `keyName` */
        value = localStorage.getItem(keyName);
        if (value === null) {
          /* console.log('sTor: no key named - ',keyName,' in storage'); */
        } else {
          functionOut = JSON.parse(value);
        }
      } else {
        /* save the value named as `keyName` value */
        localStorage.setItem(keyName, JSON.stringify(value));
      }
    }
    return functionOut;
  };

  /* saving base to local storage */
function baseToStor (base:userBaseType|cBaseType|rBaseType|usrIDType):void {
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
  };
  /* bases initialization procedure */
function baseInit (keyName:string, cbFunction:Function):any{
    let xValue:any = sTor(keyName);
    if (xValue === null) {
      xValue = cbFunction();
      sTor(keyName, xValue);
    }
    return xValue;
  };

  /* load previous users base from storage */
const auxBase:any = sTor("uBase");

function script2():void  {
    /*	----	M A i N  	P R O C E D U R E 	----	*/
    let spHoopWidth:number = (sTor("spHoopWidth") as any) as number;
    if (centeredWrap) {centeredWrap.style.display = "block";}
    /* user ID index base init */
    usrID = baseInit("usrID", function():usrIDType{
      return {
        byCIDX: [] /* to get user ID number by comment index */,
        byRIDX: [] /* to get user (replier) ID number by reply index */,
        byName: {} /* to get user ID number by user name */,
      };
    });
    /* comments base init */
    cBase = baseInit("cBase", function():cBaseType {
      return [];
    });
    /* replies base init */
    rBase = baseInit("rBase", function():rBaseType {
      return [];
    });

/* Actual Date and Time Acquisition */  
function getDateTime ():dateTimeObject {
        const tday1:Date = new Date(),
          date1 = ([
            tday1.getDate(),
            tday1.getMonth() + 1,
            tday1.getHours(),
            tday1.getMinutes(),
          ] as any) as number[];
        date1.forEach((x:number, n:number,date1item:any) => {
          if (x as number < 10) {
            date1item[n]= ("0" + x as string) as string;
          }
        });
        return { date: `${date1[0]}.${date1[1]}`, time: `${date1[2]}:${date1[3]}` };
      };
function mockDateTime (a:dateTimeObject):dateTimeObject {
        const tday1:Date  = new Date();
        let day:number,
          month:number,
          monthPlus:boolean = false,
          date1:any;
        if (a) {
          day = Number(a["date"].slice(0, 2));
          month = Number(a["date"].slice(3, 5));
        } else {
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
        date1.forEach((x:number, n:number, date1item:any) => {
          if (x as number < 10) {
            date1item[n] = ("0" + x as string) as string;
          }
        });
        return { date: `${date1[0]}.${date1[1]}`, time: `${date1[2]}:${date1[3]}` };
      };

function buildUsersIndexTable() :void {
        // ext. for new users enrollment to acquire userID by name
        uBase.forEach((i:userPassportType, count:number) => {          
          usrID["byName"][i["name"]]  = count;
        });
      };
buildUsersIndexTable();
baseToStor(usrID);
type cIDXrIDXData =  { cIDX: number[], rIDX: number[] };
type changeRatingPermissionData = { rPermissions:number [], cPermissions:number [] };
type sortParametersData = { sortCriteria: null|number, sortOrder: boolean};
type parametersObject = {keyName:string, initValue:cIDXrIDXData|changeRatingPermissionData|sortParametersData};

class Comment {
  static iniSortOrder:boolean = true;
      user : string;
      showFavoritesOnly : boolean;
      uFav: cIDXrIDXData;
      uChange: changeRatingPermissionData;
      uSort: sortParametersData;
  constructor(userName:string) {
    this.user = userName;
    this.showFavoritesOnly  = false;
    let loadParams:parametersObject[] = [
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
    loadParams.forEach((paramObj:parametersObject, n:number) => {
      const sTorKeyName:string = `${paramObj["keyName"]}-${userName}`;
      if (sTor(sTorKeyName) === null) {
        sTor(sTorKeyName, paramObj["initValue"]);
      }
      loadParams[n]["keyName"] = sTorKeyName;
    });
    this.uFav = sTor(loadParams[0]["keyName"]);
    this.uChange = sTor(loadParams[1]["keyName"]);
    this.uSort = sTor(loadParams[2]["keyName"]);
  }
  get getName() {
    return this.user;
  }
  get getIDByName() {
    return usrID["byName"][this.user];
  }
  rebuildComments() {}
  placeComment(commentText:string):void {}
  placeReply(comIDX:number, orderNumber:number):void {}
  allowToChangeRate(IDX:number, base:cBaseType|rBaseType):boolean {return false;}
  showFavOnly(state:boolean = false) {
    switch (state) {
      case true:
        this.showFavoritesOnly = true;
        break;
      case false:
        this.showFavoritesOnly = false;
        break;
    }
    return this.showFavoritesOnly;
  }
  setFav(commentIndex:number, baseType:cBaseType|rBaseType = cBase):boolean {return false;}
  findFav(commentIndex:number, baseType:cBaseType|rBaseType = cBase):boolean {return false;}
}

class User extends Comment {
  placeComment(commentText:string):void {
    auxMockDateTime = mockDateTime(auxMockDateTime);
    let dateTime1:dateTimeObject = auxMockDateTime,
      cBaseLen:number;
    // Get real Date and Time if no Date and Time specified
    if (!dateTime1) {
      dateTime1 = getDateTime();
    }
    let messageRecord:cBaseItem = {
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
  }
  placeReply(comIDX:number, orderNumber:number):void {
    auxMockDateTime = mockDateTime(auxMockDateTime);
    inputTextForm(this.user, orderNumber, auxMockDateTime, comIDX);
  }
  allowToChangeRate(IDX:number, base:cBaseType|rBaseType):boolean  {
    function poolTest (auxPool:number[], IDX:number):boolean {
      const zero:number = 0;
      let maxChanges:number = userRatingChangesLimit,
        changes:number = zero;
      maxChanges--;
      if (maxChanges < zero) {
        maxChanges = zero;
      }
      auxPool.forEach((i:number) => {
        if (i === IDX) {
          changes++;
        }
      });
      if (changes > maxChanges) {
        return false;
      } else {
        return true;
      }
    };
    if (base === cBase) {
      if (poolTest(this.uChange["cPermissions"], IDX)) {
        this.uChange["cPermissions"].push(IDX);
        sTor(`uChange-${this.user}`, this.uChange);
        return true;
      }
    } else {
      if (poolTest(this.uChange["rPermissions"], IDX)) {
        this.uChange["rPermissions"].push(IDX);
        sTor(`uChange-${this.user}`, this.uChange);
        return true;
      }
    }
    return false;
  }
  rebuildComments(sortCriteria:null|number = null, reverse:boolean = false) {
    const ordPic:HTMLDivElement = doc.querySelector(".ordPic") as  HTMLDivElement,
      ordPicStl:CSSStyleDeclaration = (ordPic as HTMLElement).style;
    let vShift:number = Math.round(Number(ordPicStl.height.slice(0, 2)) * 2),
      shiftSign:string = "",
      angle:number = 45;
    if (sortCriteria === null) {
      if (this.uSort["sortCriteria"] === null) {
        sortCriteria = defaultSortMenuItemNumber;
      } else {
        sortCriteria = this.uSort["sortCriteria"];
      }
    }

    dispChoice(sortCriteria);

    if (this.uSort["sortCriteria"] === sortCriteria) {
      if (reverse) {
        this.uSort["sortOrder"] = !this.uSort["sortOrder"];
      }
    } else {
      this.uSort["sortOrder"] = Comment.iniSortOrder;
    }

    rebuildAll(menuSort[sortCriteria]["krit"], this.uSort["sortOrder"]);
    if (this.uSort["sortOrder"]) {
      angle = -135;
      shiftSign = "-";
      vShift += 15;
    }
    ordPicStl.rotate = `${angle}deg`;
    ordPicStl.translate = `0px ${shiftSign}${vShift}%`;
    this.uSort["sortCriteria"] = sortCriteria;
    sTor(`uSort-${this.user}`, this.uSort);
  }
  setFav(commentIndex:number, baseType:cBaseType|rBaseType = cBase):boolean {
    let favAux:number[] = [],
      inBase:boolean = true,
      favTyp:string = "cIDX";
    if (baseType === rBase) {
      favTyp = "rIDX";
    }
    this.uFav[favTyp].forEach((uFavCommentIndex:number) => {
      if (commentIndex === uFavCommentIndex) {
        inBase = false;
      } else {
        favAux.push(uFavCommentIndex);
      }
    });
    if (inBase) {
      favAux.push(commentIndex);
    }
    this.uFav[favTyp] = favAux;
    sTor(`uFav-${this.user}`, this.uFav);
    heartSwitch();
    return inBase;
  }
  findFav(commentIndex:number, baseType:cBaseType|rBaseType = cBase):boolean {
    let inBase:boolean = false,
      favTyp:string = "cIDX";
    if (baseType === rBase) {
      favTyp = "rIDX";
    }
    this.uFav[favTyp].forEach((uFavCommentIndex) => {
      if (commentIndex === uFavCommentIndex) {
        inBase = true;
      }
    });
    return inBase;
  }
}
let user:User[] = [];
uBase.forEach((uBaseItem:userPassportType) => {
  user.push(new User(uBaseItem["name"]));
});
let activeUser:User = user[Math.floor(Math.random() * 4)];

function favPresent ():boolean {
  if (activeUser.uFav["cIDX"].length || activeUser.uFav["rIDX"].length) {
    return true;
  } else {
    return false;
  }
};
function heartSwitch ():void {
  let heartPic:string = inActFavPic;
  if (favPresent()) {
    heartPic = actFavPic;
  }
  (doc.querySelector(".heartPic") as HTMLImageElement).src = `img/heart${heartPic}.gif`;
};
function cls(remForm:boolean = false):void{
  /* cls(false) - keep main input form;
 cls(true)  - remove everything (include the form) */
  const iNameToRemove:string[] = [
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
  let blocksToRemove:NodeListOf<HTMLElement>[]=[];
  iNameToRemove.forEach((i:string) => {
    blocksToRemove.push(doc.querySelectorAll(i));
  });
  blocksToRemove.forEach((blocks:NodeListOf<HTMLElement>) => {
    blocks.forEach((block:HTMLElement) => {
      block.remove();
    });
  });
};
function parentElFind (event:MouseEvent):HTMLDivElement|EventTarget|null{ 
    if (event.target instanceof HTMLImageElement) {
            return event.target.parentElement;
    } else {return event.target;}  
};
function buildReplyButtonsHandlers ():void {
  /* old handlers removing */
  funcPool.forEach((arg) => {
    arg["node"].removeEventListener("click", arg["func"] as any);
  });
  funcPool = [];
  /* setting new handlers */
  const replyBtn:NodeListOf<HTMLDivElement> = doc.querySelectorAll(".bottomCommentF0");
  replyBtn.forEach((i:HTMLDivElement, orderNumber:number) => {
    function placeReplyForm (event:MouseEvent):void {
      activeUser.placeReply(
                             Number((parentElFind(event) as HTMLDivElement).dataset.cIDX), orderNumber );
    };
    funcPool.push({ node: i, func: placeReplyForm });
    i.addEventListener("click", placeReplyForm);
  });
};
function dateToNumber (stringDate:string):number {
  const a:number = Number(stringDate),
    b:number = Math.floor(a);    
  return b + Math.round((a - b) * 100 * 31);
};
function rebuildAll (krit:string = normal, order:boolean = false) {
  let auxArray:number[] = [];
  cls(true);
  (container as HTMLDivElement).style.display = "block";
  if (krit === normal) {
    // sort by normal
    cBase.forEach((commentRecord:cBaseItem, cIDX:number) => {
      if (order) {
        auxArray.push(cIDX);
      } else {
        auxArray.unshift(cIDX);
      }
    });
  } else {
    // sort by answers,rate,date
    let sBase:number[] = [];
    //sBase Fill
    let locBas:number|null =null;
    cBase.forEach((commentRecord:cBaseItem) => {
      let result:number;
      if (commentRecord) {
        if (krit === "date") {
          result = dateToNumber(commentRecord["date"]);
        } else {
          result = commentRecord[krit];
        }
        sBase.push(result);
        /* locBase searching */
       
        if (locBas === null) {                   
          locBas = result;
        } else {
          if ((order && result  > (locBas as number)) || (!order && result < (locBas as number))) {
          locBas = result;
          }
        }
      }
    });
    if (order) {
      ((locBas as any) as number)++;
    } else {
      ((locBas as any) as number)--;
    } // local base setting
    let lockNext:number, cIDXi:number|null;
    do {
      lockNext = (locBas as any) as number;
      cIDXi = null;
      sBase.forEach((ans:number, n:number) => {
        if ((order && ans < lockNext) || (!order && ans > lockNext)) {
          lockNext = ans;
          cIDXi = n;
        }
      });
      if (cIDXi === null) {
        break;
      } else {
        auxArray.push(cIDXi);
        sBase[cIDXi] = (locBas as any) as number;
      }
    } while (true);
  }
  auxArray.forEach((comIDX:number) => {
    if (!activeUser.showFavOnly() || activeUser.findFav(comIDX)) {
      showComment(comIDX, krit, order);
    }
  });
  buildReplyButtonsHandlers();
  //main comment form 0 - main form
  const inputTextFormMain:HTMLDivElement= doc.querySelector(".inputForm") as HTMLDivElement;
  if (!inputTextFormMain) {
    inputTextForm(activeUser.getName, 0);
  }
};
function getProp (DomElement:HTMLElement, propertyName:string):string{
  return window
    .getComputedStyle(DomElement, null)
    .getPropertyValue(propertyName);
};
function putDiv (
  className:string,
  baseForm:HTMLDivElement|null = null,
  mode:number|null = null,
  innerContent:string = "",
):HTMLDivElement{
  if (mode === null) {
    if (baseForm === null) {
      mode = 3;
    } else {
      mode = 2;
    }
  }
  const sampDiv:HTMLDivElement = doc.createElement("div");
  sampDiv.className = className;
  sampDiv.innerHTML = innerContent;
  switch (mode) {
    case 0:
      (container as HTMLDivElement).insertBefore(sampDiv, baseForm);
      break;
    case 1:
       (baseForm as HTMLDivElement).innerHTML = "";
    case 2:
      (baseForm as HTMLDivElement).appendChild(sampDiv);
    case 3:
      break;
    default:
      console.log("putDiv:incorrect operMode -", mode);
  }
  return sampDiv;
};
  // 			---	sort order Menu selector	---
  const sortMenuWrap:HTMLDivElement= doc.querySelector(".sortMenuWrap") as HTMLDivElement,
    sortMenuLink:HTMLDivElement = putDiv("sortMenu", sortMenuWrap),
    sortMenuBottom:number = sortMenuLink.getBoundingClientRect().bottom,
    listContainer:HTMLDivElement  = putDiv("listContainer", sortMenuWrap),
    sortOrdPicWrap:HTMLDivElement  = putDiv("sortMenuOrdPic", sortMenuWrap),
    ordPic:HTMLDivElement  = putDiv("ordPic", sortOrdPicWrap),
    ordPicWidth:number  = ordPic.getBoundingClientRect().width,
    back:string = getProp(ordPic, "background-color"),
    srtMnuSty:CSSStyleDeclaration = listContainer.style,
    ordPicStl:CSSStyleDeclaration = ordPic.style;

  ordPicStl.background = `linear-gradient(135deg, ${back} 50%, transparent 50%)`;
  ordPicStl.transform = "skew(15deg, 15deg)";
  ordPicStl.height = (ordPicWidth as any) as string + px;
  sortOrdPicWrap.style.width =
    (Math.round(Math.sqrt(3 * Math.pow(ordPicWidth, 2))) as any) as string + px;
  sortMenuWrap.style.position = "relative";
  srtMnuSty.display = "none";
  srtMnuSty.position = "absolute";
  srtMnuSty.zIndex = "1";
  srtMnuSty.top = (Math.round(sortMenuBottom * 0.7) as any) as string  + px;

  function underLineSwitch(evTarget:HTMLDivElement|null = null):void {
    const comHeaderChilds:HTMLDivElement[] = [commntsAmount, sortMenuLink, favControl],
      activeClr:string = "black",
      inActiveClr:string = "gray",
      borderThickness:string = '5' + px;

    comHeaderChilds.forEach((i:HTMLDivElement) => {
      const ist:CSSStyleDeclaration = i.style;
      if (i === evTarget) {
        ist.color = activeClr;
        ist.textDecoration = "";
        ist.borderBottom = `${borderThickness} solid ${activeClr}`;
      } else {
        ist.color = inActiveClr;
        ist.borderBottom = `${borderThickness} solid transparent`;
        ist.textDecoration = "underline";
        ist.textUnderlinePosition = "under";
      }
    });
    if (evTarget === favControl) {
      activeUser.showFavOnly(true);
    } else {
      activeUser.showFavOnly(false);
    }
    activeUser.rebuildComments();
  };
  commntsAmount.addEventListener("click", function():void{
    underLineSwitch(commntsAmount);
  });
  function dispChoice(iNumber:number|null):void {
    const itemMark:NodeListOf<HTMLDivElement> = doc.querySelectorAll(".itemMark");
    itemMark.forEach((mark:HTMLDivElement) => {
      mark.style.opacity = "0";
    });
    
    if (iNumber!=null) {
      itemMark[iNumber].style.opacity = "1";
      sortMenuLink.innerHTML = `${menuSort[iNumber]["text"]}`;
    }
  };
  menuSort.forEach((i:menuSortItem, n:number) => {
    const itemLine:HTMLDivElement = putDiv("listItem", listContainer),
      mark1:HTMLDivElement = putDiv("itemMark", itemLine),
      mark1Stl = mark1.style,
      markSign:HTMLDivElement = putDiv("markSign", mark1),
      markSignStl = markSign.style,
      itemDesc:HTMLDivElement = putDiv("itemDesc", itemLine, 2, `${i["text"]}`);
    let nStr = (n as any) as string;  
    if (i["krit"] === normal) {
      mark1Stl.opacity = "1";
    } else {
      mark1Stl.opacity = "0";
    }

    markSignStl.borderStyle = "solid";
    markSignStl.rotate = "35deg";

    markSign.dataset.choiceNum = nStr;
    itemLine.dataset.choiceNum = nStr;
    mark1.dataset.choiceNum = nStr;
    itemDesc.dataset.choiceNum = nStr;

    itemLine.addEventListener("click", function (ev:MouseEvent):void {
      if (ev.target instanceof HTMLDivElement) {
        const iNumber:number|null = Number((ev.target as HTMLDivElement).dataset.choiceNum);
          dispChoice(iNumber);
          activeUser.rebuildComments(iNumber, true);
          srtMnuSty.display = "none";}
    });
  });
  sortMenuLink.addEventListener("click", function():void {
    underLineSwitch(sortMenuLink);
    if (srtMnuSty.display === "block") {
      srtMnuSty.display = "none";
      return;
    } else {
      srtMnuSty.display = "block";
    }

    const itemMark:NodeListOf<HTMLDivElement> = doc.querySelectorAll(".itemMark"),
      itemDesc:HTMLDivElement = doc.querySelector(".itemDesc") as HTMLDivElement,
      itemDescDim:DOMRect = itemDesc.getBoundingClientRect(),
      markDim:number = Math.floor(itemDescDim.height),
      markSign:NodeListOf<HTMLDivElement> = doc.querySelectorAll(".markSign");
    itemMark.forEach((mark:HTMLDivElement) => {
      const markStl:CSSStyleDeclaration = mark.style;
      let markDimStr = (markDim as any) as string;
      markStl.width = markDimStr + px;
      markStl.height = markDimStr + px;
    });
    markSign.forEach((sign:HTMLDivElement) => {
      const signStl:CSSStyleDeclaration = sign.style;
      signStl.width = (Math.floor(markDim / 2.7) as any) as string + px;
      signStl.height = (Math.floor(markDim / 1.5) as any) as string + px;
      signStl.translate = "0px -" + (Math.floor(markDim / 5)  as any) as string + px;
    });
  });
  doc.addEventListener("click", function(ev:MouseEvent):void {
    if (
      !(ev.target === listContainer || ev.target === sortMenuLink) &&
      srtMnuSty.display === "block"
    ) {
      srtMnuSty.display = "none";
    }
  });
  listContainer.addEventListener("click", function ():void {
    srtMnuSty.display = "none";
  });
  // end of 		---	sort order Menu selector		---
  //         		---	favorites on/off Menu control		---
  favControl.addEventListener("click", function():void {
    underLineSwitch(favControl);
  });
  // end of 		---	favorites on/off Menu control		---
  function putBtn (className1:string, baseForm:HTMLDivElement, caption:string, func:EventListener):HTMLButtonElement {
    const sample:HTMLButtonElement = doc.createElement("button");
    sample.innerHTML = caption;
    sample.className = className1;
    if (baseForm) {
      baseForm.appendChild(sample);
    } else {
      baseForm = doc.querySelector("div") as HTMLDivElement;
      doc.body.insertBefore(sample, baseForm);
    }
    sample.addEventListener("click", func);
    return sample;
  };
  function strToNum (str:string):number {
    return Number(str.match(/\d+/));
  };
  /* mobile 376 px width mode */
  function checkWidth():void  {
    if (strToNum(getProp(centeredWrap, "width")) === widthBrkPnt) {
      mobile376 = true;
    } else {
      mobile376 = false;
    }
  };
  function buildBlock (baseForm:HTMLDivElement, IDX:number, baseType:boolean = false):void  {
    const prefixFv:string = `<img class='cmntFavFild' src='img/heart`,
      postfix1:string  = `.gif'>В избранно`,
      inFav:string  = `${prefixFv}${actFavPic}${postfix1}м`,
      toFav:string  = `${prefixFv}${inActFavPic}${postfix1}е`,
      startDiv:string  = "<div class=",
      termDiv:string  = "</div>",
      backArrowPic:string  = `<img class='talkBackArrow' src='img/talkBackArrow.gif'>`,
      dateTimeFieldClass:string  = `${startDiv}'dateTimeField'>`,
      dateTimeSepar:string  = "89162318y",
      dateTimeSpace:number = 9;
    let replyToName:string = "* unknown *",
      userData:userPassportType = uBase[usrID["byCIDX"][IDX]],
      hFC:string[] = [],
      base:crBaseType = cBase,
      bottomF:string = "bottomCommentF",
      bFC:string[]  = [],
      reply:boolean = false,
      favItemOrder:number = 1;

      function pushReplyTo ():void {
             hFC.push(`${backArrowPic}`);
             hFC.push(`${startDiv}'replyToName'>${replyToName}${termDiv}`);
      };
    if (baseType) {
      reply = true;
      base = rBase;
      userData = uBase[usrID["byRIDX"][IDX]];
      bottomF = "bottomReplyF";
      favItemOrder = 0;
      replyToName = uBase[usrID["byCIDX"][base[IDX]["tocIDX"]]]["name"];
      if (!mobile376) {
        pushReplyTo();
      }
    } else {
      bFC.push(`${backArrowPic}Ответить`);
    }
    bFC.push(toFav);
    hFC.unshift(userData["name"]);
    hFC.push(`${dateTimeFieldClass}${base[IDX]["date"]}${termDiv}`);
    hFC.push(dateTimeSepar);
    hFC.push(`${dateTimeFieldClass}${base[IDX]["time"]}${termDiv}`);
    /* Rating control block preforming */
    const rateBlock0:string[] = [dec, (base[IDX]["rate"] as any) as string, inc];
    let rateBlock:string[] = rateBlock0;
    if (mobile376) {
                    /* rateBlock = rateBlock0.toReversed(); */
                    rateBlock = [];
                    rateBlock0.forEach((item:string)=>{rateBlock.unshift(item)});
      if (reply) {
        pushReplyTo();
      }
    }
    bFC = bFC.concat(rateBlock);

    /*User Avatar Section*/
    putDiv(
      "userAvatarWrap",
      baseForm,
      2,
      `<img src=${userData["imgSrc"]} class="userAvatar">`,
    );
    /*User Content Section Left Margin */
    putDiv("userContentLMargin", baseForm);
    /*User Content Section: Header (FIO, BackArrow Sign, Date, Time*/
    const usrCntnt:HTMLDivElement = putDiv("userContent", baseForm);
    /*User content section header container*/
    const contentHeader:HTMLDivElement = putDiv("contentHeader", usrCntnt);
    /*Header blocks building*/
    /* hFC = [userData['name'],'1.BackArrow',replyToName,base[IDX]['date'],'*S*',base[IDX]['time']]; */
    hFC.forEach((hFC:string, i:number) => {
      let space:HTMLDivElement = putDiv(`headerF headerF${i}`, contentHeader, 2, hFC);
      if (hFC === dateTimeSepar) {
        space.style.width = dateTimeSpace + px;
        space.innerHTML = "";
      }
    });
    /*User Comment Textblock*/
    putDiv("commentText", usrCntnt, 2, `${base[IDX]["text"]}`);
    /*User content section bottom container*/
    const contentBottom:HTMLDivElement = putDiv("contentBottom", usrCntnt);
    /*Bottom blocks building*/
    /* bFC = ['0.Reply',`${base[IDX]['fav']}`,`${base[IDX]['rate']}`]; */

    function rateClr (rateValue:number, elementStyle:CSSStyleDeclaration):void {
      // set the comment/reply rate counter font color. 
      // negative values rate - 'minusColor'; positive values with 'plusColor'
      if (rateValue > 0) {
        elementStyle.color = plusColor;
      } else {
        if (rateValue === 0) {
          elementStyle.color = "";
        } else {
          elementStyle.color = minusColor;
        }
      }
    };
    let rateCtrlWrap:HTMLDivElement|null = null;
    bFC.forEach((bFC:string, i:number) => {
      let contentBottomF:HTMLDivElement|null = null;
      if ((bFC === inc || bFC === dec) && !rateCtrlWrap) {
        rateCtrlWrap = putDiv("rateCtrlWrap", contentBottom);
      }
      if (rateCtrlWrap) {
        contentBottomF = putDiv(`rateCtrl`, rateCtrlWrap, 2, `${bFC}`);
        if (mobile376) {
          contentBottomF.style.margin = '0' + px;
        }
      } else {
        contentBottomF = putDiv(
          `bottomF ${bottomF}${i}`,
          contentBottom,
          2,
          `${bFC}`,
        );
      }
      // cBFs - auxiliary local constant
      const cBFs:CSSStyleDeclaration = contentBottomF.style;
      if (bFC === inc || bFC === dec) {
        // bFC is plus or minus
        cBFs.borderRadius = "50%";
        cBFs.backgroundColor = "rgb(230,230,230)";
        if (bFC === inc) {
          cBFs.color = plusColor;
        } else {
          cBFs.color = minusColor;
        }
        /* set + and - rating control wrap width equal to the height from CSS file */
        const iHeight:string = (Math.floor(
                contentBottomF.getBoundingClientRect().height) as any) as string;
        cBFs.width = iHeight + px;

        contentBottomF.addEventListener("click", (ev:MouseEvent) => {
          if (ev.target instanceof HTMLDivElement) {
            const bottomBlock:HTMLDivElement|null = ev.target.parentElement as HTMLDivElement,
              rateDisplayEl:ChildNode|null = (bottomBlock.querySelector(".rateCtrl") as HTMLDivElement).nextSibling;
            if (activeUser.allowToChangeRate(IDX, base)) {
              if (ev.target.innerHTML === dec) {
                base[IDX]["rate"]--;
              } else {
                base[IDX]["rate"]++;
              }
              rateClr(base[IDX]["rate"], (rateDisplayEl as HTMLDivElement).style);
              baseToStor(base);
              (rateDisplayEl as HTMLDivElement).innerHTML = (base[IDX]["rate"] as any) as string;
            }
        };
        });
      } else {
        // bFC is not plus or minus
        if (rateCtrlWrap) {
          // rating counter style
          cBFs.cursor = "default";
          rateClr(base[IDX]["rate"], cBFs);
          cBFs.fontWeight = "600";
        }
        contentBottomF.dataset.cIDX = (IDX as any) as string;
        if (favItemOrder === i) {
          if (reply) {
            cBFs.marginLeft = "";
          } else {
            cBFs.marginLeft = 15 + px;
          }
          if (activeUser.findFav(IDX, base)) {
            contentBottomF.innerHTML = inFav;
          } else {
            contentBottomF.innerHTML = toFav;
          }

          contentBottomF.addEventListener("click", (ev) => {
            if (
              activeUser.setFav(Number((parentElFind(ev) as HTMLDivElement).dataset.cIDX), base)
            ) {
              (contentBottomF as HTMLDivElement).innerHTML = inFav;
              // parent comment switch to favorite
              if (base === rBase) {
                if (!activeUser.findFav(rBase[IDX]["tocIDX"])) {
                  // comment block favorite display on
                  const cmntFavFPool:NodeListOf<HTMLDivElement> = doc.querySelectorAll(".bottomCommentF1");
                  cmntFavFPool.forEach((i:HTMLDivElement) => {
                    if (Number(i.dataset.cIDX) === rBase[IDX]["tocIDX"]) {
                      i.innerHTML = inFav;
                    }
                  });
                  activeUser.setFav(rBase[IDX]["tocIDX"]);
                }
              }
            } else {
              (contentBottomF as HTMLDivElement).innerHTML = toFav;
              if (base === cBase) {
                // reply blocks favorites displays off
                const rplytFavFPool:NodeListOf<HTMLDivElement> = doc.querySelectorAll(".bottomReplyF0");
                rBase.forEach((i:rBaseItem, rIDX:number) => {
                  if (i["tocIDX"] === IDX && activeUser.findFav(rIDX, rBase)) {
                    activeUser.setFav(rIDX, rBase);
                    // all replies favorites displays set off
                    rplytFavFPool.forEach((replyFav) => {
                      if (Number(replyFav.dataset.cIDX) === rIDX) {
                        replyFav.innerHTML = toFav;
                      }
                    });
                  }
                });
              }
            }
          });
        }
      } //bFC is not plus or minus (else end)
    }); //bFC.forEach end
  };    // end of buildBlock procedure

/* get summarized space Hooper width for Reply block left margin (showReply())*/
function getSpHoopWidth (clasName:string):number {
  const className:string = '.'+ clasName;
  if (doc.querySelector(className)) {
          return strToNum(getProp(doc.querySelector(className) as HTMLElement, "width"));
  } else {return 0}; 
  };

  function showReply(frameElement:HTMLDivElement, rIDX:number):void {
    putDiv("commentBlockSeparator", frameElement, 0);
    const replyBlock:HTMLDivElement = putDiv("replyBlock", frameElement, 0),
      spHoop:HTMLDivElement = putDiv("spHoop", replyBlock);
    if (spHoopWidth===0) {
      spHoopWidth =
        getSpHoopWidth("userAvatarWrap") + getSpHoopWidth("userContentLMargin");
      sTor("spHoopWidth", spHoopWidth);
    }
    spHoop.style.width = (spHoopWidth as any) as string + px;
    frameElement.remove();
    putDiv("vertMargin", replyBlock, 0);
    const innerReplyBlock = putDiv("innerReplyBlock", replyBlock);
    buildBlock(innerReplyBlock, rIDX, true);
  };







};/* end of 		----	M A i N  	P R O C E D U R E 	----	*/
if (auxBase) {
    uBase = auxBase;
    script2();
  } else {
    doc.body.insertBefore(progressWrap, null);
    doc.body.insertBefore(messageWrap, progressWrap);
    messageShow();
    insBrik();
    uBase.forEach(() => {
      requestUserData();
    });
    let intervalId:number = setInterval(function():void {
      messageShow();
      if (!(validUser < uBaseLen) || errorFlag) {
        clearInterval(intervalId);
        if (errorFlag) {
          progressWrap.remove();
        } else {
          localStorage.clear();
          baseToStor(uBase);
        }
        setTimeout(function():void  {
          messageWrap.remove();
          progressWrap.remove();
          script2();
        }, timing1);
      }
    }, timing2);
  }
