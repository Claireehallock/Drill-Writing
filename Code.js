/*
Objectives:

Create notes and set lengths that show up in print mode

be able to move one step at a time

Add Titles at the top of the page


Optional:

Create storage data for multiple shows 

Add button to remove selected marcher

//Add the dots on the side of the screen

*/


//contains whether or not print mode is activated
var printMode = false;

//contains all the instruments with their proper numbers
var instrumentList = ["Piccolo", "Flute", "Clarinet", "Bass Clarinet", "Alto Sax", "Tenor Sax", "Bari Sax", "Trumpet", "Mellophone", "Baritone", "Tuba", "Snare", "Tenor", "Bass", "Guard"];

//contains all the instrument letters with their proper numbers
var instrumentLetterList = ["P", "F", "C", "D", "A", "K", "S", "T", "M", "B", "O", "SD", "TD", "BD", "G"];

//Contains the number of the currently viewed show
var showCount = 1;
if(localStorage.getItem("CurrentShow"))
    showCount = localStorage.getItem("CurrentShow");

//Contains a list of all stored show names
var showNames = ["untitled show"];
if(localStorage.getItem("ShowNames"))
    showNames = localStorage.getItem("ShowNames").split("\n");

//counts what set is currently being viewed
var setCount = 1;
if(localStorage.getItem("Set")){
    setCount = localStorage.getItem("Set");
}
    document.getElementById("setcount").innerHTML = setCount;


//contains the number of players for each instrument

var playerNums = [1, 1, 3, 0, 1, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0];
if (localStorage.getItem("PlayerNums"))
    playerNums = localStorage.getItem("PlayerNums").split("\n");
//localStorage.setItem("PlayerNums", playerNums.join("\n"));


//contains all player information for each set
var playerListWords = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

//contains all player pixel x-coordinates for each set
var playerListXPixels = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

//contains all player pixel y-coordinates for each set
var playerListYPixels = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

//Loads data into the playerLists
for(var i = 0; i < playerListWords.length; i++){
    var c = 0;
    while(c < playerNums[i]){
        playerListWords[i][c] = (localStorage.getItem("wShow" + showCount + ":" + instrumentLetterList[i] + (c+1))).split("\n");
        playerListXPixels[i][c] = (localStorage.getItem("xShow" + showCount + ":" + instrumentLetterList[i] + (c+1)).split("\n"));
        playerListYPixels[i][c] = (localStorage.getItem("yShow" + showCount + ":" + instrumentLetterList[i] + (c+1)).split("\n"));        
        c++;
    }
}

//creates the players from PlayerLists
for(var i = 0; i < playerListXPixels.length; i++){
    var c = 0;
    while(c < playerNums[i]){
        loadPlayer(i, c);
        c++;
    }
}

//contains the id of the currently selected player
var selected = "";

//tells whether or not a single travel distance is shown
var selectedTravelDistance = false;

//tells whether all travel distnces are currently shown
var allTravelDistances = false;

//checks if the new player buttons exist
var addNewOpen = false;

//allows dragging and dropping
document.addEventListener('dragend', function(event){
    var x = event.pageX;
    var y = event.pageY;
    event.target.style.top = Math.round((y-79)/4)*4 + "px";
    event.target.style.left = Math.round((x-36)/4)*4 + "px";
        
    var inst = event.target.getAttribute("instnum");
    var num = event.target.getAttribute("num");
    
    playerListWords[inst][num-1].splice(setCount - 1, 1, coordsToString(Math.round((x-36)/4)*4, Math.round((y-79)/4)*4));
    playerListXPixels[inst][num-1].splice(setCount - 1, 1, Math.round((x-36)/4)*4);
    playerListYPixels[inst][num-1].splice(setCount - 1, 1, Math.round((y-79)/4)*4);
    localStorage.setItem("wShow" + showCount + ":" + instrumentLetterList[inst] + num, playerListWords[inst][num-1].join("\n"));
    localStorage.setItem("xShow" + showCount + ":" + instrumentLetterList[inst] + num, playerListXPixels[inst][num-1].join("\n"));
    localStorage.setItem("yShow" + showCount + ":" + instrumentLetterList[inst] + num, playerListYPixels[inst][num-1].join("\n"));

    playerSelect(inst, num);
    setLines();
}, false);


document.addEventListener("keypress", function(event){
    var key = event.key;
    if(key == "w" || key == "a" || key == "s" || key == "d"){
        if(selected){
            var top = document.getElementById(selected).style.top;
            var left = document.getElementById(selected).style.left;
            var inst = document.getElementById(selected).getAttribute("instnum");
            var num = document.getElementById(selected).getAttribute("num");
            if(key == "w"){
                top = parseInt(document.getElementById(selected).style.top.slice(0,-2))-4 + "px";
            }
            if(key == "a"){
                left = parseInt(document.getElementById(selected).style.left.slice(0,-2))-4 + "px";
            }
            if(key == "s"){
                top = parseInt(document.getElementById(selected).style.top.slice(0,-2))+4 + "px";
            }
            if(key == "d"){
                left = parseInt(document.getElementById(selected).style.left.slice(0,-2))+4 + "px";
            }
            
            document.getElementById(selected).style.top = top;
            document.getElementById(selected).style.left = left;
            playerListYPixels[inst][num-1][setCount-1] = top.slice(0,-2);
            playerListXPixels[inst][num-1][setCount-1] = left.slice(0,-2);
            playerListWords[inst][num-1][setCount-1] = coordsToString(parseInt(left.slice(0,-2)), parseInt(top.slice(0,-2)));
            localStorage.setItem("wShow" + showCount + ":" + instrumentLetterList[inst] + num, playerListWords[inst][num-1].join("\n"));
            localStorage.setItem("xShow" + showCount + ":" + instrumentLetterList[inst] + num, playerListXPixels[inst][num-1].join("\n"));
            localStorage.setItem("yShow" + showCount + ":" + instrumentLetterList[inst] + num, playerListYPixels[inst][num-1].join("\n"));
            document.getElementById("coordsText").innerHTML = coordsToString(parseInt(left.slice(0,-2)), parseInt(top.slice(0,-2)));
        }
    }
}, false);


//adds a new player options when pressed
function newPlayerButtons(){
    if(addNewOpen == false){
        var playerButtons = [];
        var playerButtonTexts = [];
        for(var i = 0; i < playerListWords.length; i++){
            playerButtons.push(document.createElement("button"));
            playerButtonTexts.push(document.createTextNode(instrumentList[i]));
            playerButtons[i].appendChild(playerButtonTexts[i]);
            playerButtons[i].setAttribute("id", "playerButton" + i);
            playerButtons[i].setAttribute("onclick", "newPlayer("+ i + ")");
            var element = document.getElementById("newplayers");
            element.appendChild(playerButtons[i]);

        }
     addNewOpen = true;
    }
    else
        newPlayerButtonsClose();
}

//removes the buttons used to add new players
function newPlayerButtonsClose(){
    for(var i = 0; i < playerListWords.length; i++)
        document.getElementById("playerButton" + i).remove();
    addNewOpen = false;
}


//adds a new player based on the instrument
function newPlayer(c){
    var words = [];
    var xPixels = [];
    var yPixels = [];
    for(var i = 0; i < setCount; i++){
        words.push("unset");
        xPixels.push("unset");
        yPixels.push("unset");
    }
    words.splice(setCount-1, 1, coordsToString(32, 32));
    xPixels.splice(setCount-1, 1, 32);
    yPixels.splice(setCount-1, 1, 32);
    playerListWords[c].push(words);
    playerListXPixels[c].push(xPixels);
    playerListYPixels[c].push(yPixels);
    
    localStorage.setItem("wShow" + showCount + ":" + instrumentLetterList[c] + playerListWords[c].length, playerListWords[c][playerListWords[c].length-1].join("\n"));
    localStorage.setItem("xShow" + showCount + ":" + instrumentLetterList[c] + playerListWords[c].length, playerListXPixels[c][playerListWords[c].length-1].join("\n"));
    localStorage.setItem("yShow" + showCount + ":" + instrumentLetterList[c] + playerListWords[c].length, playerListYPixels[c][playerListWords[c].length-1].join("\n"));

    
    newPlayerButtonsClose();
    
    
    var player = document.createElement("p");
    player.innerHTML = "<b><b>•<br>" + instrumentLetterList[c] + playerListWords[c].length + "</b>";
    player.setAttribute("class", "player");
    player.setAttribute("id", instrumentLetterList[c] + playerListWords[c].length);
    player.setAttribute("instnum", c);
    player.setAttribute("num", playerListWords[c].length);
    player.setAttribute("draggable", "true");
    player.setAttribute("onclick", "playerSelect("+ c + ", "+ (playerListWords[c].length) +")");
    player.setAttribute("style", "top: 33px; left: 32.5px;");
    
    document.getElementById(toInstrumentId(instrumentList[c])).appendChild(player);
    
    playerNums[c]++;
    localStorage.setItem("PlayerNums", playerNums.join("\n"));
    
}


//adds a new player based on the instrument (used on startup and changin sets)
function loadPlayer(c, v){

    var player = document.createElement("p");
    var i = 0;
    if(!playerListWords[c][v][setCount-1] || playerListWords[c][v][setCount-1] == "unset"){
        var i = 0;
        while(playerListWords[c][v][i] == "unset" || !playerListWords[c][v][i]){
            i++;
        }
        player.setAttribute("style", "top: " + (playerListYPixels[c][v][i]) + "px; left: " + playerListXPixels[c][v][i] + "px;");
    }
    
    player.innerHTML = "<b><b>•<br>" + instrumentLetterList[c] + (v + 1) + "</b>";
    player.setAttribute("class", "player");
    player.setAttribute("id", instrumentLetterList[c] + (v + 1));
    player.setAttribute("instnum", c);
    player.setAttribute("num", (v + 1));
    player.setAttribute("draggable", "true");
    player.setAttribute("onclick", "playerSelect("+ c + ", "+ (v + 1) +")");
    player.setAttribute("style", "top: " + (playerListYPixels[c][v][setCount-1]) + "px; left: " + playerListXPixels[c][v][setCount-1] + "px;");
    
    document.getElementById(toInstrumentId(instrumentList[c])).appendChild(player);
}


//selects a player when clicked
function playerSelect(i, c){
    if(printMode == true)
    togglePrintMode();
    selected = instrumentLetterList[i] + c
    var list = document.getElementsByClassName("player");
    for(var o = 0; o < list.length; o++){
        list[o].style.color = "black";
    }
    document.getElementById(selected).style.color = "red";
    document.getElementById("coordsText").innerHTML = coordsToString(Math.round(parseInt(document.getElementById(selected).style.left.slice(0,-2))/4)*4, Math.round(parseInt(document.getElementById(selected).style.top.slice(0,-2))/4)*4);
}


//set selected as blank and turns all players black
function deselect(){
    if(selectedTravelDistance == true)
        setLines();
    selectedTravelDistance = false;
    selected = "";
    var list = document.getElementsByClassName("player");
    for(var o = 0; o < list.length; o++){
        if(list[o].style.color == "red")
            list[o].style.color = "black";
    }
    document.getElementById("coordsText").innerHTML = "Click on a player to select them";
}


//changes to prior set
function previousSet() {
    setLines();
    if(setCount > 1){
        setCount--;
        localStorage.setItem("Set", setCount);
        document.getElementById("setcount").innerHTML = setCount;
        for(var i = 0; i < playerListXPixels.length; i++){
            for(var c = 0; c < playerListXPixels[i].length; c++){
                    document.getElementById(instrumentLetterList[i]+(c+1)).remove();

            }
        }
        for(var i = 0; i < playerListXPixels.length; i++){
            var c = 0;
            while(c < playerNums[i]){
                if(playerListWords[i][c][setCount-1] !== "unset" && playerListWords[i][c][setCount-1]){
                    loadPlayer(i, c);
                }
                else{
                    playerListWords[i][c][setCount-1] = playerListWords[i][c][setCount];
                    playerListXPixels[i][c][setCount-1] = playerListXPixels[i][c][setCount];
                    playerListYPixels[i][c][setCount-1] = playerListYPixels[i][c][setCount];

                    localStorage.setItem("wShow" + showCount + ":" + instrumentLetterList[i] + (c+1), playerListWords[i][c].join("\n"));
                    localStorage.setItem("xShow" + showCount + ":" + instrumentLetterList[i] + (c+1), playerListXPixels[i][c].join("\n"));
                    localStorage.setItem("yShow" + showCount + ":" + instrumentLetterList[i] + (c+1), playerListYPixels[i][c].join("\n"));

                    loadPlayer(i, c);
                }
                c++;
            }
        }
    }
    if(selected)
        playerSelect(document.getElementById(selected).getAttribute("instnum"), document.getElementById(selected).getAttribute("num"));
    if(printMode == true)
        checkDistance();
}


//changes to next set
function nextSet() {
    setLines();
    var a = 0;
    while (playerListWords[a].length == 0 && a < 20)
        a++;
    if(a !== 20){
        if(setCount-1 < playerListWords[a][0].length){
            setCount++;
            localStorage.setItem("Set", setCount);
            document.getElementById("setcount").innerHTML = setCount;
            for(var i = 0; i < playerListXPixels.length; i++){
                for(var c = 0; c < playerListXPixels[i].length; c++){
                    document.getElementById(instrumentLetterList[i]+(c+1)).remove();

                }
            }
            for(var i = 0; i < playerListXPixels.length; i++){
                var c = 0;
                while(c < playerNums[i]){
                    if(playerListWords[i][c][setCount-1] !== "unset" && playerListWords[i][c][setCount-1])
                        loadPlayer(i, c);
                    else{
                        playerListWords[i][c][setCount-1] = playerListWords[i][c][setCount - 2];
                        playerListXPixels[i][c][setCount-1] = playerListXPixels[i][c][setCount - 2];
                        playerListYPixels[i][c][setCount-1] = playerListYPixels[i][c][setCount - 2];
                        
                        localStorage.setItem("wShow" + showCount + ":" + instrumentLetterList[i] + (c+1), playerListWords[i][c].join("\n"));
    localStorage.setItem("xShow" + showCount + ":" + instrumentLetterList[i] + (c+1), playerListXPixels[i][c].join("\n"));
    localStorage.setItem("yShow" + showCount + ":" + instrumentLetterList[i] + (c+1), playerListYPixels[i][c].join("\n"));
                        
                        loadPlayer(i, c);
                    }
                    c++;
                }
            }
        }
    }
    if(selected)
        playerSelect(document.getElementById(selected).getAttribute("instnum"), document.getElementById(selected).getAttribute("num"));
    if(printMode == true)
        checkDistance();
}


//highlights players closer than 6 feet apart
function checkDistance(){
    console.log(1);
    for(var i = 0; i < playerListWords.length; i++){
        for(var c = 0; c < playerListWords[i].length; c++){
            var id1 = instrumentLetterList[i] + (c+1);
            for(var a = i; a < playerListWords.length; a++){
                var bc = c + 1
                if(a !== i)
                    bc = 0;
                for(var b = bc; b < playerListWords[a].length; b++){
                    var id2 = instrumentLetterList[a] + (b+1);
                    var x1 = document.getElementById(id1).style.left.slice(0,-2);
                    var y1 = document.getElementById(id1).style.top.slice(0,-2);
                    var x2 = document.getElementById(id2).style.left.slice(0,-2);
                    var y2 = document.getElementById(id2).style.top.slice(0,-2);
                    if(Math.sqrt(Math.pow(x1-x2, 2)+ Math.pow(y1-y2, 2)) < 25.6){
                        document.getElementById(id1).style.color = "darkorange";
                        document.getElementById(id2).style.color = "darkorange";
                    }
                }
            }
        }
    }
}


//draws a line from the selected player to its previous set
function travelDistance(){
    if(selected){
        setLines();
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        var instnum = document.getElementById(selected).getAttribute("instnum");
        var num = document.getElementById(selected).getAttribute("num");
        ctx.beginPath();        
        ctx.moveTo(playerListXPixels[instnum][num-1][setCount-1], playerListYPixels[instnum][num-1][setCount-1]);
        ctx.lineTo(playerListXPixels[instnum][num-1][setCount-2], playerListYPixels[instnum][num-1][setCount-2]);
        
        var gradient = ctx.createLinearGradient(playerListXPixels[instnum][num-1][setCount-1],playerListYPixels[instnum][num-1][setCount-1],playerListXPixels[instnum][num-1][setCount-2],playerListYPixels[instnum][num-1][setCount-2]);
        gradient.addColorStop("0", "red");
        gradient.addColorStop("1.0", "blue");
        
        ctx.strokeStyle = gradient;
        
        ctx.lineWidth = 2;
        ctx.stroke();
        selectedTravelDistance = true;
    }
}


//draws a line from all players to their previous set
function allTravelDistance(){
    setLines();
    if(allTravelDistances == false){
        for(var instnum = 0; instnum < playerListXPixels.length;  instnum++){
            for(var num = 1; num <= playerListXPixels[instnum].length; num++){
                var c = document.getElementById("myCanvas");
                var ctx = c.getContext("2d");
                ctx.beginPath();        
                ctx.moveTo(playerListXPixels[instnum][num-1][setCount-1], playerListYPixels[instnum][num-1][setCount-1]);
                ctx.lineTo(playerListXPixels[instnum][num-1][setCount-2], playerListYPixels[instnum][num-1][setCount-2]);

                var gradient = ctx.createLinearGradient(playerListXPixels[instnum][num-1][setCount-1],playerListYPixels[instnum][num-1][setCount-1],playerListXPixels[instnum][num-1][setCount-2],playerListYPixels[instnum][num-1][setCount-2]);
            gradient.addColorStop("0", "red");
            gradient.addColorStop("1.0", "blue");

            ctx.strokeStyle = gradient;

                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        allTravelDistances = true;
    }
    else{
        allTravelDistances = false;
    }
}

                                
//takes a number used as an index in playerList and returns to corresponding instrument letter
function toInstrumentLetter(x){
    if(x == 0)
        return "P";//Piccolo
    if(x == 1)
        return "F";//Flute
    if(x == 2)
        return "C";//Clarinet
    if(x == 3)
        return "D";//Bass Clarinet
    if(x == 4)
        return "A";//Alto Sax
    if(x == 5)
        return "K";//Tenor Sax
    if(x == 6)
        return "S";//Bari Sax
    if(x == 7)
        return "T";//Trumpet
    if(x == 8)
        return "M";//Mellophone
    if(x == 9)
        return "B";//Baritone
    if(x == 10)
        return "O";//Tuba
    if(x == 11)
        return "SD";//Snare
    if(x == 12)
        return "TD";//Tenor
    if(x == 13)
        return "BD";//Bass
    if(x == 14)
        return "G";//Guard
}


//takes a number used as an index in playerList and returns to corresponding instrument
function toInstrument(x){
    if(x == 0)
        return "Piccolo";
    if(x == 1)
        return "Flute";
    if(x == 2)
        return "Clarinet";
    if(x == 3)
        return "Bass Clarinet";
    if(x == 4)
        return "Alto Sax";
    if(x == 5)
        return "Tenor Sax";
    if(x == 6)
        return "Bari Sax";
    if(x == 7)
        return "Trumpet";
    if(x == 8)
        return "Mellophone";
    if(x == 9)
        return "Baritone";
    if(x == 10)
        return "Tuba";
    if(x == 11)
        return "Snare";
    if(x == 12)
        return "Tenor";
    if(x == 13)
        return "Bass";
    if(x == 14)
        return "Guard";
}



//takes and instrument number and converts it into the id version
function toInstrumentId(str){
    var i = 0
    while(i < str.length){
        if (str.substring(i,i+1) == " ")
        str = str.substring(0,i) + str.substring(i+1)
        i = i + 1;
    }
    str = str.toLowerCase();
    return str;
}
    

//change pixel coords to a string
function coordsToString(x, y){
    x = Math.round(x);
    y = Math.round(y);
    var word = "";
    //side 1/2
    if(x <= 640){
        word = word + "Side 1: ";
    }
    else{
        word = word + "Side 2: ";
    }
    var x2 = Math.round(x/64)*5;
    var x2a = x2
    if (x2 > 50){
        var x2a = 100 - x2;
    }
    var x3 = x2*12.8;
    if(x <= 640){
        x3 = x - x3;
    }
    else{
        x3 = x3 - x;
    }
    
    //in vs out distance
    if (x3 !== 0){
        if(Math.abs(x3)/8 != 1)
            word = word + Math.abs(x3)/8 +" steps ";
        if(Math.abs(x3)/8 == 1)
            word = word + Math.abs(x3)/8 +" step ";
    }

    //inside vs outside
    
    if(x3 > 0){
        word = word + "inside ";
    }
    else if(x3 < 0){
        word = word + "outside ";
    }
    else{
        word = word + "On top ";
    }
    
    //Yardline

    
    if (x2a <= 0)
        word = word + "the goal line, ";
    else
        word = word + "the " + x2a + " yd ln, ";
    
    var y2 = Math.round(y/224);
    
    var y3 = y2*224;
    y3 = y-y3;

    //front vs back distance
    if (y3 !== 0){
        if(Math.abs(y3)/8 !== 1)
            word = word + Math.abs(y3)/8 +" steps ";
        if(Math.abs(y3)/8 == 1)
            word = word + Math.abs(y3)/8 +" step ";
    }    
    
    //front vs back
    if(y3 > 0){
        word = word + "in front of ";
    }
    else if(y3 < 0){
        word = word + "behind ";
    }
    else{
        word = word + "On top of ";
    }
    
        y2 = 3-y2;
    //Hash vs sideline
    if(y2 <= 0){
        word = word + "the front sideline ";
    }
    else if(y2 == 1){
        word = word + "the front hash ";
    }
    else if(y2 == 2){
        word = word + "the back hash ";
    }
    else{
        word = word + "the back sideline ";
    }
    
    return word;
}


//makes all unnecessary button opaque and deselects player
function togglePrintMode(){
    if(printMode == false){
        deselect();
        setLines();
        document.getElementById("sets").style.opacity = 0;
        document.getElementById("extras").style.opacity = 0;
        document.getElementById("newplayers").style.opacity = 0;
        document.getElementById("print").style.opacity = 1;
        checkDistance();
        printMode = true;
    }
    else{
        document.getElementById("sets").style.opacity = 1;
        document.getElementById("extras").style.opacity = 1;
        document.getElementById("newplayers").style.opacity = 1;
        printMode = false;
    }
}