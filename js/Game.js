/**
 * Created by Brett on 2/7/2015.
 */


/**
 * Define a constructor for a game object
 *
 * Dependencies:
 *  _board = a board constructor
 */
define(["./Board"], function(_board) {

        var Game = function(_ctx, _canvas)
        {
            //Drawing
            this.ctx            = _ctx;
            this.canvas         = _canvas;
            this.block_img      = null;
            this.cursor_img     = null;

            //Game Data
            this.player_1       = new _board();
            this.player_2       = new _board();

            //Game Flow
            this.prevTime       = new Date().getTime();
            this.curTime       = new Date().getTime();
            this.isGameOver     = false;

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

            this.player_1.init();
            this.player_2.init();

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
                this.player_1.Update();
                this.player_2.Update();
                this.prevTime = this.curTime;
            }

            this.ctx.clearRect(0,0,this.player_1.GRID_W, this.player_1.GRID_H);
            this.player_1.Draw(this.ctx, this.block_img, this.cursor_img);
            //this.player_2.Draw(this.ctx, this.block_img, this.cursor_img);

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

            var c1 = this.player_1.cursor;
            var c2 = this.player_2.cursor;

            if(!this.isGameOver)
            {
                switch(e.keyCode) {
                    case UP:
                        e.preventDefault();
                        if (c1.y > 0)
                            c1.y -= 1;
                        break;
                    case LEFT:
                        e.preventDefault();
                        if (c1.x > 0)
                            c1.x -= 1;
                        break;
                    case DOWN:
                        e.preventDefault();
                        if (c1.y < (this.player_1.ROWS - 1)) {
                            console.log("down");
                            c1.y += 1;
                        }
                        break;
                    case RIGHT:
                        e.preventDefault();
                        if(c1.x < (this.player_1.COLS - 2))
                            c1.x += 1;
                        break;
                    case SELECT:
                        e.preventDefault();
                        this.player_1.swap_blocks(c1.y, c1.x);
                        this.player_2.swap_blocks(c2.y, c2.x);
                        break;
                    case SCROLL:
                        e.preventDefault();
                        this.player_1.add_row();
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