//  v.6.31 (comsys63.ts)
/* users passports base */
"use strict";

type userPassportType ={name:string|null, imgSrc:string|null}[];
type cBaseType = null|{text:string,rate:number,date:string,time:string,answers:number}[];
type rBaseType = null|{toCIDX:number,text:string,rate:number,date:string,time:string}[];
type usrIDType = null|{byCIDX:number[],byRIDX:number[],byName:{[key:string]:number}};
type menuSortType = {text:string, krit:string}[];
type cmElement = HTMLElement|null;
type nStr = string|null;
type dateTimeObject = {date:string,time:string};  
let uBase:userPassportType = [
  { name: "Андрей", imgSrc: "img/a.jpg" } /*	uBase[0]	*/,

  { name: "Борис", imgSrc: "img/b.jpg" } /*	uBase[1]	*/,

  { name: "Вика", imgSrc: "img/c.jpg" } /*	uBase[2]	*/,

  { name: "Гоша", imgSrc: "img/g.jpg" },
], /*	uBase[3]	*/
  validUser:number = 0,
  errorFlag:boolean = false,
  user:[] = [],
  usrID:usrIDType = null,
  cBase:cBaseType = null,
  rBase:rBaseType = null,
  mobile376:boolean = false,
  auxMockDateTime:null|string = null, // to store the previous function mockDateTime return value
  activeUser:any,
  funcPool:[] = []; // to store event handlers functions pool, only for 'buildReplyButtonsHandlers'
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
          name : string|null = xhRResp["name"]["first"] + " " + xhRResp["name"]["last"] ,
          picURL:string|null  = xhRResp["picture"]["large"];
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
function baseToStor (base:userPassportType|cBaseType|rBaseType|usrIDType):void {
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