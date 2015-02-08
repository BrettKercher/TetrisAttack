/**
 * Created by Brett on 2/4/2015.
 */

define(["./Cursor", "./Block"], function(_cursor, _block) {

        //Create a constructor for a board object
        var Board = function()
        {
            //Board Data
            this.grid_data      = [];
            this.next_data      = [];
            this.offset         = 0;
            this.BlockState     = Object.freeze({NORM: 0, FALL: 1, BREAK: 2});

            //Board Constants
            this.ROWS           = 12; //distinguish between visible rows and actual rows
            this.COLS           = 6;
            this.BLK_SIZE       = 32;
            this.GRID_W         = this.COLS * this.BLK_SIZE;
            this.GRID_H         = this.ROWS * this.BLK_SIZE;

            //Board Objects
            this.cursor         = new _cursor(this.COLS / 2, this.ROWS / 2);
        };

//--------------------------------------------------------------------------------------------------------------------\\

        /**
         * Init() - initialize the game board
         *  start by randomly and completely filling the first 6 rows
         *  then remove 6 random blocks, at least 3 all from the same column
         *  finally, change the middle block of all existing combos
         */
        Board.prototype.init = function()
        {
            var r, c, rr, rc, i;
            var temp_block;

            //Populate first 6 rows randomly
            for (r = 0; r < this.ROWS; r++)
            {
                this.grid_data[r] = [];
                for (c = 0; c < this.COLS; c++)
                {
                    if(r >= 6)
                    {
                        temp_block = new _block(r, c, Math.floor(Math.random() * 5) + 1, this.BLK_SIZE);
                        this.grid_data[r].push(temp_block);
                    }
                    else
                    {
                        this.grid_data[r].push(0);
                    }
                }
            }

            //Set 6 random blocks to BREAK, 3 of them from the same column
            for(i = 0; i < 4; i++)
            {
                rr = Math.floor(Math.random() * 6) + 6; //only rows 6-11 have blocks
                rc = Math.floor(Math.random() * 6);

                //Make sure we choose a unique block
                while( this.grid_data[rr][rc].state == this.BlockState.BREAK )
                {
                    rr = Math.floor(Math.random() * 6) + 6; //only rows 6-11 have blocks
                    rc = Math.floor(Math.random() * 6);
                }

                this.grid_data[rr][rc].SetState(this.BlockState.BREAK);

                //Remove 3 blocks from the same column on the first pass
                if (i == 0)
                {
                    if(rr+1 < this.ROWS)
                    {
                        this.grid_data[rr + 1][rc].SetState(this.BlockState.BREAK);
                        if(rr+2 < this.ROWS)
                        {
                            this.grid_data[rr + 2][rc].SetState(this.BlockState.BREAK);
                        }
                        else
                        {
                            this.grid_data[rr - 1][rc].SetState(this.BlockState.BREAK);
                        }
                    }
                    else
                    {
                        this.grid_data[rr - 1][rc].SetState(this.BlockState.BREAK);
                        if(rr-2 >= 0)
                        {
                            this.grid_data[rr - 2][rc].SetState(this.BlockState.BREAK);
                        }
                        else
                        {
                            this.grid_data[rr + 1][rc].SetState(this.BlockState.BREAK);
                        }
                    }
                }
            }


            //Remove all blocks in the BREAK state (only rows 6-11 have blocks)
            for(r = 6; r < this.ROWS; r++)
            {
                for(c = 0; c < this.COLS; c++)
                {
                    if(this.grid_data[r][c].state == this.BlockState.BREAK)
                    {
                        if((r-1) >= 0 && this.grid_data[r-1][c] != 0)
                        {
                            i = r;
                            while( (i-1) >= 0 && this.grid_data[i-1][c] != 0 )
                            {
                                this.grid_data[i][c] = this.grid_data[i-1][c];
                                this.grid_data[i][c].pos_y += this.BLK_SIZE;
                                this.grid_data[i-1][c] = 0;
                                i--;
                            }
                        }
                        else
                            this.grid_data[r][c] = 0;
                    }
                }
            }

            //Change any blocks that are 3 in a row
            for (r = 6; r < this.ROWS; r++)
            {
                for (c = 0; c < this.COLS; c++)
                {
                    if (this.grid_data[r][c] == 0)
                    {
                        //continue;
                    }
                    else
                    {
                        this.clear_initial_combos(r, c);
                    }
                }
            }
        };

        /*
         * Checks for 3+ blocks in a row  both vertically and horizontally
         *  Upon finding a combo, change its middle block to a new type
         */
        Board.prototype.clear_initial_combos = function(r, c)
        {
            var i = r;
            var j = c;
            var count = 0;

            //Check vertical combos
            while(i < this.ROWS && this.grid_data[i][j].block_type == this.grid_data[r][c].block_type)
            {
                count++;
                i++;
            }
            if(count >= 3)
            {
                i = i - count + Math.floor(count/2);
                this.grid_data[i][j].block_type = ((this.grid_data[i][j].block_type + 1) % 6);
                if(this.grid_data[i][j].block_type == 0) this.grid_data[i][j].block_type++;

                if((j-1) >= 0 && (j+1) < this.COLS && this.grid_data[i][j] != 0 && this.grid_data[i][j-1] != 0
                    && this.grid_data[i][j+1] != 0 && this.grid_data[i][j].block_type == this.grid_data[i][j-1].block_type
                    && this.grid_data[i][j].block_type == this.grid_data[i][j+1].block_type)
                {
                    this.grid_data[i][j].block_type = ((this.grid_data[i][j].block_type + 1) % 6);
                    if(this.grid_data[i][j].block_type == 0) this.grid_data[i][j].block_type++;
                }
            }

            count = 0;
            i = r;

            //Check horizontal combos
            while(j < this.COLS && this.grid_data[i][j].block_type == this.grid_data[r][c].block_type)
            {
                count++;
                j++;
            }
            if(count >= 3)
            {
                j = j - count + Math.floor(count/2);
                this.grid_data[i][j].block_type = ((this.grid_data[i][j].block_type + 1) % 6);
                if(this.grid_data[i][j].block_type == 0) this.grid_data[i][j].block_type++;

                if((i-1) >= 0 && (i+1) < this.ROWS && this.grid_data[i][j] != 0 && this.grid_data[i-1][j] != 0
                    && this.grid_data[i+1][j] != 0 && this.grid_data[i][j].block_type == this.grid_data[i-1][j].block_type
                    && this.grid_data[i][j].block_type == this.grid_data[i+1][j].block_type)
                {
                    this.grid_data[i][j].block_type = ((this.grid_data[i][j].block_type + 1) % 6);
                    if(this.grid_data[i][j].block_type == 0) this.grid_data[i][j].block_type++;
                }
            }
        };

//--------------------------------------------------------------------------------------------------------------------\\

        Board.prototype.Update = function()
        {
            var r, c, temp_block;

            this.offset++;
            if(this.offset == this.BLK_SIZE)
            {
                this.offset = 0;
                this.cursor.y--;

                for(r = 0; r < this.ROWS; r++)
                {
                    for(c = 0; c < this.COLS; c++)
                    {
                        this.grid_data[r][c].pos_y -= this.BLK_SIZE;

                        if(r+1 < this.ROWS)
                        {
                            this.grid_data[r][c] = this.grid_data[r+1][c];

                        }
                        else
                        {
                            temp_block = new _block(r, c, Math.floor(Math.random() * 5) + 1, this.BLK_SIZE);
                            this.grid_data[r][c] = temp_block;
                        }
                    }
                }
            }
        };

//--------------------------------------------------------------------------------------------------------------------\\

        Board.prototype.add_row = function()
        {
            var temp_block;
            var temp_row = [];

            for(var c = 0; c < this.COLS; c++)
            {
                temp_block = new _block(this.ROWS, c, Math.floor(Math.random() * 5) + 1, this.BLK_SIZE);
                temp_row.push(temp_block);
            }
            this.ROWS++;
            this.grid_data[this.ROWS-1] = temp_row;
        };

//--------------------------------------------------------------------------------------------------------------------\\

        Board.prototype.Draw = function(ctx, block_img, cursor_img)
        {
            for(var r = 0; r < this.ROWS; r++)
            {
                for(var c = 0; c < this.COLS; c++)
                {
                    if(this.grid_data[r][c] != 0)
                    {
                        ctx.drawImage(block_img, (this.grid_data[r][c].block_type - 1) * this.BLK_SIZE, 0, this.BLK_SIZE,
                            this.BLK_SIZE, this.grid_data[r][c].pos_x, this.grid_data[r][c].pos_y - this.offset,
                            this.BLK_SIZE, this.BLK_SIZE);
                    }
                }
            }

            this.cursor.Draw(ctx, cursor_img, this.BLK_SIZE, this.offset);

        };

//--------------------------------------------------------------------------------------------------------------------\\

        Board.prototype.swap_blocks = function(y, x)
        {
            var did_fall = false;

            if(this.grid_data[y][x] == 0 && this.grid_data[y][x+1] == 0)
            {
                //Do nothing
            }
            else if(this.grid_data[y][x] == 0)
            {
                this.grid_data[y][x] = this.grid_data[y][x+1];
                this.grid_data[y][x].pos_x -= this.BLK_SIZE;

                this.grid_data[y][x+1] = 0;

                if((y+1) < this.ROWS && this.grid_data[y+1][x] == 0)
                {
                    did_fall = true;
                    this.fall(y, x);
                }
                if((y-1) >= 0 && this.grid_data[y-1][x+1] != 0)
                {
                    did_fall = true;
                    this.fall(y-1, x+1);
                }
                if(did_fall)
                    this.check_all();
                else
                    this.clear_combos(y, x);
            }
            else if(this.grid_data[y][x+1] == 0)
            {
                this.grid_data[y][x+1] = this.grid_data[y][x];
                this.grid_data[y][x+1].pos_x += this.BLK_SIZE;

                this.grid_data[y][x] = 0;

                if((y+1) < this.ROWS && this.grid_data[y+1][x+1] == 0)
                {
                    did_fall = true;
                    this.fall(y, x + 1);
                }
                if((y-1) >= 0 && this.grid_data[y-1][x] != 0)
                {
                    did_fall = true;
                    this.fall(y - 1, x);
                }

                if(did_fall)
                    this.check_all();
                else
                    this.clear_combos(y, x+1);
            }
            else
            {
                var temp = this.grid_data[y][x];

                this.grid_data[y][x] = this.grid_data[y][x+1];
                this.grid_data[y][x].pos_x -= this.BLK_SIZE;

                this.grid_data[y][x+1] = temp;
                this.grid_data[y][x+1].pos_x += this.BLK_SIZE;

                this.clear_combos(y, x);
                this.clear_combos(y, x+1);
            }
        };

//--------------------------------------------------------------------------------------------------------------------\\

        /*
         * Move the block at location y,x and all blocks above it down
         */
        Board.prototype.fall = function(y, x)
        {
            var i = y;
            var count = 0;
            //Go up the block stack until hitting a blank space
            while( this.grid_data[i][x] != 0)
            {
                this.grid_data[i][x].state = this.BlockState.FALL;
                count++;
                i--;
            }
            i+= count;
            while(count > 0)
            {
                while ((i + 1) < this.ROWS && this.grid_data[i + 1][x] == 0)
                {
                    this.grid_data[i + 1][x] = this.grid_data[i][x];
                    this.grid_data[i + 1][x].pos_y += this.BLK_SIZE;
                    this.grid_data[i][x] = 0;
                    i++;
                }
                count--;
                y--;
                i=y;
            }
        };

//--------------------------------------------------------------------------------------------------------------------\\

        Board.prototype.clear_combos = function(y, x)
        {
            var i = y;
            var j = x;
            var count = 0;
            var grid_data = this.grid_data;

            //Move i to the top most block in the potential combo
            while(i >= 0 && grid_data[i][j].block_type == grid_data[y][x].block_type)
            {
                i--;
            }
            i++;

            //Check vertical combos
            while(i < this.ROWS && grid_data[i][j].block_type == grid_data[y][x].block_type)
            {
                count++;
                i++;
            }
            if(count >= 3)
            {
                console.log(count);
                i -= count;
                var top = i - 1;
                while(count > 0)
                {
                    grid_data[i][j].state = this.BlockState.BREAK;
                    grid_data[i][j] = 0;
                    count--;
                    i++;
                }
                this.fall(top, j);
            }

            count = 0;
            i = y;

            //Move j to the left most block in the potential combo
            while(j >= 0 && grid_data[i][j].block_type == grid_data[y][x].block_type)
            {
                j--;
            }
            j++;

            //Check horizontal combos
            while(j < this.COLS && grid_data[i][j].block_type == grid_data[y][x].block_type)
            {
                count++;
                j++;
            }
            if(count >= 3)
            {
                j -= count;
                while(count > 0)
                {
                    grid_data[i][j].state = this.BlockState.BREAK;
                    grid_data[i][j] = 0;
                    count--;
                    this.fall(y-1, j);
                    j++;
                }
            }
        };

//--------------------------------------------------------------------------------------------------------------------\\

        Board.prototype.check_all = function()
        {
            var r, c;
            for(r = 0; r < this.ROWS; r++)
            {
                for(c = 0; c < this.COLS; c++)
                {
                    if(this.grid_data[r][c] != 0)
                    {
                        this.clear_combos(r, c);
                    }
                }
            }
        };

//--------------------------------------------------------------------------------------------------------------------\\

        return Board;
    }
);