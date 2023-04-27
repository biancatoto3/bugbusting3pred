import { javascriptGenerator } from "blockly/javascript";

export const generator_right = Object.create(null);
export const generator_left = Object.create(null);
export const generator_up = Object.create(null);
export const generator_down = Object.create(null);

generator_right["move_right"] = function (block) {
    return `moveRight();\nwaitForSeconds(1);\n`;
};
generator_left["move_left"] = function (block) {
    return `moveLeft();\nwaitForSeconds(1);\n`;
};
generator_up["move_up"] = function (block) {
    return `moveUp();\nwaitForSeconds(1);\n`;
};
generator_down["move_down"] = function (block) {
    return `moveDown();\nwaitForSeconds(1);\n`;
};

