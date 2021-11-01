setLines();
function setLines(){
    electedTravelDistance = false;
    allTravelDistances = false;
    var x = 1;

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
    ctx.beginPath();
    ctx.strokeStyle = "lightblue";
    while (x < 160){
        ctx.moveTo(8*x, 0);
        ctx.lineTo(8*x,672);
        x= x+1;
    }
    x = 1;
    while (x < 84){
        ctx.moveTo(0, 8*x);
        ctx.lineTo(1280,8*x);
        x= x+1;
    }
    ctx.lineWidth = 2;
    ctx.stroke();

    x = 1;
    ctx.beginPath();
    while (x < 21){
        ctx.moveTo(64*x - 32, 0);
        ctx.lineTo(64*x - 32,672);
        x= x+1;
    }
    ctx.lineWidth = 2;
    ctx.stroke();

    x = 1;
    while (x < 21){
        ctx.moveTo(0, 32*x);
        ctx.lineTo(1280, 32*x);
        x= x+1;
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "silver";
    ctx.stroke();

    x = 0;
    ctx.beginPath();
    while (x < 21){
        ctx.moveTo(64*x, 0);
        ctx.lineTo(64*x,672);
        x= x+1;
    }
    ctx.moveTo(0, 0);
    ctx.lineTo(1280, 0);
    ctx.moveTo(0, 32*7);
    ctx.lineTo(1280, 32*7);
    ctx.moveTo(0, 32*14);
    ctx.lineTo(1280, 32*14);
    ctx.moveTo(0, 32*21);
    ctx.lineTo(1280, 32*21);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "darkslategrey";
    ctx.stroke();
}