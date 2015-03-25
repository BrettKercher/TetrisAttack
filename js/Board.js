/**
 * Created by Brett on 2/4/2015.
 */

define(["./Cursor", "./Block", "./RowLoader"], function(_cursor, _block, _loader)
{

    //Create a constructor for a board object
    var Board = function () {
        //Board Data
        this.grid_data = [];
        this.row_loader = new _loader();
        this.offset = 0;
        this.BlockState = Object.freeze({NORM: 0, FALL: 1, BREAK: 2, TO_BREAK: 3});

        //Board Constants
        this.ROWS = 12; //distinguish between visible rows and actual rows
        this.COLS = 6;
        this.BLK_SIZE = 32;
        this.GRID_W = this.COLS * this.BLK_SIZE;
        this.GRID_H = this.ROWS * this.BLK_SIZE;

        //Board Objects
        this.cursor = new _cursor(this.COLS / 2, this.ROWS / 2);
    };

    //--------------------------------------------------------------------------------------------------------------------\\

    /**
     * Init() - initialize the game board
     *  start by randomly and completely filling the first 6 rows
     *  then remove 6 random blocks, at least 3 all from the same column
     *  finally, change the middle block of all existing combos
     */
    Board.prototype.init = function () {
        var r, c, rr, rc, i;
        var temp_block;

        //Populate first 6 rows randomly
        for (r = 0; r < this.ROWS; r++) {
            this.grid_data[r] = [];
            for (c = 0; c < this.COLS; c++) {
                if (r >= 6) {
                    temp_block = new _block(r, c, Math.floor(Math.random() * 5) + 1, this.BLK_SIZE);
                    this.grid_data[r].push(temp_block);
                }
                else {
                    this.grid_data[r].push(0);
                }
            }
        }

        //Set 6 random blocks to BREAK, 3 of them from the same column
        for (i = 0; i < 4; i++) {
            rr = Math.floor(Math.random() * 6) + 6; //only rows 6-11 have blocks
            rc = Math.floor(Math.random() * 6);

            //Make sure we choose a unique block
            while (this.grid_data[rr][rc].state == this.BlockState.BREAK) {
                rr = Math.floor(Math.random() * 6) + 6; //only rows 6-11 have blocks
                rc = Math.floor(Math.random() * 6);
            }

            this.grid_data[rr][rc].SetState(this.BlockState.BREAK);

            //Remove 3 blocks from the same column on the first pass
            if (i == 0) {
                if (rr + 1 < this.ROWS) {
                    this.grid_data[rr + 1][rc].SetState(this.BlockState.BREAK);
                    if (rr + 2 < this.ROWS) {
                        this.grid_data[rr + 2][rc].SetState(this.BlockState.BREAK);
                    }
                    else {
                        this.grid_data[rr - 1][rc].SetState(this.BlockState.BREAK);
                    }
                }
                else {
                    this.grid_data[rr - 1][rc].SetState(this.BlockState.BREAK);
                    if (rr - 2 >= 0) {
                        this.grid_data[rr - 2][rc].SetState(this.BlockState.BREAK);
                    }
                    else {
                        this.grid_data[rr + 1][rc].SetState(this.BlockState.BREAK);
                    }
                }
            }
        }


        //Remove all blocks in the BREAK state (only rows 6-11 have blocks)
        for (r = 6; r < this.ROWS; r++) {
            for (c = 0; c < this.COLS; c++) {
                if (this.grid_data[r][c].state == this.BlockState.BREAK) {
                    if ((r - 1) >= 0 && this.grid_data[r - 1][c] != 0) {
                        i = r;
                        while ((i - 1) >= 0 && this.grid_data[i - 1][c] != 0) {
                            this.grid_data[i][c] = this.grid_data[i - 1][c];
                            this.grid_data[i][c].pos_y += this.BLK_SIZE;
                            this.grid_data[i - 1][c] = 0;
                            i--;
                        }
                    }
                    else
                        this.grid_data[r][c] = 0;
                }
            }
        }

        //Change any blocks that are 3 in a row
        for (r = 6; r < this.ROWS; r++) {
            for (c = 0; c < this.COLS; c++) {
                if (this.grid_data[r][c] == 0) {
                    //continue;
                }
                else {
                    this.clear_initial_combos(r, c);
                }
            }
        }
    };

    /*
     * Checks for 3+ blocks in a row  both vertically and horizontally
     *  Upon finding a combo, change its middle block to a new type
     */
    Board.prototype.clear_initial_combos = function (r, c) {
        var i = r;
        var j = c;
        var count = 0;

        //Check vertical combos
        while (i < this.ROWS && this.grid_data[i][j].block_type == this.grid_data[r][c].block_type) {
            count++;
            i++;
        }
        if (count >= 3) {
            i = i - count + Math.floor(count / 2);
            this.grid_data[i][j].block_type = ((this.grid_data[i][j].block_type + 1) % 6);
            if (this.grid_data[i][j].block_type == 0) this.grid_data[i][j].block_type++;

            if ((j - 1) >= 0 && (j + 1) < this.COLS && this.grid_data[i][j] != 0 && this.grid_data[i][j - 1] != 0
                && this.grid_data[i][j + 1] != 0 && this.grid_data[i][j].block_type == this.grid_data[i][j - 1].block_type
                && this.grid_data[i][j].block_type == this.grid_data[i][j + 1].block_type) {
                this.grid_data[i][j].block_type = ((this.grid_data[i][j].block_type + 1) % 6);
                if (this.grid_data[i][j].block_type == 0) this.grid_data[i][j].block_type++;
            }
        }

        count = 0;
        i = r;

        //Check horizontal combos
        while (j < this.COLS && this.grid_data[i][j].block_type == this.grid_data[r][c].block_type) {
            count++;
            j++;
        }
        if (count >= 3) {
            j = j - count + Math.floor(count / 2);
            this.grid_data[i][j].block_type = ((this.grid_data[i][j].block_type + 1) % 6);
            if (this.grid_data[i][j].block_type == 0) this.grid_data[i][j].block_type++;

            if ((i - 1) >= 0 && (i + 1) < this.ROWS && this.grid_data[i][j] != 0 && this.grid_data[i - 1][j] != 0
                && this.grid_data[i + 1][j] != 0 && this.grid_data[i][j].block_type == this.grid_data[i - 1][j].block_type
                && this.grid_data[i][j].block_type == this.grid_data[i + 1][j].block_type) {
                this.grid_data[i][j].block_type = ((this.grid_data[i][j].block_type + 1) % 6);
                if (this.grid_data[i][j].block_type == 0) this.grid_data[i][j].block_type++;
            }
        }
    };

    //--------------------------------------------------------------------------------------------------------------------\\

    Board.prototype.Update = function () {
        var r, c, temp_block;

        this.offset++;
        if (this.offset == this.BLK_SIZE)
        {
            this.offset = 0;
            this.cursor.y--;

            for (r = 0; r < this.ROWS; r++)
            {
                for (c = 0; c < this.COLS; c++)
                {
                    this.grid_data[r][c].pos_y -= this.BLK_SIZE;

                    if (r + 1 < this.ROWS)
                    {
                        this.grid_data[r][c] = this.grid_data[r + 1][c];
                    }
                    else
                    {
                        temp_block = new _block(r, c, Math.floor(Math.random() * 5) + 1, this.BLK_SIZE);
                        this.grid_data[r][c] = temp_block;
                        this.grid_data[r][c].can_break = true;
                    }
                }
            }
        }
    };

    //--------------------------------------------------------------------------------------------------------------------\\

    Board.prototype.update_blocks = function ()
    {
        var r, c;
        for (r = this.ROWS - 1; r >= 0; r--)
        {
            for (c = this.COLS - 1; c >= 0; c--)
            {
                var block = this.grid_data[r][c];
                if (block && block != -1) {
                    block.update();

                    switch (block.get_state())
                    {
                        case this.BlockState.NORM:
                            //Don't need to do anything
                            break;

                        case this.BlockState.FALL:
                                if (block.offset >= this.BLK_SIZE)
                                {
                                    block.pos_y += this.BLK_SIZE;
                                    block.offset = 0;
                                    this.grid_data[r + 1][c] = block;
                                    this.grid_data[r][c] = 0;

                                    if ((r + 2) < this.ROWS)
                                    {
                                        if (this.grid_data[r + 2][c] && this.grid_data[r + 2][c] != -1)
                                        {
                                            if(this.grid_data[r + 2][c].get_state() != this.BlockState.FALL)
                                            {
                                                this.grid_data[r + 1][c].SetState(this.BlockState.NORM);
                                                this.grid_data[r + 1][c].can_break = true;
                                            }
                                        }
                                        else
                                        {
                                            this.grid_data[r + 2][c] = -1;
                                        }
                                    }
                                    else
                                    {
                                        this.grid_data[r + 1][c].SetState(this.BlockState.NORM);
                                        this.grid_data[r + 1][c].can_break = true;
                                    }

                                }
                            break;

                        case this.BlockState.BREAK:
                                if(block.break_delay <= 0)
                                {
                                    var i = r - 1;
                                    this.grid_data[r][c].can_break = false;
                                    while (i >= 0 && this.grid_data[i][c] && this.grid_data[i][c] != -1) {
                                        if (this.grid_data[i][c].get_state() != this.BlockState.BREAK)
                                            this.grid_data[i][c].SetState(this.BlockState.FALL);
                                        i--;
                                    }
                                    this.grid_data[r][c] = 0;
                                }
                                else
                                {
                                    block.break_delay -= 1;
                                }
                            break;

                        case this.BlockState.TO_BREAK:

                            break;

                        default:
                            console.log("Unknown block state");
                            break;
                    }
                }

            }
        }
        this.check_matches();

    };

    //--------------------------------------------------------------------------------------------------------------------\\

    Board.prototype.add_row = function ()
    {
        var temp_block;
        var temp_row = [];

        for (var c = 0; c < this.COLS; c++)
        {
            temp_block = new _block(this.ROWS, c, Math.floor(Math.random() * 5) + 1, this.BLK_SIZE);
            temp_row.push(temp_block);
        }
        this.ROWS++;
        this.grid_data[this.ROWS - 1] = temp_row;
    };

    //--------------------------------------------------------------------------------------------------------------------\\

    Board.prototype.Draw = function (ctx, block_img, cursor_img, break_img)
    {
        for (var r = 0; r < this.ROWS; r++)
        {
            for (var c = 0; c < this.COLS; c++)
            {
                var block = this.grid_data[r][c];
                if (block != 0 && block != -1)
                {
                    if(block.get_state() != this.BlockState.BREAK)
                    {
                        ctx.drawImage(block_img, (block.block_type - 1) * this.BLK_SIZE, 0, this.BLK_SIZE,
                            this.BLK_SIZE, block.pos_x, (block.pos_y - this.offset + block.offset),
                            this.BLK_SIZE, this.BLK_SIZE);
                    }
                    else
                    {
                        ctx.drawImage(break_img, (block.block_type - 1) * this.BLK_SIZE, 0, this.BLK_SIZE,
                            this.BLK_SIZE, block.pos_x, (block.pos_y - this.offset + block.offset),
                            this.BLK_SIZE, this.BLK_SIZE);
                    }
                }
            }
        }

        this.cursor.Draw(ctx, cursor_img, this.BLK_SIZE, this.offset);

    };

    //--------------------------------------------------------------------------------------------------------------------\\

    Board.prototype.swap_blocks = function (y, x)
    {
        if ((this.grid_data[y][x] == 0 && this.grid_data[y][x + 1] == 0)
            || this.grid_data[y][x] == -1 || this.grid_data[y][x + 1] == -1
            || (this.grid_data[y][x] != 0 && this.grid_data[y][x].get_state() == this.BlockState.FALL)
            || (this.grid_data[y][x + 1] != 0 && this.grid_data[y][x + 1].get_state() == this.BlockState.FALL)
            || (this.grid_data[y][x] != 0 && this.grid_data[y][x].get_state() == this.BlockState.BREAK)
            || (this.grid_data[y][x + 1] != 0 && this.grid_data[y][x + 1].get_state() == this.BlockState.BREAK))
            return;

        var temp = this.grid_data[y][x];

        //Do the swap
        this.grid_data[y][x] = this.grid_data[y][x + 1];
        if (this.grid_data[y][x])
        {
            this.grid_data[y][x].pos_x -= this.BLK_SIZE;
            this.grid_data[y][x].can_break = true;
        }

        this.grid_data[y][x + 1] = temp;
        if (this.grid_data[y][x + 1])
        {
            this.grid_data[y][x + 1].pos_x += this.BLK_SIZE;
            this.grid_data[y][x + 1].can_break = true;
        }


        //Check for falling
        if (!this.grid_data[y][x + 1])
        {
            if (y+1 < this.ROWS && !this.grid_data[y + 1][x])
            {
                this.grid_data[y][x].SetState(this.BlockState.FALL);
                this.grid_data[y][x].can_break = false;
                this.grid_data[y + 1][x] = -1;
            }
            if (y-1 >= 0 && this.grid_data[y - 1][x + 1])
            {
                this.grid_data[y][x + 1] = -1;
                var i = y - 1;
                while (i >= 0 && this.grid_data[i][x + 1] && this.grid_data[i][x+1] != -1)
                {
                    this.grid_data[i--][x + 1].SetState(this.BlockState.FALL);
                }
            }
        }

        if (!this.grid_data[y][x])
        {
            if (y+1 < this.ROWS && !this.grid_data[y + 1][x + 1])
            {
                this.grid_data[y][x + 1].SetState(this.BlockState.FALL);
                this.grid_data[y][x + 1].can_break = false;
                this.grid_data[y + 1][x + 1] = -1;
            }
            if (y-1 >= 0 && this.grid_data[y - 1][x])
            {
                this.grid_data[y][x] = -1;
                var i = y - 1;
                while (i >= 0 && this.grid_data[i][x] && this.grid_data[i][x] != -1)
                {
                    this.grid_data[i--][x].SetState(this.BlockState.FALL);
                }
            }
        }
    };

    //--------------------------------------------------------------------------------------------------------------------\\

    Board.prototype.check_matches = function ()
    {
        var r, c;

        for(r = 0; r < this.ROWS; r++)
        {
            for(c = 0; c < this.COLS; c++)
            {
                if(this.grid_data[r][c] == null || this.grid_data[r][c] == -1 || !this.grid_data[r][c].can_break )
                {
                    continue;
                }

                var count = 0;
                var y = r;
                var x = c - 1;
                var i, j;

                //check for matches

                //go all the way left, check for horizontal matches
                while(x >= 0 && this.grid_data[y][x].state != this.BlockState.BREAK && this.grid_data[y][x].block_type == this.grid_data[r][c].block_type)
                    x--;

                j = x+1;
                while(j < this.COLS && this.grid_data[y][j].state != this.BlockState.BREAK && this.grid_data[y][j].block_type == this.grid_data[r][c].block_type)
                {
                    count++;
                    j++;
                }

                if(count >= 3)
                    while(--j > x)
                    {
                        this.grid_data[y][j].state = this.BlockState.TO_BREAK;
                    }

                //reset
                count = 0;
                y = r-1;
                x = c;

                //go all the way up, check for vertical matches
                while(y >= 0 && this.grid_data[y][x].state != this.BlockState.BREAK && this.grid_data[y][x].block_type == this.grid_data[r][c].block_type)
                    y--;

                i = y+1;
                while(i < this.ROWS && this.grid_data[i][x].state != this.BlockState.BREAK && this.grid_data[i][x].block_type == this.grid_data[r][c].block_type)
                {
                    count++;
                    i++;
                }

                if(count >= 3)
                    while(--i > y)
                    {
                        this.grid_data[i][x].state = this.BlockState.TO_BREAK;
                    }

                this.grid_data[r][c].can_break = false;
            }
        }

    };

    return Board;
});