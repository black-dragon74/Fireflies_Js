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
    let colorIndex;

    // If colors[index] is undefined we will regenerate a new index. Nobody wants transparent fireflies
    do {
        colorIndex = colors[randomInRange(0, colors.length)];
    }
    while (colorIndex === undefined);

    return colorIndex;
}

// Update canvas height and width on each window resize
$(window).on('resize', function () {
   canvas.height = window.innerHeight;
   canvas.width = window.innerWidth;
});

// Define a function which draws and animates fireflies and stores them as an instance object
function Fireflies(x, y, dx, dy, radius, color){
    // Setters to access args as objects, like: Fireflies.color will return the arg passed as color
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
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
    //TODO: make flies number user configurable
    for (let i = 1; i <= 100; i++){
        // This for loop creates a fly on the canvas every-time it runs
        // Let's define our flies, we'll make the values random as we don't want the flies to be overlapping
        let fly_radius = randomInRange(1, 5); // TODO: Make radius user configurable
        let fly_x = randomInRange(fly_radius, canvas.width);
        let fly_y = randomInRange(fly_radius, canvas.height);
        let fly_dx = Math.random() / 5; // Not rounding off as we want displacement to be slow
        let fly_dy = Math.random() / 5; // Not rounding off as we want displacement to be slow
        let fly_color = colorFromColors(colors);

        // Done with makeup and shit, store the fly in the array
        flies.push(new Fireflies(fly_x, fly_y, fly_dx, fly_dy, fly_radius, fly_color));
    }
}

function makeThemFly() {
    requestAnimationFrame(makeThemFly); // Callback calling the function itself
    ctx.drawImage(bg_img, 0, 0); // Start from x and y at 0 and draw the bg_img

    // For each stored Fireflies in the flies array, draw and fly them.
    for (let i = 0; i <= flies.length; i++){
        if (flies[i] !== undefined){
            flies[i].fly();
        }
    }
}

// Wohooooo!!! Time to actually execute the above functions
$(document).ready(function () {
   prepareFlies();
   makeThemFly();
});
