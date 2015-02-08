/**
 * Created by Brett on 11/7/2014.
 */

//Key Codes
const LEFT = 37; //ARROW LEFT
const UP = 38; //ARROW UP
const RIGHT = 39; //ARROW RIGHT
const DOWN = 40; //ARROW DOWN
const SELECT = 90; //Z
const COMPARE = 112; //f1
const SCROLL = 88; //X

var loader;

/**
 * Program Entry Point
 */
require(["./Game", "./ImageLoader"], function(Game, ImageLoader)
{
    var canvas = document.getElementById("game_canvas");
    var ctx = canvas.getContext("2d");

    var game = new Game(ctx, canvas);

    loader = new ImageLoader();
    loader.addImage("img/blocks.png", "blocks");
    loader.addImage("img/cursor.png", "cursor");
    loader.onReadyCallback = game.init.bind(game);
    loader.loadImages();
});
