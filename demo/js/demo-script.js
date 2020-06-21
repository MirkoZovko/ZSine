


$("body").on("click",".handle", function(){
    
    if($(this).parent().hasClass("close")){
        $(this).parent().removeClass("close");
        var audio = new Audio('audio/lightsaber_on_02.mp3');
        audio.play();
    }else{
        $(this).parent().addClass("close");    
        var audio = new Audio('audio/lightsaber_off_01.mp3');
        audio.play(); 
    }
})

$("body").on("click",".btn", function(){
    $(".active").removeClass("active");
    $(this).addClass("active");
    $(".waves").removeClass(activeEffect[0]);
    $(".glow").removeClass(activeEffect[1]);

    var newEffect = $(this).attr("effect");
    window[activeEffect[0]].destroy();

    for(var i=0; i<allEffects.length; i++){
        if(allEffects[i].effect==newEffect){
            activeEffect[0]=newEffect;
            activeEffect[1]=allEffects[i].color;
        }
    }
    $(".waves").addClass(activeEffect[0]);
    $(".glow").addClass(activeEffect[1]);
    window[activeEffect[0]].update();
});



window.requestAnimFrame = (function () { return window.requestAnimationFrame })();
var canvas = document.getElementById("space");
var c = canvas.getContext("2d");

var numStars = 1900;
var radius = '0.' + Math.floor(Math.random() * 9) + 1;
var focalLength = canvas.width * 2;
var warp = 0;
var centerX, centerY;

var stars = [], star;
var i;

var animate = true;

var animationID;

initializeStars();

function executeFrame() {

    if (animate)
        animationID = requestAnimFrame(executeFrame);
    moveStars();
    drawStars();
}

function initializeStars() {
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;

    stars = [];
    for (i = 0; i < numStars; i++) {
        star = {
            x: Math.random() * 1920,
            y: Math.random() * 1080,
            z: Math.random() * 1920,
            o: '0.' + Math.floor(Math.random() * 99) + 1
        };
        stars.push(star);
    }
}

function moveStars() {
    for (i = 0; i < numStars; i++) {
        star = stars[i];
        star.z--;

        if (star.z <= 0) {
            star.z = 1920;
        }
    }
}

function drawStars() {
    var pixelX, pixelY, pixelRadius;

    // Resize to the screen
    if (canvas.width != window.innerWidth || canvas.width != window.innerWidth || canvas.height != window.innerHeight || canvas.height != window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeStars();
    }

    c.fillStyle = "rgba(0,0,0,1)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "rgba(0, 0, 0, " + radius + ")";
    for (i = 0; i < numStars; i++) {
        star = stars[i];

        pixelX = (star.x - centerX) * (focalLength / star.z);
        pixelX += centerX;
        pixelY = (star.y - centerY) * (focalLength / star.z);
        pixelY += centerY;
        pixelRadius = 1 * (focalLength / star.z);

        c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
        c.fillStyle = "rgba(255, 255, 255, " + star.o + ")";
        //c.fill();
    }
}

executeFrame();

window.onresize = function() {
  cancelAnimationFrame(animationID);
  
  initializeStars();
  executeFrame(); 
}


$("body").on("click",".zsine-close", function(){
    $(this).parent().toggleClass("close");
    console.log("test");
});

$(".mobile-menu").click(function(){
    $(this).parent().toggleClass("hide");
})

closeOnMobile();
function closeOnMobile(){
    if($(window).width()<768){
        $(".mobile-menu").parent().addClass("hide");
    }
}