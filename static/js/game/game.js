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
            this.ctx                = _ctx;
            this.canvas             = _canvas;
            this.block_img          = null;
            this.cursor_img         = null;
            this.break_img          = null;

            //Game Data
            this.player             = new _board();
            this.score              = 0;
            this.scorePerBlock      = 10;
            this.scorePerLevel      = 50;

            //Game Flow
            this.prevTick           = new Date().getTime();
            this.prevTime           = new Date().getTime();
            this.curTime            = new Date().getTime();
            this.startTime          = new Date().getTime();
            this.isGameOver         = false;
            this.level              = 1;
            this.initialSpeed       = 1000;
            this.speedPerLevel      = 10;
            this.speedMultiplier    = 0;

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

            var elapsedTime = this.curTime - this.prevTime;

            if(this.curTime - this.prevTick > (this.initialSpeed - this.speedMultiplier))
            {
                this.player.Update();
                this.prevTick = this.curTime;
            }

            var broken_blocks = this.player.update_blocks();

            this.score += broken_blocks * this.scorePerBlock;

            if(this.score >= this.level * this.scorePerLevel) {
                this.level++;
                this.speedMultiplier += this.speedPerLevel;
                console.log(this.level);
            }

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

            this.prevTime = this.curTime;
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