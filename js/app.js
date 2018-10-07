// Code is poetry
// Created by black.dragon74
// Dependent on jQuery 3.1+

// Find canvas element by ID
let canvas = $('#draw')[0];

// Set canvas height and width
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Get 2D context for drawing
let ctx = canvas.getContext("2d");

// Set fireflies colors, as an array
let colors = ["yellow", "teal", "fuchsia", "green"];

// Firefly default instance configuration
let config = {
    "x": 411,
    "y": 67,
    "dx": 0.04024953982157116,
    "dy": 0.16881382593361466,
    "color": "red",

    // User changable config
    "num_flies": 100,
    "max_radius": 5
}

// Create the background image
let bg_img = new Image();
bg_img.src = 'img/bg.jpg';

// Custom functions used in script are declared below

// Returns a random number from the given range
function randomInRange(min, max){
    // Number should be rounded off and positive
    if (min < 0 || max < 0){
        return 1;
    }
    else {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

// Parses the above declared colors array and returns a single random color
function colorFromColors(colors){
    return colors[randomInRange(0, colors.length-1)]; // -1 to prevent undefined index in array
}

// Update canvas height and width on each window resize
$(window).on('resize', function () {
   canvas.height = window.innerHeight;
   canvas.width = window.innerWidth;
});

// Define a function which draws and animates fireflies and stores them as an instance object
function Fireflies(x, y, dx, dy, radius, color){
    // Setters to access args as objects, like: Fireflies.color will return the arg passed as color
    this.x = x !== undefined ? x : config.x;
    this.y = y !== undefined ? y : config.y;
    this.dx = dx !== undefined ? dx : config.dx;
    this.dy = dy !== undefined ? dy : config.dy;
    this.radius = radius !== undefined ? radius : config.max_radius;
    this.color = color !== undefined ? color : config.color;
    this.draw = function () {
        ctx.save(); // Else previous fireflies will be overridden
        ctx.beginPath(); // Here-th begins fly creation
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); // Arc args as: x, y, radius, startAngle, endAngle, antiClockwise draw a circle
        ctx.shadowOffsetX = 0; // Place shadow behind obj to create a glow like effect
        ctx.shadowOffsetY = 0; // Place shadow behind obj to create a glow like effect
        ctx.shadowBlur = 20; // Blur radius; helps with the fade and renders glow
        ctx.shadowColor = this.color; // Self explanatory
        ctx.fillStyle = this.color; // Set fill color to chosen color
        ctx.fill(); // Image is filled and ready to be rendered
        ctx.closePath(); // Done with the drawing, close the path
        ctx.restore(); // Finally draw the fly and restore the previous flies
    };
    this.fly = function(){
        // Update the position of the flies in real time
        if (this.y < 0){ // If that fly flies out of canvas on Y axis
            this.y = canvas.height;
            this.x = randomInRange(this.radius, canvas.width); // We don't want to put that damn fly out of canvas again, right?
        }
        if (this.x > canvas.width){ // If that fly flies out of canvas on X axis
            this.x = 0;
            this.y = randomInRange(this.radius, canvas.height); // We don't want to put that damn fly out of canvas again, right?
        }
        // This moves flies from left to right in the upward direction
        this.x += this.dx; // Increase x by dx units to move fly from left to right
        this.y -= this.dy; // Decrease y by dy units to move fly from down to up
        // Now that we have done all the math, let's paint
        this.draw();
    }
}

// Create an empty flies object to store Fireflies instances
let flies = [];

// Create a function that populates the above array with Fireflies instances
function prepareFlies(){
    flies = [];
    for (let i = 1; i <= config.num_flies; i++){
        // This for loop creates a fly on the canvas every-time it runs
        // Let's define our flies, we'll make the values random as we don't want the flies to be overlapping
        let fly = new Fireflies(); // Create a new instance of the fireflies
        fly.radius = randomInRange(1, config.max_radius);
        fly.x = randomInRange(fly.radius, canvas.width);
        fly.y = randomInRange(fly.radius, canvas.height);
        fly.dx = Math.random() / 5; // Not rounding off as we want displacement to be slow
        fly.dy = Math.random() / 5; // Not rounding off as we want displacement to be slow
        fly.color = colorFromColors(colors);

        // Done with makeup and shit, store the fly in the array
        flies.push(fly);
    }
}

function makeThemFly() {
    requestAnimationFrame(makeThemFly); // Callback calling the function itself
    ctx.drawImage(bg_img, 0, 0); // Start from x and y at 0 and draw the bg_img

    // For each stored Fireflies in the flies array, draw and fly them.
    for (let i = 0; i < flies.length; i++){
        flies[i].fly();
    }
}

// Wohooooo!!! Time to actually execute the above functions
$(document).ready(function () {
   prepareFlies();
   makeThemFly();
});
