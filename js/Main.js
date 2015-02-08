/**
 * Created by Brett on 11/7/2014.
 */

//Key Codes
const PLAYER_ONE_LEFT = 65; //A
const PLAYER_ONE_UP = 87; //W
const PLAYER_ONE_RIGHT = 68; //D
const PLAYER_ONE_DOWN = 83; //S
const PLAYER_ONE_SELECT = 70; //F
const PLAYER_ONE_SCROLL = 88; //E

const PLAYER_TWO_LEFT = 74; //J
const PLAYER_TWO_UP = 73; //I
const PLAYER_TWO_RIGHT = 76; //L
const PLAYER_TWO_DOWN = 75; //K
const PLAYER_TWO_SELECT = 72; //H
const PLAYER_TWO_SCROLL = 85; //U

var loader;

/**
 * Program Entry Point
 */
require(["./Game", "./ImageLoader"], function(Game, ImageLoader)
{
    var canvas_1 = document.getElementById("player_1_canvas");
    var ctx_1 = canvas_1.getContext("2d");

    var canvas_2 = document.getElementById("player_2_canvas");
    var ctx_2 = canvas_2.getContext("2d");

    var game = new Game(ctx_1, canvas_1, ctx_2, canvas_2);

    loader = new ImageLoader();
    loader.addImage("img/blocks.png", "blocks");
    loader.addImage("img/cursor.png", "cursor");
    loader.onReadyCallback = game.init.bind(game);
    loader.loadImages();
});
