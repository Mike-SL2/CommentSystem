type userPassportType = {name:string, imgSrc:string}[];

type cBaseType = null|{text:string,rate:number,date:string,time:string,answers:number}[];
type rBaseType = null|{toCIDX:number,text:string,rate:number,date:string,time:string}[];
type usrIDType = null|{byCIDX:number[],byRIDX:number[],byName:{[key:string]:number}};
type baseInitType = cBaseType|rBaseType|usrIDType;
type baseToStorProcType = null|userPassportType|cBaseType|rBaseType|usrIDType;
let uBase:userPassportType = [
    { name: "Андрей", imgSrc: "img/a.jpg" } /*	uBase[0]	*/,
  
    { name: "Борис", imgSrc: "img/b.jpg" } /*	uBase[1]	*/,
  
    { name: "Вика", imgSrc: "img/c.jpg" } /*	uBase[2]	*/,
  
    { name: "Гоша", imgSrc: "img/g.jpg" },
  ],
  usrID:usrIDType = null,
  cBase:cBaseType = null,
  rBase:rBaseType = null;
  let validUser:number = 0,
  errorFlag:boolean = false;
const doc:Document = document,
  px:string = "px",
  requestString:string = "https://randomuser.me/api/",
  messageWrap:HTMLDivElement = doc.createElement("div"),
  progressWrap:HTMLDivElement  = doc.createElement("div"),
  meStyl:CSSStyleDeclaration = messageWrap.style,
  progStyl:CSSStyleDeclaration = progressWrap.style,
  uBaseLen:number = uBase.length,
  timing1:number = 2000,
  timing2:number = timing1 / 4,
  brdWdth:string  = "1px solid ",
  shadow:string  = "3px 3px 2px 1px lightgray";

meStyl.border = brdWdth + "red";
meStyl.padding = '8' + px;
meStyl.display = "inline-block";
meStyl.fontSize = '22' + px;
progStyl.border = brdWdth + "blue";
progStyl.minWidth = '100'+ px;
progStyl.display = "inline-flex";
meStyl.boxShadow = shadow;
progStyl.marginLeft = '10' + px;
progStyl.background = "green";
progStyl.boxShadow = shadow;
function insBrik():void  {
  const progressBrik:HTMLDivElement = doc.createElement("div"),
    brikStyl:CSSStyleDeclaration = progressBrik.style;
  brikStyl.width = '20' + px;
  brikStyl.height = '10' + px;
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
function requestUserData():void {
  let xhR:XMLHttpRequest = new XMLHttpRequest();
  xhR.open("get", requestString);
  xhR.onload = function ():void  {
    if (xhR.status === 200) {
      let xhRResp:any = JSON.parse(xhR.response)["results"][0],
        name:string = xhRResp["name"]["first"] + " " + xhRResp["name"]["last"],
        picURL:string = xhRResp["picture"]["large"];
      uBase[validUser] = { name: name, imgSrc: picURL };
      validUser++;
      insBrik();
    }
  };
  xhR.onerror = function ():void  {
    errorFlag = true;
  };
  xhR.send();
};
/* Data save to and load from local browser storage */
function sTor(keyName:string|null = null, value:string|null|baseToStorProcType  = null):any{
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
/* save base to local storage */
function baseToStor (base:baseToStorProcType):void {
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
/* user ID index base init */
usrID = baseInit("usrID", function():usrIDType{
let out:usrIDType =  {
    byCIDX: [] /* to get user ID number by comment index */,
    byRIDX: [] /* to get user (replier) ID number by reply index */,
    byName: {} /* to get user ID number by user name */,
  }
  return out;
});
/* comments base init */
cBase = baseInit("cBase", function():cBaseType{
let out:cBaseType =[];      
  return out;
});
/* replies base init */
rBase = baseInit("rBase", function():rBaseType{
let out:rBaseType =[];   
  return out;
});
function loadScript2():void {
  const script2:HTMLScriptElement = doc.createElement("script");
  script2.src = "commsys6.js";
  doc.head.append(script2);
};
const auxBase:userPassportType = sTor("uBase");
if (auxBase) {
  uBase = auxBase;
  loadScript2();
} else {
  doc.body.insertBefore(progressWrap, null);
  doc.body.insertBefore(messageWrap, progressWrap);
  messageShow();
  insBrik();
  uBase.forEach(function():void {
    requestUserData();
  });
  let intervalId:number = setInterval(function():void {
    messageShow();
    if (!(validUser < uBaseLen) || errorFlag) {
      clearInterval(intervalId);
      if (errorFlag) {
        progressWrap.remove();
      } else {
        baseToStor(uBase);
      }
      setTimeout(function():void {
        messageWrap.remove();
        progressWrap.remove();
        loadScript2();
      }, timing1);
    }
  }, timing2);
}
