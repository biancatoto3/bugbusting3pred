// create custom blockly move forward block and generator stub
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks#blockly_block_definition
import * as Blockly from "blockly/core";

const moveRight = {
    type: "move_right",
    message0: "Move Right",
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "",
    helpUrl: "",
};
const moveDown ={
    type: "move_down",
    message0: "Move Down",
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "",
    helpUrl: "",
};
const moveUp ={
    type: "move_up",
    message0: "Move Up",
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "",
    helpUrl: "",
};
const moveLeft ={
    type: "move_left",
    message0: "Move Left",
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "",
    helpUrl: "",
};


export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    moveRight,moveDown, moveUp, moveLeft,
]);
