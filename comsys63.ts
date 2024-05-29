//  v.6.31 (comsys63.ts)
/* users passports base */
"use strict";
type userPassportType  ={name:string, imgSrc:string};
type userBaseType = userPassportType[];
type cBaseItem = {text:string,rate:number,date:string,time:string,answers:number};
type cBaseType = cBaseItem[];
type rBaseItem = {toCIDX:number,text:string,rate:number,date:string,time:string};
type rBaseType = rBaseItem[];
type usrIDType = {byCIDX:number[],byRIDX:number[],byName:{[key:string]:number}};
type menuSortType = {text:string, krit:string}[];
type cmElement = HTMLElement|null;
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
  centeredWrap:cmElement = doc.querySelector(".bin1"),
  container:cmElement  = doc.querySelector(".commentContainer"),
  commntsAmount:cmElement  = doc.querySelector(".commntsAmount"),
  commntsHeaderLine:cmElement  = doc.querySelector(".commntsHeaderLine"),
  favControl:cmElement  = doc.querySelector(".favCntrl");

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
    let spHoopWidth = sTor("spHoopWidth");
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
    const ordPic:cmElement = doc.querySelector(".ordPic"),
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
  const inputTextFormMain= doc.querySelector(".inputForm") as HTMLDivElement;
  if (!inputTextFormMain) {
    inputTextForm(activeUser.getName, 0);
  }
};




};

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
