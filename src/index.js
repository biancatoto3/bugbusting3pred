/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly";
import { blocks } from "./blocks";
import { generator_down, generator_left, generator_right, generator_up } from "./blocks_generator";
import { javascriptGenerator } from "blockly/javascript";
import { toolbox } from "./toolbox";
import "./index.css";
import blueimg from "./assets/images/blue.png";
import busimg from "./assets/images/bus.jpeg";
import tvimg from "./assets/images/tv.jpeg";
import catimg from "./assets/images/cat.png";
import boneimg from "./assets/images/bone.jpeg";
import Interpreter from "js-interpreter";


// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator, generator_right);
Object.assign(javascriptGenerator, generator_down);
Object.assign(javascriptGenerator, generator_left);
Object.assign(javascriptGenerator, generator_up);

const grid = document.querySelector(".grid");
const blocklyDiv = document.getElementById("blocklyDiv");
const bluedogImage = document.getElementById("bluedogImage");
const busImage = document.getElementById("busImage");
const tvImage = document.getElementById("tvImage");
const catImage = document.getElementById("catImage");
const boneImage = document.getElementById("boneImage");
const runButton = document.querySelector("#runButton");
const resetButton = document.querySelector("#resetButton");
const stepButton = document.querySelector("#stepButton");

var xml = '<xml>' +
'<block type="move_down" id="move_down" x="0" y="0"></block>' +
'<block type="move_down" id="move_right" x="0" y="40"></block>' +
'<block type="move_right" id="move_up" x="0" y="80"></block>' +
'<block type="move_right" id="move_right" x="0" y="120"></block>' +
'<block type="move_right" id="move_right" x="0" y="160"></block>' +
'</xml>';

var ws= Blockly.inject('blocklyDiv',{
    toolbox: toolbox,
    scrollbars: false,
    horizontalLayout: true,
    toolboxPosition: "end",
    trashcan: true
});
var xmlDom = Blockly.Xml.textToDom(xml);
Blockly.Xml.domToWorkspace(xmlDom, ws);



let myInterpreter = null;
let runnerPid = 0;
let counter=1;

function initInterpreterWaitForSeconds(interpreter, globalObject) {
    // Ensure function name does not conflict with variable names.
    
        javascriptGenerator.addReservedWords("waitForSeconds");

        const wrapper = interpreter.createAsyncFunction(function (
            timeInSeconds,
            callback
        ) {
            // Delay the call to the callback.
            setTimeout(callback, timeInSeconds * 1000);
        });
        interpreter.setProperty(globalObject, "waitForSeconds", wrapper);
    
}
function callCounter(){
    alert("Running Step: "+ counter);
    counter++;
}
function initStepApi(interpreter, globalObject) {
    let wrapper;
    wrapper = function () {
        callCounter();
        return moveRight();
    };
    wrap("moveRight");
    wrapper = function () {
        callCounter();
        return moveLeft();
    };
    wrap("moveLeft");
    wrapper = function () {
        callCounter();
        return moveUp();
    };
    wrap("moveUp");
    wrapper = function () {
        callCounter();
        return moveDown();
    };
    wrap("moveDown");

    function wrap(name){
        interpreter.setProperty(globalObject, name,
            interpreter.createNativeFunction(wrapper));
    }
    

    const wrapperAlert = function alert(text) {
        text = arguments.length ? text : "";
        outputArea.value += "\n" + text;
    };
    interpreter.setProperty(
        globalObject,
        "alert",
        interpreter.createNativeFunction(wrapperAlert)
    );
    
    
    
    initInterpreterWaitForSeconds(interpreter, globalObject);
}
   

function initApi(interpreter, globalObject) {
    let wrapper;
    wrapper = function () {
        return moveRight();
    };
    wrap("moveRight");
    wrapper = function () {
        return moveLeft();
    };
    wrap("moveLeft");
    wrapper = function () {
        return moveUp();
    };
    wrap("moveUp");
    wrapper = function () {
        return moveDown();
    };
    wrap("moveDown");

    function wrap(name){
        interpreter.setProperty(globalObject, name,
            interpreter.createNativeFunction(wrapper));
    }
    

    const wrapperAlert = function alert(text) {
        text = arguments.length ? text : "";
        outputArea.value += "\n" + text;
    };
    interpreter.setProperty(
        globalObject,
        "alert",
        interpreter.createNativeFunction(wrapperAlert)
    );

    // Add an API for the wait block.  See wait_block.js
    initInterpreterWaitForSeconds(interpreter, globalObject);
}


function resetStepUi() {
    clearTimeout(runnerPid);
    runButton.disabled = "";
    stepButton.disabled = "";
    myInterpreter = null;
    
}



function runCode() {
    resetState();
    if (!myInterpreter) {
        // First statement of this code.
        // Clear the program output.
        resetStepUi();
        const latestCode = javascriptGenerator.workspaceToCode(ws);
        runButton.disabled = "disabled";

        // And then show generated code in an alert.
        // In a timeout to allow the outputArea.value to reset first.
        setTimeout(function () {
            // Begin execution
            myInterpreter = new Interpreter(latestCode, initApi);
            function runner() {
                if (myInterpreter) {
                    const hasMore = myInterpreter.run();
                    if (hasMore) {
                        // Execution is currently blocked by some async call.
                        // Try again later.
                        runnerPid = setTimeout(runner, 10);
                    } else {
                        // Program is complete.
                        checkGoalReached();
                    }
                }
            }
            runner();
        }, 1);
        return;
    }
}
function runStep() {
    resetState();
    if (!myInterpreter) {
        // First statement of this code.
        // Clear the program output.
        resetStepUi();
        
        const latestCode = javascriptGenerator.workspaceToCode(ws);
        console.log(ws)
        console.log(latestCode)
        stepButton.disabled = "disabled";
        
        // And then show generated code in an alert.
        // In a timeout to allow the outputArea.value to reset first.
        
        setTimeout(function () {
            // Begin execution
            
            myInterpreter = new Interpreter(latestCode, initStepApi);
            
            function runner() {
                if (myInterpreter) {
                    
                    const hasMore = myInterpreter.step();
                    
                    
                    console.log("step point")
                    if (hasMore) {
                        // Execution is currently blocked by some async call.
                        // Try again later.
                        
                        runnerPid = setTimeout(runner, 100);
                        
                    } else {
                        // Program is complete.
                        
                        checkGoalReached();
                    }
                    
                }
            }
            runner();
            
            
        }, 1);
        counter=1;
        return;
    }
}
//create a function to run the code step by step when the step button is clicked
/*function getNextBlock(){
    var topBlocks = ws.getTopBlocks(true);
    for (var i = 0; i < topBlocks.length; i++) {
        if (topBlocks[i].isDeletable() && !topBlocks[i].isCollapsed()) {
            var next = topBlocks[i].getNextBlock();
            if (next) {
                return next;
            }
        }
    }
    return null;
}*/



const START_STATE = { x: 0, y: 0 };
const GOAL_STATE = { x: 3, y: 1 };
const TV_STATE = { x: 0, y: 1 };
const CAT_STATE = { x: 1, y: 2 };
const BONE_STATE = { x: 2, y: 0 };
let current_state = { ...START_STATE };
let inErrorState = false;

const ROWS = 4;
const COLS = 4;

function initImages() {
    bluedogImage.src = blueimg;
    busImage.src = busimg;
    tvImage.src = tvimg;
    catImage.src = catimg;
    boneImage.src = boneimg;
}

function initButtons() {
    runButton.addEventListener("click", runCode);
    resetButton.addEventListener("click", resetState);
    stepButton.addEventListener("click", runStep);
}

function drawGrid() {
    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            var cell = document.createElement("div");
            cell.id = "cell" + i + "_" + j;
            cell.className = "cell";

            grid.appendChild(cell);
        }
    }
}

function moveImage(state, imgElement) {
    const cell = document.getElementById("cell" + state.x + "_" + state.y);
    const cellRect = cell.getBoundingClientRect();
    const imageRect = imgElement.getBoundingClientRect();
    const x = cellRect.left + cellRect.width / 2 - imageRect.width / 2;
    const y = cellRect.top + cellRect.height / 2 - imageRect.height / 2;
    imgElement.style.transform = `translate(${x}px, ${y}px)`;
}

function resetState() {
    current_state = { ...START_STATE };

    moveImage(START_STATE, bluedogImage);
    moveImage(GOAL_STATE, busImage);
    moveImage(TV_STATE, tvImage);
    moveImage(CAT_STATE, catImage);
    moveImage(BONE_STATE, boneImage);

    resetStepUi();
    inErrorState = false;
    grid.classList.remove("error");
}

function moveRight() {
    if (inErrorState) return;

    if (current_state.y < COLS - 1) {
        current_state.y++;
        moveImage(current_state, bluedogImage);
        if ((current_state.x === TV_STATE.x && current_state.y === TV_STATE.y) || (current_state.x === CAT_STATE.x && current_state.y === CAT_STATE.y) || (current_state.x === BONE_STATE.x && current_state.y === BONE_STATE.y)) {
            inErrorState=true;
            grid.classList.add("error");
            alert("You got distracted! Please try again");
        }
    } else {
        inErrorState = true;
        grid.classList.add("error");
        alert("uh oh! You have gone too far! Please try again.");
    }
}
function moveLeft(){
    if (inErrorState) return;

    if (current_state.y > 0) {
        current_state.y--;
        moveImage(current_state, bluedogImage);
        if ((current_state.x === TV_STATE.x && current_state.y === TV_STATE.y) || (current_state.x === CAT_STATE.x && current_state.y === CAT_STATE.y) || (current_state.x === BONE_STATE.x && current_state.y === BONE_STATE.y)) {
            inErrorState=true;
            grid.classList.add("error");
            alert("You got distracted! Please try again");
        }
    } else {
        inErrorState = true;
        grid.classList.add("error");
        alert("uh oh! You have gone too far! Please try again.");
    }
}
function moveUp(){
    if (inErrorState) return;

    if (current_state.x > 0) {
        current_state.x--;
        moveImage(current_state, bluedogImage);
        if ((current_state.x === TV_STATE.x && current_state.y === TV_STATE.y) || (current_state.x === CAT_STATE.x && current_state.y === CAT_STATE.y) || (current_state.x === BONE_STATE.x && current_state.y === BONE_STATE.y)) {
            inErrorState=true;
            grid.classList.add("error");
            alert("You got distracted! Please try again");
        }
    } else {
        inErrorState = true;
        grid.classList.add("error");
        alert("uh oh! You have gone too far! Please try again.");
    }
}
function moveDown(){
    if (inErrorState) return;
    if (current_state.x < ROWS - 1) {
        current_state.x++;
        moveImage(current_state, bluedogImage);
        if ((current_state.x === TV_STATE.x && current_state.y === TV_STATE.y) || (current_state.x === CAT_STATE.x && current_state.y === CAT_STATE.y) || (current_state.x === BONE_STATE.x && current_state.y === BONE_STATE.y)) { 
            inErrorState=true;
            grid.classList.add("error");
            alert("You got distracted! Please try again");
        }
    } else {
        inErrorState = true;
        grid.classList.add("error");
        alert("uh oh! You have gone too far! Please try again.");
    }
}

function checkGoalReached() {
    if (inErrorState) return;

    if (current_state.x === GOAL_STATE.x && current_state.y === GOAL_STATE.y) {
        alert("You have reached the goal!");
    } else {
        alert("You have not reached the goal. Please try again.");
    }
}

initImages();
initButtons();
drawGrid();
resetState();

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (e.isUiEvent) return;
    //save(ws);
});

// Whenever the workspace changes meaningfully, run the code again.
ws.addChangeListener((e) => {
    // Don't run the code when the workspace finishes loading; we're
    // already running it once when the application starts.
    // Don't run the code during drags; we might have invalid state.
    if (
        e.isUiEvent ||
        e.type == Blockly.Events.FINISHED_LOADING ||
        ws.isDragging()
    ) {
        return;
    }
});
