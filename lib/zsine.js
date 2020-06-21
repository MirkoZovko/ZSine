/*

▒███████▒     ██████  ██▓ ███▄    █ ▓█████ 
▒ ▒ ▒ ▄▀░   ▒██    ▒ ▓██▒ ██ ▀█   █ ▓█   ▀ 
░ ▒ ▄▀▒░    ░ ▓██▄   ▒██▒▓██  ▀█ ██▒▒███   
  ▄▀▒   ░     ▒   ██▒░██░▓██▒  ▐▌██▒▒▓█  ▄ 
▒███████▒   ▒██████▒▒░██░▒██░   ▓██░░▒████▒
░▒▒ ▓░▒░▒   ▒ ▒▓▒ ▒ ░░▓  ░ ▒░   ▒ ▒ ░░ ▒░ ░
░░▒ ▒ ░ ▒   ░ ░▒  ░ ░ ▒ ░░ ░░   ░ ▒░ ░ ░  ░
░ ░ ░ ░ ░   ░  ░  ░   ▒ ░   ░   ░ ░    ░   
  ░ ░             ░   ░           ░    ░  ░
░                                          
                                                                       
* zsine.js
* @author  Mirko Zovko <mirko.zovko@gmail.com>
* @version 0.0.1
* @url zovko.pro
*/


var ZSine = (function () {

	'use strict';

	/**
	 * The constructor object
	 */
	var Constructor = function (options) {

		//Variables
		var lastTimestamp = 0,
		timestep = null,
		speedStep = 0,
		c = null,
		ctx = null,
		settings = null;

		var animationFrame = null;
		var publicMethods = {}; // Placeholder for public methods

		// Default settings
		var defaults = {
			width: 500,
			height: 500,
			maxFPS: 120,
			showXYLine: false,
			rotateCanvas: 0,
			selector: "#zwave",		
			speed: 1,
			moveFoward:1,
			backgroundColor: "transparent",
			waves:[
				{
					step: 1,
					frequency: 20,	
					amplitude: 60,	
					amplitudeType: "low",			
					color: "rgb(66,44,255)",
					colorGradient: [],
					width: 2,
					shadowBlur: 5,
					shadowColor: "rgb(66,44,255)",
					plotLine: "x"
				}
			]
		};

		var init = function () {

			// Merge user options into defaults
			settings = Object.assign({}, defaults, options);
			/* 
				Merge default wave options with user waves list 
				to make sure that something is not missing from wave
			*/
			settings = addDefaultValuesToTheWave(settings);
			timestep = 1000 / settings.maxFPS;
			c = document.querySelector(settings.selector);
			
			if(c!=null){
				c.style.backgroundColor = settings.backgroundColor;

				if(settings.rotateCanvas!=0){
					c.style.transform = "rotate("+settings.rotateCanvas+"deg)";
				}
				ctx = c.getContext("2d");
				ctx.canvas.width = settings.width;
				ctx.canvas.height = settings.height;
		
				animationFrame = window.requestAnimationFrame(animationEngine);
			}
		}

		init();

		function animationEngine(timestamp){
			animationFrame = window.requestAnimationFrame(animationEngine);
			if (timestamp - lastTimestamp < timestep) return;
			lastTimestamp = timestamp;
	
			speedStep+=settings.speed;
			ctx.clearRect(0, 0, settings.width, settings.height);
			ctx.save();  
	
			/* ###### Draw functions */
			settings.moveFoward += settings.speed;


			for(var i=0; i<settings.waves.length; i++){
				plotFunction(
					settings.moveFoward, 
					settings.waves[i].amplitude, 
					settings.waves[i].amplitudeType, 
					settings.waves[i].frequency, 
					settings.waves[i].step, 
					settings.waves[i].color,
					settings.waves[i].colorGradient,
					settings.waves[i].width,
					settings.waves[i].shadowBlur,
					settings.waves[i].shadowColor,
					settings.waves[i].plotLine			
				) 
			}
	
			/* ###### Show coordinate system*/
			if(settings.showXYLine===true){
				drawCoordinateLine();
			}
			
		}
	
		function plotFunction(moveFoward, amplitude, amplitudeType, frequency, step, color, colorGradient, width, shadowBlur, shadowColor, plotLine) {
			var waveDots = [];
			
			var x = 0, y = 0;

			if(plotLine==="x"){
				var newAmplitude = amplitudeTypeFunction(amplitudeType, amplitude, x, step, settings.width, "x");
				waveDots.push({x:0, y:settings.height/2 + newAmplitude * Math.sin((x+moveFoward)/frequency)});
				while (x < settings.width) {
					
					var newAmplitude = amplitudeTypeFunction(amplitudeType, amplitude, x, step, settings.width, "x");
					y = settings.height/2 + newAmplitude * Math.sin((x+moveFoward)/frequency);	
					waveDots.push({x:x, y:y});
					x+=step;
				}
				var newAmplitude = amplitudeTypeFunction(amplitudeType, amplitude, x, step, settings.width, "x");
				y = settings.height/2 + newAmplitude * Math.sin((x+moveFoward)/frequency);
				waveDots.push({x:settings.width, y:y});
				x+=step;
			}else{	
				var newAmplitude = amplitudeTypeFunction(amplitudeType, amplitude, y, step, settings.height, "y");
				waveDots.push({x:settings.width/2 + newAmplitude * Math.sin((y-moveFoward)/frequency), y:0});
				while (y < settings.height) {
					var newAmplitude = amplitudeTypeFunction(amplitudeType, amplitude, y, step, settings.height, "y");
					x = settings.width/2 + newAmplitude * Math.sin((y+moveFoward)/frequency);
					waveDots.push({x:x, y:y});
					y+=step;
				}
				var newAmplitude = amplitudeTypeFunction(amplitudeType, amplitude, y, step, settings.height, "y");
				x = settings.width/2 + newAmplitude * Math.sin((y+moveFoward)/frequency);
				waveDots.push({x:x, y:settings.height});
				y+=step;
			}

			drawLines(waveDots, color, colorGradient, width, shadowBlur, shadowColor, plotLine);

		}

		function drawLines(waveDots, color, colorGradient, width, shadowBlur, shadowColor, plotLine){
			ctx.beginPath(); 
			ctx.lineWidth = width;
			ctx.strokeStyle = color;
			ctx.lineJoin = ctx.lineCap = 'round';
			ctx.imageSmoothingQuality = "high";
			if(shadowBlur>0){
				ctx.shadowBlur = shadowBlur;
				ctx.shadowColor = shadowColor;
			}
			easeInOutColor(plotLine, colorGradient); 
			ctx.moveTo(waveDots[0].x, waveDots[0].y);
			for(var i=1; i<waveDots.length; i++){
				ctx.lineTo(waveDots[i].x, waveDots[i].y);
			}
			ctx.stroke();
		}
	
		function drawArcs(waveDots, color, colorGradient, width, shadowBlur, shadowColor, plotLine){

			ctx.moveTo(waveDots[0].x, waveDots[0].y);
			for(var i=1; i<waveDots.length; i++){
				if(i%5==0){
					ctx.beginPath();
					if(shadowBlur>0){
						ctx.shadowBlur = shadowBlur;
						ctx.shadowColor = shadowColor;
					}
					
					ctx.arc(waveDots[i].x, waveDots[i].y, 1, 0, 2 * Math.PI);
					var gradient = ctx.createLinearGradient(0, settings.height, 0, 0);
					gradient.addColorStop(0,"rgba(0, 0, 0, 0)");
					gradient.addColorStop(0.5,"rgba(255, 255, 255, 0.5)");
					gradient.addColorStop(1,"rgba(0, 0, 0, 0)");	
					ctx.fillStyle = gradient;
					ctx.fill();
				}
				
			}	
		}
	
		function amplitudeTypeFunction(amplitudeType, amplitude, x, step, distance, cline){
			var newAmplitude = amplitude;
			if(cline=="x"){
				if(x<(distance/2)){
					if(amplitudeType=="low" || amplitudeType=="lowIn" || amplitudeType=="lowIn-highOut"){
						newAmplitude = amplitude*x/(distance/2);
					}
					if(amplitudeType=="high" || amplitudeType=="highIn" || amplitudeType=="highIn-lowOut"){
						newAmplitude = amplitude*(distance-x)/(distance/2);
					}
					
				}else{
					if(amplitudeType=="low" || amplitudeType=="lowOut" || amplitudeType=="highIn-lowOut"){
						newAmplitude = amplitude*(distance-x)/(distance/2);
					}
					if(amplitudeType=="high" || amplitudeType=="highOut" || amplitudeType=="lowIn-highOut"){
						newAmplitude = amplitude*x/(distance/2);
					}		
				}
			}else{
				if(x<(distance/2)){
					if(amplitudeType=="low" || amplitudeType=="lowOut" || amplitudeType=="highIn-lowOut"){
						newAmplitude = amplitude*x/(distance/2);
					}
					if(amplitudeType=="high" || amplitudeType=="highOut" || amplitudeType=="lowIn-highOut"){
						newAmplitude = amplitude*(distance-x)/(distance/2);
					}
					
				}else{
					if(amplitudeType=="low" || amplitudeType=="lowIn" || amplitudeType=="lowIn-highOut"){
						newAmplitude = amplitude*(distance-x)/(distance/2);
					}	
					if(amplitudeType=="high" || amplitudeType=="highIn" || amplitudeType=="highIn-lowOut"){
						newAmplitude = amplitude*x/(distance/2);
					}	
				}
			}
			
			return newAmplitude;
		}
		
		function easeInOutColor(cline,colorGradient) {
			var gradient = null;
			if(cline=="x"){
				gradient = ctx.createLinearGradient(0, 0, settings.width, 0);
			}else{
				gradient = ctx.createLinearGradient(0, settings.height, 0, 0);
			}
			if(colorGradient.length!=0){
				for(var i=0; i<colorGradient.length; i++){
					gradient.addColorStop(colorGradient[i].offset,colorGradient[i].color);
				}
				ctx.strokeStyle = gradient;
			}
			// gradient.addColorStop(0,"rgba(0, 0, 0, 0)");
			// gradient.addColorStop(0.5,"rgba(255, 255, 255, 0.5)");
			// gradient.addColorStop(1,"rgba(0, 0, 0, 0)");	
			// ctx.strokeStyle = gradient;
		}
	
		function drawCoordinateLine(){
			var xMin = 0;	
			ctx.shadowBlur = 0;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.strokeStyle = "rgb(128,128,128)";
	
			// X-Axis
			ctx.moveTo(xMin, settings.height/2);
			ctx.lineTo(settings.width, settings.height/2);
			
			// Y-Axis
			ctx.moveTo(settings.width/2, 0);
			ctx.lineTo(settings.width/2, settings.height);
			
			ctx.stroke();
		}
	
		function addDefaultValuesToTheWave(settings){
			var defaultWaveValues ={
				step: 1,
				frequency: 20,	
				amplitude: 60,	
				amplitudeType: "low",				
				color: "rgb(66,44,255)",
				colorGradient: [],
				width: 2,
				shadowBlur: 0,
				shadowColor: "rgb(66,44,255)",
				plotLine: "x",
			}
	
			for(var i=0; i<settings.waves.length; i++){
				settings.waves[i] = Object.assign({}, defaultWaveValues, settings.waves[i]);
			}
			return settings;
		}

		publicMethods.destroy = function () {
			window.cancelAnimationFrame(animationFrame);
			ctx.clearRect(0, 0, settings.width, settings.height);
			ctx.save(); 
		};
		publicMethods.update = function () {
			init();
		};
		publicMethods.getSpeed = function () {
			return options.speed;
		};
		publicMethods.changeSpeed = function (new_speed) {
			options.speed = parseFloat(new_speed);
			init();
		};

		return publicMethods;
	};

	// Return the constructor
	return Constructor;

})();