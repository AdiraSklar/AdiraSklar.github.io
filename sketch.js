let previousMinute = null;
let plate = []; // the ones in the bowl 
let machineGumballs = []; // the ones in the machine
let machineY = 200;
let machineX = 200;
let spinActive = false;
let spinStartTime = 0;
let spinDuration = 1000;
let angle = 0; // angle for the spinning knob
let colors = ['blue', 'red', 'orange', 'yellow', 'purple', 'green'];

function setup() {
    createCanvas(800, 600);
    let currentMinute = minute();
    initializeGumballs(currentMinute);
    previousMinute = currentMinute;
}

function draw() {
    let hr = hour();
    let min = minute();
    let sec = second();
    background(225);
    
    drawGumballMachine(min);
    drawPlate();
    checkMinuteChange(min);
    drawPillar(sec);
    drawHourRing(hr);
}

function drawGumballMachine(minute) {
    fill(200);
    ellipse(machineX, machineY, 200, 200);
    let gumballSize = 20;
    // fill the machine 
    for (let i = 0; i < machineGumballs.length; i++) {
        let x = machineGumballs[i].x;
        let y = machineGumballs[i].y;
        let color = machineGumballs[i].color;
        fill(color);
        ellipse(x, y, gumballSize, gumballSize);
    }
}

function refillMachine() { // once an hour is up, refill
    machineGumballs = [];
    let gumballSize = 20;
    for (let i = 0; i < 60; i++) {
        let x, y;
        do {
            x = random(140, 260);
            y = random(140, 260);
        } while (!isInsideMachine(x, y, gumballSize));
        let color = random(colors);
        machineGumballs.push({ x, y, color });
    }
}

function isInsideMachine(x, y, size) { // make all the gumballs within mahcine perimeter
    let distance = dist(x, y, 200, 200);
    return distance + size / 2 <= 100;
}

function initializeGumballs(currentMinute) {
    refillMachine();
    for (let i = 0; i < currentMinute; i++) {
        plate.push({}); // for page reload purposes
                        // populate plate and machine
    }
    for (let i = 0; i < currentMinute; i++) {
        machineGumballs.pop();
    }
}

function drawPlate() {
    // draw teh bowl for the gumballs taken out
    fill(150);
    let cx = 450;
    let cy = 500;
    let radius = 100;
    arc(cx, cy, radius * 2, radius, 0, PI, PIE);
    
    // allocate the gumballs in the bowl, into rows of 6 
    let gumballSize = 20;
    let xStart = 400;
    let yStart = 500;
    let rowLimit = 6;
    let gap = 20;

    for (let i = 0; i < plate.length; i++) {
        let row = Math.floor(i / rowLimit);
        let col = i % rowLimit;
        let x = xStart + col * gap;
        let y = yStart - row * gap;
        if (!plate[i].color) {
            plate[i].color = random(colors);
        }
        fill(plate[i].color);
        ellipse(x, y, gumballSize, gumballSize);
    }
}

function drawPillar(sec) {
    //draw large pillar
    fill(200);
    triangle(machineX - 80, machineY + 300, machineX + 80, machineY + 300, machineX, machineY + 100);
    const pillarHeight = 150;
    const fillHeight = map(sec, 0, 60, 0, pillarHeight);
   
    // fill it with red 1/60th of the way every sec
    fill(100, 200, 255);
    rect(machineX - 60, machineY + 100, 120, pillarHeight);
   
    // re background of the pillar not filled with red
    fill(255, 0, 0);
    rect(machineX - 60, machineY + 100 + (pillarHeight - fillHeight), 120, fillHeight);
   
    //draw the spinny knob, and animate it (spins on the minute)
    fill(128);
    rect(machineX - 15, machineY + 110, 30, 50);
    ellipse(machineX, machineY + 115, 30, 30);
    push();
    translate(machineX, machineY + 145);
    if (spinActive) {
        let elapsedTime = millis() - spinStartTime;
        if (elapsedTime < spinDuration) {
            angle += (TWO_PI / spinDuration) * deltaTime * 2;
        } else {
            spinActive = false;
            angle = 0;
        }
    }
    rotate(angle);
    rect(-17, -5, 35, 10);
    pop();
}


function checkMinuteChange(minute) {
    if (minute !== previousMinute) {
        console.log('min:', minute); // log the minute
        previousMinute = minute;
        spinActive = true; 
        spinStartTime = millis(); // help reset time for spinner
        if (machineGumballs.length > 0) {
            let newGumball = machineGumballs.pop(); // dispense gumball 
            plate.push(newGumball);
        }
    }
}

function drawHourRing(hr) { // draw pizza pie 
    let cx = machineX + 360;
    let cy = machineY;
    let outerRadius = 130;
    let innerRadius = 110;
    let trayRadius = 140;
    let numHours = 12;
    let angleSlice = TWO_PI / numHours;
    fill(211, 211, 211);
    ellipse(cx, cy, trayRadius * 2, trayRadius * 2);
    let hourSlices = hr % 12; //account for army time 
    for (let i = 0; i < numHours; i++) { // make the number of slices= the hour
        let startAngle = i * angleSlice;
        let endAngle = startAngle + angleSlice;
        if (i < hourSlices) {
            fill(245, 225, 179);
            arc(cx, cy, outerRadius * 2, outerRadius * 2, startAngle, endAngle, PIE);
            fill(255, 170, 150);
            arc(cx, cy, innerRadius * 2, innerRadius * 2, startAngle, endAngle, PIE);
        }
    }
}
