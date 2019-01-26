<!DOCTYPE html>
<html>
<head>

 <META NAME="ROBOTS" CONTENT="INDEX, FOLLOW">
 <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=3.0, minimum-scale=0.86">

 <link rel="stylesheet"  href="./main.css">

 <link rel="shortcut icon" href="./logo/logo.png" type="image/x-icon" />


 <title>NPDA</title>

</head>

<body>
 <div class='entire'>
     <svg class='scene'  xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">

     </svg>

     <div class='middle-text'></div>

     <div class='operations'>
       <button class='operation' onclick='openOperationInputSpan(0);showMainLog("to create final states, put $ at the beginning of the state label");' disabled>
          New State
          <BR>
          <span class='input'>
            <input type='text' maxlength='3' placeholder='Label' />
            <span class='set' onclick='addState(optionInputs[0].value.trim(),npda);'>Go</span>
          </span>
       </button>
       <button class='operation' onclick='openOperationInputSpan(1);showMainLog("use the following format for transition labels : (letter,stackSymbols,stackSymbols)<BR>use % for lambda");' disabled>
          New Arrow
          <BR>
          <span class='input'>
            <input type='text' style='width:100px;' placeholder='Label' />
            <span class='set' style='width:100px;' onclick='addArrow(optionInputs[1].value.trim(),npda);'>Go</span>
          </span>
       </button>
       <button class='operation' onclick='openOperationInputSpan(2);' disabled>
          Edit
          <BR>
          <span class='input'>
            <input type='text' style='width:100px;' placeholder='Label' />
            <span class='set' style='width:100px;' onclick='setElementLabel();'>Done</span>
          </span>
       </button>
       <button class='operation' onclick='deleteElement();' disabled>
          Delete
       </button>
       <button class='operation' onclick='standardizeNPDA();' disabled>
          Standardize
       </button>
       <button class='operation' onclick='backToNPDA();' disabled>
          Back To Initial
       </button>
       <button class='operation' onclick='getCFG();' disabled>
          Compute CFG
       </button>
       <button class='operation' onclick='backToStandardNPDA();' disabled>
          Back To Standard Form
       </button>
     </div>
     <span class='close-operations' onclick='menuDropper();'><img src='./icons/drop_down_icon.png' /></span>

     <span class='main-log'></span>
     <span class='npda-logo'><img src='./logo/logo.png' /> <BR> NPDA</span>
 </div>
 <div class='device-width-err'>
   Your Browser Width Is Too Small For This Page. Please Increase Browser Width In Order To See The Content of This Page <BR> (Wider Than 1200 Pixels Is Required)
 </div>
</body>

<script language="javascript" type='text/javascript' src='./jquery-3.1.1.min.js'></script>
<script language="javascript" type='text/javascript' src='./main.js'></script>

</html>









































