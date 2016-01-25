/**
 * Created by Brett on 2/7/2015.
 */


/**
 * Define a constructor for a game object
 *
 * Dependencies:
 *  _board = a board constructor
 */
define(["jquery", "./board"], function($, _board) {

        var Game = function(_ctx, _canvas)
        {
            //Drawing
            this.ctx              = _ctx;
            this.canvas           = _canvas;
            this.block_img          = null;
            this.cursor_img         = null;
            this.break_img          = null;

            //Game Data
            this.player           = new _board();

            //Game Flow
            this.prevTime           = new Date().getTime();
            this.curTime            = new Date().getTime();
            this.isGameOver         = false;

            document.onkeydown = this.handle_input.bind(this);

        };

//--------------------------------------------------------------------------------------------------------------------\\

        /**
         * Set initial game state - loader must have finished before this is called
         * Initializes images and boards
         */
        Game.prototype.init = function()
        {
            this.block_img = loader.getImageByName("blocks");
            this.cursor_img = loader.getImageByName("cursor");
            this.break_img = loader.getImageByName("breaking");

            this.player.init();

            window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

            requestAnimationFrame(this.Update.bind(this));
        };

//--------------------------------------------------------------------------------------------------------------------\\

        /**
         *
         */
        Game.prototype.Update = function()
        {
            this.curTime = new Date().getTime();

            if(this.curTime - this.prevTime > 250)
            {
                this.player.Update();
                this.prevTime = this.curTime;
            }

            this.player.update_blocks();

            this.ctx.clearRect(0,0,this.player.GRID_W, this.player.GRID_H);
            this.player.Draw(this.ctx, this.block_img, this.cursor_img, this.break_img);

            if(!this.isGameOver)
            {
                requestAnimationFrame(this.Update.bind(this));
            }
            else
            {
                //draw game over
            }
        };

//--------------------------------------------------------------------------------------------------------------------\\

        /**
         *
         */
        Game.prototype.handle_input = function(e)
        {
            if(!e) { e  = window.event; }

            var c1 = this.player.cursor;

            if(!this.isGameOver)
            {
                switch(e.keyCode)
                {
                    //Player One controls
                    case PLAYER_ONE_UP:
                        e.preventDefault();
                        if (c1.y > 0)
                            c1.y -= 1;
                        break;
                    case PLAYER_ONE_LEFT:
                        e.preventDefault();
                        if (c1.x > 0)
                            c1.x -= 1;
                        break;
                    case PLAYER_ONE_DOWN:
                        e.preventDefault();
                        if (c1.y < (this.player.ROWS - 1))
                        {
                            c1.y += 1;
                        }
                        break;
                    case PLAYER_ONE_RIGHT:
                        e.preventDefault();
                        if(c1.x < (this.player.COLS - 2))
                            c1.x += 1;
                        break;
                    case PLAYER_ONE_SELECT:
                        e.preventDefault();
                        this.player.swap_blocks(c1.y, c1.x);
                        break;
                    case PLAYER_ONE_SCROLL:
                        e.preventDefault();
                        this.player.add_row();
                        break;
                    default:
                        break;
                }
            }
            else
            {

            }
        };

//--------------------------------------------------------------------------------------------------------------------\\


        return Game;
    }
);