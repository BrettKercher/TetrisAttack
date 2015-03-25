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

        var Game = function(_ctx1, _canvas1, _ctx2, _canvas2)
        {
            this.ticks              = 0;
            this.startSeconds      = new Date().getTime();

            //Drawing
            this.ctx_1              = _ctx1;
            this.canvas_1           = _canvas1;
            this.ctx_2              = _ctx2;
            this.canvas_2           = _canvas2;
            this.block_img          = null;
            this.cursor_img         = null;
            this.break_img          = null;

            //Game Data
            this.player_1           = new _board();
            this.player_2           = new _board();

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

            this.player_1.update_blocks();
            this.player_2.update_blocks();

            this.ctx_1.clearRect(0,0,this.player_1.GRID_W, this.player_1.GRID_H);
            this.ctx_2.clearRect(0,0,this.player_1.GRID_W, this.player_1.GRID_H);
            this.player_1.Draw(this.ctx_1, this.block_img, this.cursor_img, this.break_img);
            this.player_2.Draw(this.ctx_2, this.block_img, this.cursor_img, this.break_img);

            if(!this.isGameOver)
            {
                this.ticks++;
                document.getElementsByTagName('p')[1].innerHTML = this.ticks / ((new Date().getTime() - this.startSeconds) / 1000);
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
                        if (c1.y < (this.player_1.ROWS - 1))
                        {
                            c1.y += 1;
                        }
                        break;
                    case PLAYER_ONE_RIGHT:
                        e.preventDefault();
                        if(c1.x < (this.player_1.COLS - 2))
                            c1.x += 1;
                        break;
                    case PLAYER_ONE_SELECT:
                        e.preventDefault();
                        this.player_1.swap_blocks(c1.y, c1.x);
                        break;
                    case PLAYER_ONE_SCROLL:
                        e.preventDefault();
                        this.player_1.add_row();
                        break;

                    //Player two controls
                    case PLAYER_TWO_UP:
                        e.preventDefault();
                        if (c2.y > 0)
                            c2.y -= 1;
                        break;
                    case PLAYER_TWO_LEFT:
                        e.preventDefault();
                        if (c2.x > 0)
                            c2.x -= 1;
                        break;
                    case PLAYER_TWO_DOWN:
                        e.preventDefault();
                        if (c2.y < (this.player_2.ROWS - 1))
                        {
                            c2.y += 1;
                        }
                        break;
                    case PLAYER_TWO_RIGHT:
                        e.preventDefault();
                        if(c2.x < (this.player_2.COLS - 2))
                            c2.x += 1;
                        break;
                    case PLAYER_TWO_SELECT:
                        e.preventDefault();
                        this.player_2.swap_blocks(c2.y, c2.x);
                        break;
                    case PLAYER_TWO_SCROLL:
                        e.preventDefault();
                        this.player_2.add_row();
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