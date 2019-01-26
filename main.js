var body=document.querySelectorAll("body");

var closeButtonImg=document.querySelectorAll("span.close-operations > img");
var operationMenu=document.querySelectorAll("div.operations");
var operationMenuState=1;

var mainLog=document.querySelectorAll("span.main-log");

var optionButtons=document.querySelectorAll("div.operations button.operation");
var optionInputSpans=document.querySelectorAll("div.operations button.operation span.input");
var optionInputs=document.querySelectorAll("div.operations button.operation span.input input");
var optionSetButtons=document.querySelectorAll("div.operations button.operation span.set");

var middleText=document.querySelectorAll("div.middle-text");

var scene=document.querySelectorAll("svg.scene");

var animationRatio=100;

var npda={arrows:[],nodes:[]};
var standardNPDA={arrows:[],nodes:[]};
var CFG=[];

var allReachables=[];

var tmpArrowStart;

var doOnClick='';
var selectedElement;

var graphMode='npda';

var autoAddedStatesCount=0;

var pageLoadCheckerInterval = setInterval(function() {
    if(document.readyState === 'complete') {
        clearInterval(pageLoadCheckerInterval);
        pageOnLoad();
    }
}, 100);

function pageOnLoad()
{
  body[0].setAttribute('class','transition-all');
  taskManager.reset();
  taskManager.push(function(){
    middleTextShower("welcome to PDA|CFG impelementation page");
  },0); 
  taskManager.push(function(){
    middleText[0].style.opacity='0';
  },5000);
  taskManager.push(function(){
    middleTextShower("to create final states, put $ at the beginning of the state label");
  },1000);  
  taskManager.push(function(){
    middleText[0].style.opacity='0';
  },9000);
  taskManager.push(function(){
    middleTextShower("use the following format for transition labels : <BR> (letter,stackSymbols,stackSymbols)");
  },1000);  
  taskManager.push(function(){
    middleText[0].style.opacity='0';
  },12000);
  taskManager.push(function(){
    middleTextShower("use % for lambda");
  },1000);  
  taskManager.push(function(){
    middleText[0].style.opacity='0';
  },4000);
  taskManager.push(function(){
    middleText[0].style.display='none';
  },1200);
  taskManager.push(function(){
    addState("S",npda,true,true,false,100);
  },600);
  taskManager.push(function(){
    setNodeProperties(npda,npda.nodes[0],{left:320,top:300});
  },1200);
  taskManager.push(function(){
    optionButtons[0].disabled=false;
    optionButtons[1].disabled=false;
    optionButtons[4].disabled=false;
  },1000);

  taskManager.handler();
}

function middleTextShower(str,color='gray',fontSize='25px',top='200px',left='420px',width='500px')
{
  middleText[0].style.opacity='0';  
  setTimeout(function(){
    middleText[0].innerHTML=str;
    middleText[0].style.color=color;
    middleText[0].style.fontSize=fontSize;
    middleText[0].style.top=top;
    middleText[0].style.left=left;
    middleText[0].style.width=width;
    middleText[0].style.display='none';
  },1100*animationRatio/100);
  setTimeout(function(){
    middleText[0].style.display='block';
    setTimeout(function(){
      middleText[0].style.opacity=1;
    },300*animationRatio/100);
  },1800*animationRatio/100);
}




function sceneOnclick()
{
  closeAllOperationInputSpans();
}


$(window).click(function()
{
  var e=event.toElement || event.relatedTarget;
  hideMainLog();
  switch(doOnClick)
  {
    case 'placeState':    
      if(e==scene[0])
      {
        switch(graphMode) 
        {
          case 'npda':
            setNodeProperties(npda,selectedElement,{left:event.clientX+pageXOffset,top:event.clientY+pageYOffset});
          break;
          case 'standardNPDA':
            setNodeProperties(standardNPDA,selectedElement,{left:event.clientX+pageXOffset,top:event.clientY+pageYOffset});
          break;
        }             
      } 
    break;
    case 'placeArrowStart':     
    for(var i=0;i<npda.nodes.length;i++)    
    {
      var thisNode=npda.nodes[i];
      if((e==thisNode.circle || e==thisNode.text))
      {
        tmpArrowStart=thisNode;       
        doOnClick='placeArrowEnd';
        break;
      }     
    }
    break;
    case 'placeArrowEnd':
      var thisNode; 
      var item;
      var thisArrow;    
      for(var i=0;i<npda.nodes.length;i++)    
      {
        thisNode=npda.nodes[i];
        if(e==thisNode.circle || e==thisNode.text)
        {
          var exists=false;
          for(var ii=0;ii<npda.arrows.length;ii++)
          {
            item=npda.arrows[ii];
            for(var iii=0;iii<item.data.length;iii++)
            {
              thisArrow=item.data[iii];
              if(thisArrow.start==tmpArrowStart && thisArrow.end==thisNode && thisArrow.label==selectedElement.label)
              {
                console.log('repeated');
                exists=true;
                break;
              }
            } 
            if(exists)
            {   
              break;
            }         
          }         
          if(exists)
          {
            tmpArrowStart={};       
          }else{
            selectedElement.start=tmpArrowStart;
            selectedElement.pos.start={x:tmpArrowStart.x,y:tmpArrowStart.y};
            selectedElement.end=thisNode;
            selectedElement.pos.end={x:thisNode.x,y:thisNode.y};          
          } 
          updateGraph(npda);      
          doOnClick='placeArrowStart';
          break;
        }     
      }     
    break;
  }
});



function showMainLog(log,color='darkred',bgc='rgba(180,130,130,1)')
{
   setTimeout(function(){
      mainLog[0].style.top='0px';
      mainLog[0].innerHTML=log;
      mainLog[0].style.backgroundColor=bgc;
      mainLog[0].style.color=color;
   },5*(animationRatio/100));
}

function hideMainLog()
{
  if(getComputedStyle(mainLog[0],null).top.match(/[0-9]+/)=='0')
  {
     mainLog[0].style.top='-50px';
     setTimeout(function(){
       mainLog[0].style.top='-500px';
     },1*(animationRatio/100));
  }
}


function menuDropper()
{
 if (operationMenuState)
 {
   closeButtonImg[0].style.transform='rotate(180deg)';
   operationMenu[0].style.top='-110%';
   operationMenuState=0;
 }else{
   closeButtonImg[0].style.transform='rotate(0deg)';
   operationMenu[0].style.top='0';
   operationMenuState=1;   
 }
}



function closeAllOperationInputSpans(except)
{
  for(var i=0;i<optionInputSpans.length;i++)
  {
    if(except)
    {
      for(var ii=0;ii<except.length;ii++)
      {
        if(except[ii]==i)
        {
          continue;
        }
      }      
    }
    optionInputSpans[i].style.left='-400px';
  }
}


function openOperationInputSpan(index)
{
  closeAllOperationInputSpans(index);
  optionInputSpans[index].value='';
  optionInputSpans[index].style.left='81px';
}



var taskManager={
  stack:[],
  currentTask:{},
  timeout:{},
  finished:true,
  push:function(task,wait){ 
      taskManager.stack.push({task:task,wait:wait});
    },  
  pause:function(){
      clearTimeout(taskManager.timeout);
      taskManager.stack.splice(0,0,taskManager.currentTask);
    },  
  handler:function(){       
      if(!taskManager.stack.length)
      {
        taskManager.finished=true;
        return;
      }
      taskManager.finished=false;
          
      taskManager.currentTask=taskManager.stack[0];
      taskManager.stack.splice(0,1);
      taskManager.timeout=setTimeout(function(){    
        taskManager.currentTask.task();
        taskManager.handler();
      },taskManager.currentTask.wait*(animationRatio/100));
    },
  reset:function(){       
      taskManager.stack=[];
      taskManager.currentTask={};
      taskManager.timeout={};
      taskManager.finished=true;
  }
}


function addState(label,graph,noEdit,isStart,dontDisplay,timeOut)
{
  if(!label)
  {
       showMainLog("State Label cannot Be Empty");
     return;
  }
  if(!isStart)
  {
    isStart=false;
  }

  for(var i=0;i<npda.nodes;i++)
  {
    if(npda.nodes[i].label==label)
    {
      return;
    }
  }

  var thisNode={};

  thisNode.label=label;
  thisNode.circle=document.createElementNS("http://www.w3.org/2000/svg","circle");
  thisNode.text=document.createElementNS("http://www.w3.org/2000/svg","text");


  thisNode.circle.setAttribute("stroke-width","2");
  thisNode.circle.setAttribute("class","a");
  thisNode.circle.setAttribute("stroke","black");
  thisNode.circle.setAttribute("r",label.length*4+12);
  thisNode.circle.setAttribute("fill","lightBlue");
  thisNode.text.setAttribute("fill","black");  ;
  thisNode.text.setAttribute("font-size","18");
  thisNode.text.setAttribute("font-family","tahoma");
  thisNode.text.setAttribute("dy","3");
  thisNode.text.setAttribute("y",0);
  thisNode.text.setAttribute("x",0);
  thisNode.text.setAttribute("text-anchor","middle");
  thisNode.text.setAttribute("alignment-baseline","middle");

  thisNode.text.innerHTML=label;

  
  if(!dontDisplay)
  {
    scene[0].appendChild(thisNode.circle);
    scene[0].appendChild(thisNode.text);
  }
  

  thisNode.noEdit=noEdit;
  thisNode.isStart=isStart;
  if(label[0]=='$')
  {
    thisNode.isFinal=true;
  } else{
    thisNode.isFinal=false;
  }
  thisNode.in=[];
  thisNode.out=[];
  thisNode.x=0;
  thisNode.y=0;

  graph.nodes.push(thisNode);

  if(!noEdit)
  {
    selectElement(thisNode,'placeState');
    thisNode.circle.onclick=function()
    {
      selectElement(thisNode,'placeState');
    };
    thisNode.text.onclick=function()
    {
      selectElement(thisNode,'placeState');
    };
  }else{
    thisNode.circle.onclick=function()
    {
      selectStateForMove(thisNode);
    };
    thisNode.text.onclick=function()
    {
      selectStateForMove(thisNode);
    };
  }


  if(timeOut)
  {
    setTimeout(function(){
      setNodeProperties(graph,thisNode,{top:label.length*4+12+5,left:500});
    },timeOut);
  }else{
    setNodeProperties(graph,thisNode,{top:label.length*4+12+5,left:500});
  }

  return thisNode;
}




function setNodeProperties(graph,node,properties)
{
    if(properties.left!==undefined && properties.top!==undefined)
    {      
      node.x=properties.left;
      node.y=properties.top;
    }
    if(properties.bgColor)
    {
      node.circle.setAttribute("fill",properties.bgColor);
    }
    if(properties.radius!==undefined)
    {
      node.circle.setAttribute("r",properties.radius);
    }
    if(properties.tColor)
    {
      node.text.setAttribute("fill",properties.tColor);
    }
    if(properties.stroke!==undefined)
    {
      node.text.setAttribute("stroke",properties.stroke);
    }
    updateGraph(graph);
}





function updateGraph(graph)
{
  var thisArrow;
  var thisNode;
  var arrowsDistinct=[];
  var repeated=false;
  graph.nodes.forEach(function(item){
        item.circle.setAttribute("cy",item.y);
        item.circle.setAttribute("cx",item.x);
        item.text.setAttribute("transform","translate("+item.x+","+item.y+")");
        item.text.innerHTML=item.label;
        item.out=[];
        item.in=[];
        if(item.label[0]=='$')
        {
          item.isFinal=true;
        }
        if(item.isStart)
        {
          item.circle.setAttribute("fill","rgb(182, 155, 76)");
        }else if(item.isFinal)
        {
          item.circle.setAttribute("fill","rgb(77, 168, 59)");
        }else{
          item.circle.setAttribute("fill","lightBlue");
        }
  });
  graph.arrows.forEach(function(item){    
    for (var i=0;i<item.data.length;i++)
    {       
      thisArrow=item.data[i];
      var start=thisArrow.pos.start;
      if(thisArrow.start.circle)
      {
        start=thisArrow.start;
        thisArrow.start.out.push(thisArrow);
      }
      var end=thisArrow.pos.end;
      if(thisArrow.end.circle)
      {
        end=thisArrow.end;
        thisArrow.end.in.push(thisArrow);
      }
      thisArrow.pos.end={x:end.x,y:end.y};
      thisArrow.pos.start={x:start.x,y:start.y};
      var computedGeometry=getGeometry(start,end,thisArrow.start,thisArrow.end);
      var xs=start.x+computedGeometry.dxs;
      var ys=start.y+computedGeometry.dys;
      var xe=end.x+computedGeometry.dxe;
      var ye=end.y+computedGeometry.dye;
      var distanceX=xe-xs;
      var distanceY=ye-ys;
      if(thisArrow.start.label==thisArrow.end.label)
      {
        thisArrow.path.main.setAttribute("d","M "+(xs+distanceX-14)+" "+(ys+distanceY+7)+" m -15, 0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0");
        thisArrow.path.main.setAttribute("fill","transparent");
        computedGeometry.angle=45;
      }else{
        thisArrow.path.main.setAttribute("d","m "+xs+" "+ys+" l "+distanceX+" "+distanceY);
      }     
      thisArrow.path.end.setAttribute("d","m "+xe+" "+ye+" l -12 -8 l 12 8 l -12 8");   
      thisArrow.path.end.setAttribute("transform","rotate("+computedGeometry.angle+","+xe+","+ye+")");
      var textLength=thisArrow.text.innerHTML.length;
      thisArrow.text.setAttribute("transform","translate("+(xe-(6*textLength+15)*computedGeometry.coX)+","+(ye-(6*textLength+15)*computedGeometry.coY)+")");
          thisArrow.text.innerHTML=thisArrow.label;
          if(thisArrow.end.circle && thisArrow.start.circle)
          {
            thisArrow.path.main.setAttribute("stroke",'rgba(100,170,100,1)');
            thisArrow.path.end.setAttribute("stroke",'rgba(100,170,100,1)');
            thisArrow.text.setAttribute("fill","rgba(80,80,80,1)");
          }else{
            thisArrow.path.main.setAttribute("stroke",'rgba(100,170,100,0.35)');
          thisArrow.path.end.setAttribute("stroke",'rgba(100,170,100,0.35)');
          thisArrow.text.setAttribute("fill","rgba(80,80,80,0.35)");
          }
        }
  });
  for (var i=0;i<graph.nodes.length;i++)
  {   
    thisNode=graph.nodes[i];
    arrowsDistinct=[];
    for (var ii=0;ii<thisNode.out.length;ii++)
    {
      repeated=false;
      for (var iii=0;iii<arrowsDistinct.length;iii++)
      { 
        if(arrowsDistinct[iii][0].end.circle && thisNode.out[ii].end.circle  && arrowsDistinct[iii][0].end==thisNode.out[ii].end)
        {
          arrowsDistinct[iii].push(thisNode.out[ii]);
          repeated=true;
        }
      }
      if(!repeated)
      {
        arrowsDistinct.push([thisNode.out[ii]]);
      }
    }
    for (var ii=0;ii<arrowsDistinct.length;ii++)
    { 
      arrowsDistinct[ii][0].text.innerHTML=arrowsDistinct[ii][0].label;
      for (var iii=1;iii<arrowsDistinct[ii].length;iii++)
      { 
        arrowsDistinct[ii][0].text.innerHTML+=','+arrowsDistinct[ii][iii].label;
        arrowsDistinct[ii][iii].text.innerHTML='';
      }
    } 
  } 
}

function getGeometry(start,end,startNode,endNode)
{
  var x=end.x-start.x;
  var y=end.y-start.y;
  angle=0;
  if(x)
  {
    var angle=Math.abs(Math.atan(y/x)*180/Math.PI);
  }
  
  if(x>=0 && y>=0)
  {
    angle=angle;
  }

  if(x<0 && y>=0)
  {
    angle=180-angle;
  }

  if(x<0 && y<0)
  {
    angle+=180;
  }

  if(x>=0 && y<0)
  {
    angle=360-angle;
  }

  endPadding=0;
  if(endNode.circle)
  {
    endPadding=parseInt(endNode.circle.getAttribute('r'));
  }
  startPadding=0;
  if(startNode.circle)
  {
    startPadding=parseInt(startNode.circle.getAttribute('r'));
  }

  coefficientX=Math.cos(angle*Math.PI/180);
  coefficientY=Math.sin(angle*Math.PI/180);

  dxs=startPadding*coefficientX;
  dys=startPadding*coefficientY;

  dxe=-endPadding*coefficientX;
  dye=-endPadding*coefficientY;



  return {angle:angle,dxs:dxs,dys:dys,dxe:dxe,dye:dye,coX:coefficientX,coY:coefficientY};
}


function selectStateForMove(node)
{
  if(selectedElement)
  {
    return;
  }
  selectedElement=node; 
  doOnClick='placeState';
  optionButtons[0].disabled=true;
  optionButtons[1].disabled=true;
  optionButtons[2].disabled=false;
  optionInputs[2].disabled=true;
  setTimeout(function(){
    openOperationInputSpan(2);
    optionInputs[2].value='';   
  },1);
}

function selectElement(element,onClick)
{
  if(selectedElement)
  {
    return;
  }
  selectedElement=element;  
  doOnClick=onClick;
  optionButtons[0].disabled=true;
  optionButtons[1].disabled=true;
  optionButtons[2].disabled=false;
  optionButtons[3].disabled=false;
  optionInputs[2].disabled=false;
  setTimeout(function(){
    openOperationInputSpan(2);
    optionInputs[2].value=element.label;
  },1);
}


function setElementLabel()
{
  if(selectedElement.noEdit)
  {
    selectedElement=null;
    doOnClick='';
    closeAllOperationInputSpans();
    optionButtons[0].disabled=false;
    optionButtons[1].disabled=false;
    optionButtons[2].disabled=true;
    return;
  }
  var label=optionInputs[2].value.trim();
  if(!label)
  {
    showMainLog("Label Cannot Be Empty");
    return;
  } 
  if(selectedElement.circle)
  {
      selectedElement.circle.setAttribute("r",label.length*4+12);
  }else{
      if(selectedElement.start.circle && selectedElement.end.circle)
      {
          for(var i=0;i<selectedElement.start.out.length;i++)
        {
          if(selectedElement.start.out[i]!=selectedElement && selectedElement.start.out[i].end==selectedElement.end && selectedElement.start.out[i].label==label)
          { 
            return;
          }
        }
      }     
      var thisArrow;
      for(var i=0;i<npda.arrows.length;i++)
      {
        thisArrow=npda.arrows[i];
        if(thisArrow.label==selectedElement.label)
        {       
          thisArrow.data.splice(thisArrow.data.indexOf(selectedElement),1);
          if(!thisArrow.data.length)
          {
            npda.arrows.splice(npda.arrows.indexOf(thisArrow),1);
          } 
          break;
        }
      }     
      var prevArrow;
      var exists=false;
      for(var i=0;i<npda.arrows.length;i++)
      {
        prevArrow=npda.arrows[i];
      if(prevArrow.label==label)
      {
        exists=true;
        break;
      }   
      }
      if(exists)
      {
        prevArrow.data.push(selectedElement);
      }else{
        npda.arrows.push({data:[selectedElement],label:label});
      }
  }
  selectedElement.label=label;

  selectedElement=null;
  doOnClick='';
  closeAllOperationInputSpans();
  updateGraph(npda);
  optionButtons[0].disabled=false;
  optionButtons[1].disabled=false;
  optionButtons[2].disabled=true;
  optionButtons[3].disabled=true;
}

function addArrow(label,graph,noEdit,auto,dontDisplay)
{
  if(!label || (!label.match(/\([ ]*[^*]+[ ]*,[^*]+[ ]*,[^*]+[ ]*\)/) && !auto))
  {
       showMainLog("Transition Labels Must Be In This Form (letter,StackSymbol,StackSymbol), Use % For Lambda");
     return;
  }

  var thisArrow={};
  
  thisArrow.label=label;
  
  thisArrow.path={};

  thisArrow.path.main=document.createElementNS("http://www.w3.org/2000/svg","path");
  thisArrow.path.main.setAttribute("stroke",'rgba(100,170,100,0.35)');
  thisArrow.path.main.setAttribute("stroke-width",'2');
  thisArrow.path.main.setAttribute("d","m 0 0 l 100 0");

  thisArrow.path.end=document.createElementNS("http://www.w3.org/2000/svg","path");
  thisArrow.path.end.setAttribute("stroke",'rgba(100,170,100,0.35)');
  thisArrow.path.end.setAttribute("stroke-width",'2');
  thisArrow.path.end.setAttribute("d","m 0 0 l -12 -8 l 12 8 l -12 8");

  thisArrow.text=document.createElementNS("http://www.w3.org/2000/svg","text");
  thisArrow.text.setAttribute("fill","rgba(80,80,80,0.35)");
  thisArrow.text.setAttribute("font-size","18");
  thisArrow.text.setAttribute("font-family","tahoma");
  thisArrow.text.style.fontWeight="bolder";
  thisArrow.text.setAttribute("dy","3");
  thisArrow.text.setAttribute("y",0);
  thisArrow.text.setAttribute("x",0);
  thisArrow.text.setAttribute("text-anchor","middle");
  thisArrow.text.setAttribute("alignment-baseline","middle");

  thisArrow.text.innerHTML=label;
  
  if(!dontDisplay)
  {
    scene[0].appendChild(thisArrow.path.main);
    scene[0].appendChild(thisArrow.path.end);
    scene[0].appendChild(thisArrow.text);
  } 

  thisArrow.start={};
  thisArrow.end={};

  var prevArrow;
  var exists=false;
  for(var i=0;i<graph.arrows.length;i++)
  {
    prevArrow=graph.arrows[i];
  if(prevArrow.label==label)
  {
    exists=true;
    break;
  }   
  }
  if(exists)
  {
    prevArrow.data.push(thisArrow);
  }else{
    graph.arrows.push({data:[thisArrow],label:label});
  }
  
  if(!noEdit)
  {
    selectElement(thisArrow,'placeArrowStart');
    thisArrow.path.main.onclick=function()
    {
      selectElement(thisArrow,'placeArrowStart');
    };
    thisArrow.path.end.onclick=function()
    {
      selectElement(thisArrow,'placeArrowStart');
    };
    thisArrow.text.onclick=function()
    {
      selectElement(thisArrow,'placeArrowStart');
    };  
  }
  


  thisArrow.pos={start:{x:300,y:20},end:{x:400,y:20}};
  thisArrow.path.main.setAttribute("d","m 300 20 l 100 0");
  thisArrow.path.end.setAttribute("d","m 400 20 l -12 -8 l 12 8 l -12 8");

  if(!dontDisplay)
  {
    reDraewGraph(graph);
  }

  return thisArrow;
}


function deleteElement()
{
  if(!selectedElement)
  {
    return;
  }

  if(selectedElement.path)
  {
    var thisArrow;
    for(var i=0;i<npda.arrows.length;i++)
    {
      thisArrow=npda.arrows[i];
      if(thisArrow.label==selectedElement.label)
      {       
        if(!thisArrow.data.length)
        {
          npda.arrows.splice(npda.arrows.indexOf(thisArrow),1);
        } 
        break;
      }
    }     
    if(selectedElement.start.out)
    {
      selectedElement.start.out.splice(selectedElement.start.out.indexOf(selectedElement),1);
    }   
    if(selectedElement.end.in)
    {
      selectedElement.end.in.splice(selectedElement.end.in.indexOf(selectedElement),1);
    }   
    scene[0].removeChild(selectedElement.path.end);
    scene[0].removeChild(selectedElement.path.main);
    scene[0].removeChild(selectedElement.text);
  }else{
    npda.nodes.splice(npda.nodes.indexOf(selectedElement),1);
    for(var i=0;i<selectedElement.in.length;i++)
    {
      var item=selectedElement.in[i];
      item.end={};
    }
    for(var i=0;i<selectedElement.out.length;i++)
    {
      var item=selectedElement.out[i];
      item.start={};
    }
    scene[0].removeChild(selectedElement.circle);
    scene[0].removeChild(selectedElement.text);
  } 

  selectedElement=null;
  doOnClick='';
  optionButtons[2].disabled=true;
  closeAllOperationInputSpans();
  updateGraph(npda);
  optionButtons[0].disabled=false;
  optionButtons[1].disabled=false;
  optionButtons[2].disabled=true;
  optionButtons[3].disabled=true;
}





function addMemberToSet(member,toSet)
{
  var repeated=false;
  toSet.forEach(function(token){
    if(token===member)
    {
      repeated=true;
    }
  }); 
  if(repeated)
  {
    return toSet;
  }
  toSet.push(member);
  return toSet;
}


function setEqualsSet(set1,set2)
{
  if(set1.length==set2.length && isSetInSet(set1,set2))
  {
    return true;
  }

  return false;
}


function isMemberInSet(member,inSet)
{
  var found=false;
  inSet.forEach(function(setMember){
    if(setMember==member)
    {
      found=true;
    }
  });

  return found;
}


function isSetInSet(set,inSet)
{
  var match=true;
  set.forEach(function(setMember){
    if(!isMemberInSet(setMember,inSet))
    {
      match=false;
    }
  });

  return match;
}



function addSetToSet(set,toSet)
{
  set.forEach(function(token){
    toSet=addMemberToSet(token,toSet);
  });
  return toSet;
}



function reDraewGraph(graph)
{
  for(var i=0;i<graph.nodes.length;i++)
  {
     scene[0].removeChild(graph.nodes[i].circle);
     scene[0].removeChild(graph.nodes[i].text);
     scene[0].appendChild(graph.nodes[i].circle);
     scene[0].appendChild(graph.nodes[i].text);
  }
  for(var i=0;i<graph.arrows.length;i++)
  {
     for(var ii=0;ii<graph.arrows[i].data.length;ii++)
     {
       scene[0].removeChild(graph.arrows[i].data[ii].text);
       scene[0].appendChild(graph.arrows[i].data[ii].text);
     }
  }
}



function appearGraph(graph)
{
  for(var i=0;i<graph.arrows.length;i++)
  {
     for(var ii=0;ii<graph.arrows[i].data.length;ii++)
     {
       scene[0].appendChild(graph.arrows[i].data[ii].path.main);
     }
     for(var ii=0;ii<graph.arrows[i].data.length;ii++)
     {
       scene[0].appendChild(graph.arrows[i].data[ii].path.end);
     }
  }
  for(var i=0;i<graph.nodes.length;i++)
  {
     scene[0].appendChild(graph.nodes[i].circle);
     scene[0].appendChild(graph.nodes[i].text);
  }
  for(var i=0;i<graph.arrows.length;i++)
  {
     for(var ii=0;ii<graph.arrows[i].data.length;ii++)
     {
       scene[0].appendChild(graph.arrows[i].data[ii].text);
     }
  }
}

function disAppearGraph(graph)
{
  try
  {
    scene[0].removeChild(graph.nodes[0].circle);
    scene[0].removeChild(graph.nodes[0].text);
  }catch(e){
    return false;
  } 
  for(var i=1;i<graph.nodes.length;i++)
  {
     scene[0].removeChild(graph.nodes[i].circle);
     scene[0].removeChild(graph.nodes[i].text);
  }
  for(var i=0;i<graph.arrows.length;i++)
  {
     for(var ii=0;ii<graph.arrows[i].data.length;ii++)
     {
       scene[0].removeChild(graph.arrows[i].data[ii].path.main);
       scene[0].removeChild(graph.arrows[i].data[ii].path.end);
       scene[0].removeChild(graph.arrows[i].data[ii].text);
     }
  }
}




function standardizeNPDA()
{
    if(!isValid())
    {
      return;
    }
    graphMode='standardNPDA';  
    optionButtons.forEach(function(item){
        item.disabled=true;
      });
    optionButtons[5].disabled=false;
    optionButtons[6].disabled=false;
    selectedElement=null;
    doOnClick='';
    closeAllOperationInputSpans();
    disAppearGraph(npda);

    standardNPDA={arrows:[],nodes:[]};
    autoAddedStatesCount=0;

    var thisState;
    for(var i=0;i<npda.nodes.length;i++)
    {
      thisState=addState(npda.nodes[i].label,standardNPDA,true);
      thisState.isFinal=npda.nodes[i].isFinal;
      thisState.isStart=npda.nodes[i].isStart;
    }
    if(npda.nodes.length==1)
    {
      standardNPDA.nodes[0].isFinal=true;
    }



    standardizeNPDAStep1();
    standardizeNPDAStep2();
    standardizeNPDAStep3();
    


    orderNodes();

    updateGraph(standardNPDA);
}



function isValid()
{
  if(!countFinals())
  {
    showMainLog("NPDA Must Have A Final State, To Create A Final State, Put $ In The Beginning Of State Label");
    return false;
  }
  allReachables=[];
  getAllInReachables(npda.nodes[0]);
  for(var i=0;i<npda.nodes.length;i++)
  {
    if(!isMemberInSet(npda.nodes[i].label,allReachables))
    {
      showMainLog("Unreachable State Detected");
      return false;
    }
    if(npda.nodes[i].isFinal && npda.nodes[i].out.length)
    {
      showMainLog("Final State Cannot Have Out Going Transitions");
      return false;
    }
  }
  return true;
}


function getLabelSet(states)
{
  var set=[];
  for(var i=0;i<states.length;i++)
  {
    set=addMemberToSet(states[i].label,set);
  }
  return set;
}

function getAllInReachables(state)
{
  allReachables=addMemberToSet(state.label,allReachables);
  for(var i=0;i<state.out.length;i++)
  {
    if(isMemberInSet(state.out[i].end.label,allReachables))
    {
      continue;
    }
    getAllInReachables(state.out[i].end);
  }
}

function countFinals()
{
  var finalCount=0;
  for(var i=0;i<npda.nodes.length;i++)
  {
      if(npda.nodes[i].isFinal)
      {
        finalCount++;
      }
  }
  return finalCount;
}


function standardizeNPDAStep1()
{
  var thisArrow;
  var newArrow=[];
  var newState=[];
  var labelSplitted;
  for(var i=0;i<npda.arrows.length;i++)
  {
    for(var ii=0;ii<npda.arrows[i].data.length;ii++)
    {
      thisArrow=npda.arrows[i].data[ii];
      
      labelSplitted=splitArrowLabels(thisArrow.label);

      /*
      if(labelSplitted[1]=='$')
      {
        thisArrow.label='('+labelSplitted[0]+',#,'+labelSplitted[2]+')';
      }
      */

      newArrow[0]=addArrow(thisArrow.label,standardNPDA,true,true);
      newArrow[0].start=standardNPDA.nodes[npda.nodes.indexOf(thisArrow.start)];
      newArrow[0].end=standardNPDA.nodes[npda.nodes.indexOf(thisArrow.end)];

      

    }
  }

}


function standardizeNPDAStep2()
{
  
  if(countFinals()==1)
  {
    return;
  }
  var thisState=[];
  var newArrow=[];
  var newState=[];
  thisState[0]=addState('PreFinal',standardNPDA,true);
  thisState[1]=addState('$Final',standardNPDA,true);
  newArrow[0]=addArrow('(%,*,%)',standardNPDA,true,true);
  newArrow[0].start=thisState[0];
  newArrow[0].end=thisState[0];
  newArrow[1]=addArrow('(%,$,%)',standardNPDA,true,true);
  newArrow[1].start=thisState[0];
  newArrow[1].end=thisState[1];
  for(var i=0;i<standardNPDA.nodes.length;i++)
  {
      thisState[2]=standardNPDA.nodes[i];
      if(!thisState[2].isFinal || thisState[2].label=='$Final')
      {
        continue;
      }
      thisState[2].isFinal=false;
      newArrow[2]=addArrow('(%,%,%)',standardNPDA,true,true);
      newArrow[2].start=thisState[2];
      newArrow[2].end=thisState[0];
  }
}


function standardizeNPDAStep3()
{
  var thisArrow;
  var newArrow=[];
  var newState=[];
  var labelSplitted;
  var needChange;
  var length=[];  
  length[0]=standardNPDA.arrows.length;
  for(var i=0;i<length[0];i++)
  {
    length[1]=standardNPDA.arrows[i].data.length;
    for(var ii=0;ii<length[1];ii++)
    {
      thisArrow=standardNPDA.arrows[i].data[ii];
      labelSplitted=splitArrowLabels(thisArrow.label);
      if(labelSplitted[1].trim()=='%' && labelSplitted[2].trim().length==1)
      {
        thisArrow.label='('+labelSplitted[0]+',*,'+labelSplitted[2]+'*)';
      }
    }
  }
  length[0]=standardNPDA.arrows.length;
  for(var i=0;i<length[0];i++)
  {
    length[1]=standardNPDA.arrows[i].data.length;
    for(var ii=0;ii<length[1];ii++)
    {
      thisArrow=standardNPDA.arrows[i].data[ii];
      labelSplitted=splitArrowLabels(thisArrow.label);
      if(labelSplitted[1].trim().length==1 && labelSplitted[2].trim().length==1)
      {
        autoAddedStatesCount++;
        newState[0]=addState('a'+autoAddedStatesCount,standardNPDA,true);        
        
        newArrow[0]=addArrow('('+labelSplitted[0]+',*,%)',standardNPDA,true,true);
        newArrow[0].start=newState[0];
        newArrow[0].end=thisArrow.end;

        thisArrow.label='('+labelSplitted[0]+','+labelSplitted[1]+',*'+labelSplitted[2]+')';        
        thisArrow.end=newState[0];
      }
    }
  }
  length[0]=standardNPDA.arrows.length;
  for(var i=0;i<length[0];i++)
  {
    length[1]=standardNPDA.arrows[i].data.length;
    for(var ii=0;ii<length[1];ii++)
    {
      thisArrow=standardNPDA.arrows[i].data[ii];
      labelSplitted=splitArrowLabels(thisArrow.label);
      if(labelSplitted[1].trim().length==1 && labelSplitted[2].trim().length>2)
      {
        needChange=true;
        do
        {    
          labelSplitted=splitArrowLabels(thisArrow.label);

          autoAddedStatesCount++;
          newState[1]=addState('a'+autoAddedStatesCount,standardNPDA,true);  

          newArrow[1]=addArrow('('+labelSplitted[0]+','+labelSplitted[1]+','+labelSplitted[2].substr(1)+')',standardNPDA,true,true);
          newArrow[1].start=thisArrow.start;
          newArrow[1].end=newState[1];

          thisArrow.label='('+labelSplitted[0]+',*,'+labelSplitted[2][0]+'*)';        
          thisArrow.start=newState[1];

          needChange=false;
          if(labelSplitted[2].substr(1).length>2)
          {
            needChange=true;
            thisArrow=newArrow[1];
          }
        }while(needChange);      
      }
    }
  }
}





function splitArrowLabels(label)
{
  var outPut=label.trim();
  outPut=outPut.substr(1,outPut.length-2);
  outPut=outPut.split(',');
  return outPut;
}






function orderNodes()
{
  var thisState;
  var prevState;
  var aboveState;
  var x;
  var y;
  for(var i=0;i<standardNPDA.nodes.length;i++)
  {
    thisState=standardNPDA.nodes[i];
    prevState=standardNPDA.nodes[i-1];
    aboveState=standardNPDA.nodes[i-4];
    if(prevState && i%4!=0)
    {
      x=prevState.x+parseInt(prevState.circle.getAttribute('r'))+parseInt(thisState.circle.getAttribute('r'))+100;
    }else{
      x=300;
    }
    if(aboveState)
    {
      y=aboveState.y+parseInt(aboveState.circle.getAttribute('r'))+parseInt(thisState.circle.getAttribute('r'))+100;
    }else{
      y=150;
    }

    y+=(Math.random()*80+30);

    setNodeProperties(standardNPDA,thisState,{top:y,left:x});  
  }
}



function backToNPDA()
{
  closeAllOperationInputSpans();
  disAppearGraph(standardNPDA);
  appearGraph(npda);
  optionButtons.forEach(function(item){
    item.disabled=true;
  });
  optionButtons[0].disabled=false;
  optionButtons[1].disabled=false;
  optionButtons[4].disabled=false;
  selectedElement=null;
  doOnClick='';
  graphMode='npda';
}



function getCFG()
{
  graphMode='CFG';
  optionButtons.forEach(function(item){
    item.disabled=true;
  });  
  selectedElement=null;
  doOnClick='';
  closeAllOperationInputSpans();
  disAppearGraph(standardNPDA);

  CFG=[];

  var thisArrow;
  var labelSplitted;
  var tmpLabelSplitted;
  var allStackSymbols=getAllStackSymbols();
  var qk;
  var ql;
  var grammarRight='';
  var grammarLeft='';
  for(var i=0;i<standardNPDA.arrows.length;i++)
  {
    for(var ii=0;ii<standardNPDA.arrows[i].data.length;ii++)
    {
      thisArrow=standardNPDA.arrows[i].data[ii];
      labelSplitted=splitArrowLabels(thisArrow.label);
      if(labelSplitted[2]=='%')
      {
        for(var iii=0;iii<((thisArrow.label.search(/\*/g)!=-1)*allStackSymbols.length+(thisArrow.label.search(/\*/g)==-1));iii++)
        {
          tmpLabelSplitted=splitArrowLabels(thisArrow.label.replace(/\*/g,allStackSymbols[iii]));
          if(allStackSymbols[iii]=='$')
          {
            continue;
          }
          addGrammar("("+thisArrow.start.label+tmpLabelSplitted[1]+thisArrow.end.label+")",tmpLabelSplitted[0]);
        }
      }else{
        for(var iii=0;iii<((thisArrow.label.search(/\*/g)!=-1)*allStackSymbols.length+(thisArrow.label.search(/\*/g)==-1));iii++)
        {
          tmpLabelSplitted=splitArrowLabels(thisArrow.label.replace(/\*/g,allStackSymbols[iii]));
          if(allStackSymbols[iii]=='$')
          {
            continue;
          }
          for(var iiii=0;iiii<standardNPDA.nodes.length;iiii++)
          {
              qk=standardNPDA.nodes[iiii];
              grammarLeft="("+thisArrow.start.label+tmpLabelSplitted[1]+qk.label+")";
              grammarRight="";
              for(var iiiii=0;iiiii<standardNPDA.nodes.length;iiiii++)
              {
                ql=standardNPDA.nodes[iiiii];
                grammarRight+="<tspan fill='rgba(100,170,100,1)'>&nbsp;|&nbsp;</tspan>"+tmpLabelSplitted[0]+"("+thisArrow.end.label+tmpLabelSplitted[2][0]+ql.label+")"+"("+ql.label+tmpLabelSplitted[2][1]+qk.label+")";
              } 
              grammarRight=grammarRight.substr(55);
              addGrammar(grammarLeft,grammarRight);
          }            
        }
      }
    }
  }


  taskManager.push(function(){
    optionButtons[7].disabled=false;
  },100)
  taskManager.handler();
}


function backToStandardNPDA()
{
  closeAllOperationInputSpans();
  disAppearGCF();
  appearGraph(standardNPDA);
  optionButtons.forEach(function(item){
    item.disabled=true;
  });
  optionButtons[5].disabled=false;
  optionButtons[6].disabled=false;
  selectedElement=null;
  doOnClick='';
  graphMode='standardNPDA';
}




function disAppearGCF()
{
  for(var i=0;i<CFG.length;i++)
  {
     scene[0].removeChild(CFG[i].text);
  }
}



function addGrammar(leftHand,rightHand,dontDisplay)
{
  var length;
  var thisGrammar={};

  thisGrammar.leftHand=leftHand;
  thisGrammar.rightHand=rightHand;

  thisGrammar.text=document.createElementNS("http://www.w3.org/2000/svg","text");
  thisGrammar.text.setAttribute("fill","black");  ;
  thisGrammar.text.setAttribute("font-size","18");
  thisGrammar.text.setAttribute("font-family","tahoma");
  thisGrammar.text.setAttribute("dy","3");
  thisGrammar.text.setAttribute("y",0);
  thisGrammar.text.setAttribute("x",-2000);
  thisGrammar.text.setAttribute("text-anchor","middle");
  thisGrammar.text.setAttribute("alignment-baseline","middle");

  thisGrammar.text.innerHTML="<tspan fill='rgba(90,90,90,1)'>"+leftHand+"</tspan><tspan fill='rgba(100,170,100,1)'>&nbsp;&nbsp;->&nbsp;&nbsp;</tspan><tspan fill='rgba(90,90,90,1)'>"+rightHand+"</tspan>";

  
  if(!dontDisplay)
  {
    scene[0].appendChild(thisGrammar.text);
  }
  
  thisGrammar.x=0;
  thisGrammar.y=0;

  CFG.push(thisGrammar);

  length=CFG.length;
  taskManager.push(function()
  {
    setGrammarPos(thisGrammar,2280+thisGrammar.text.getBBox().width/2,20+30*length);
  },200);

  return thisGrammar;
}




function setGrammarPos(grammar,x,y)
{
  grammar.x=x;
  grammar.y=y;
  grammar.text.setAttribute("transform","translate("+x+","+y+")");
}



function getAllStackSymbols()
{
  var set=[];
  var labelSplitted;

  addMemberToSet('#',set);

  for(var i=0;i<standardNPDA.arrows.length;i++)
  {
    for(var ii=0;ii<standardNPDA.arrows[i].data.length;ii++)
    {
      thisArrow=standardNPDA.arrows[i].data[ii];
      labelSplitted=splitArrowLabels(thisArrow.label);
      for(var iii=0;iii<labelSplitted[1].length;iii++)
      {
        if(labelSplitted[1][iii]=='*')
        {
          continue;
        }
        addMemberToSet(labelSplitted[1][iii],set);
      }
      for(var iii=0;iii<labelSplitted[2].length;iii++)
      {
        if(labelSplitted[2][iii]=='*')
        {
          continue;
        }
        addMemberToSet(labelSplitted[2][iii],set);
      }
    }
  }  
  return set;
}