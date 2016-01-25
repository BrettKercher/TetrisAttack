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

require.config({
    "baseUrl": "/static/js",
    "resUrl": "/static/res",
    "paths": {
        "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min",
        "images": "/static/res/img"
    }
});

/**
 * Program Entry Point
 */
// require(["jquery", "game/game", "game/image-loader"], function($, Game, ImageLoader)
// {
//     var canvas = $("#player_1_canvas")[0];
//     var ctx = canvas.getContext("2d");

//     var game = new Game(ctx, canvas);

//     loader = new ImageLoader();
//     loader.addImage("/static/res/img/blocks.png", "blocks");
//     loader.addImage("/static/res/img/cursor.png", "cursor");
//     loader.addImage("/static/res/img/breaking.png", "breaking");
//     loader.onReadyCallback = game.init.bind(game);
//     loader.loadImages();
// });

require(["jquery"], function($)
{
    var stage = new createjs.Stage("game-board")

    var block_sheet = new createjs.SpriteSheet({
        "images": ["/static/res/img/blocks.png"],
        "frames": {"width": 32, "height": 32, "regX": 0, "regY": 0, "count": 5}
    });

    var block_img = new createjs.Sprite(block_sheet);
    block_img.gotoAndStop(0);

    stage.addChild(block_img);

    stage.update();
});
