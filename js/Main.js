/**
 * Created by Brett on 11/7/2014.
 */

/**
 * Constants
 */
var ROWS = 12;
const COLS = 6;
const BLK_SIZE = 32;
const GRID_W = 6 * BLK_SIZE;
const GRID_H = 12 * BLK_SIZE;

/**
 * Key Codes
 */
const LEFT = 37; //ARROW LEFT
const UP = 38; //ARROW UP
const RIGHT = 39; //ARROW RIGHT
const DOWN = 40; //ARROW DOWN
const SELECT = 90; //Z
const COMPARE = 112; //f1
const SCROLL = 88; //X

/**
 * Game flow variables
 */
var prevTime;
var curTime;
var isGameOver;
var board_ready;

/**
 * Game Data Variables
 */
var canvas;
var ctx;
var grid_data;
var next_data;
var cur_x;
var cur_y;
var offset;
var BlockState = Object.freeze({NORM: 0, FALL: 1, BREAK: 2});

/**
 * Block Object
 */
function block(y, x, type)
{
    this.block_type = type;
    this.pos_x = x * BLK_SIZE;
    this.pos_y = y * BLK_SIZE;
    this.state = BlockState.NORM;
}

/**
 * Image Variables
 */
var loader;
var block_img;
var cursor_img;

/**
 * Called when the window finishes loading
 * Sets up initial canvas/ctx and starts loading images
 */
window.onload = function()
{
    canvas = document.getElementById("game_canvas");
    ctx = canvas.getContext("2d");

    loader = new ImageLoader();
    loader.addImage("./img/blocks.png", "blocks");
    loader.addImage("./img/cursor.png", "cursor");
    loader.onReadyCallback = on_images_loaded();
    loader.loadImages();

    prevTime = curTime = new Date().getTime();
    offset = 0;

    document.onkeydown = handle_input;
};

/**
 * Called when the loader finishes loading our images
 * Store the loaded images in variables and initialize the game
 */
function on_images_loaded()
{
    block_img = loader.getImageByName("blocks");
    cursor_img = loader.getImageByName("cursor");
    init_game();
}

/**
 * Set initial game state
 * If this is the first time playing, create a new 2d array
 * Initialize the grid to empty
 */
function init_game()
{
    isGameOver = false;
    cur_y = ROWS / 2;
    cur_x = COLS / 2;

    board_ready = false;
    create_grid();

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
}

/*
 *
 */
function create_grid()
{
    var r, c;
    var temp_block;
    grid_data = [];

    for (r = 0; r < ROWS; r++)
    {
        grid_data[r] = [];
        for (c = 0; c < COLS; c++)
        {
            if(r >= 6)
            {
                temp_block = new block(r, c, Math.floor(Math.random() * 5) + 1);
                grid_data[r].push(temp_block);
            }
            else
            {
                grid_data[r].push(0);
            }
        }
    }
    initialize_board();
    requestAnimationFrame(update);
}

function initialize_board()
{
    var r, c, i, rr, rc;

    //Remove 6 random blocks to start, 3 of them from the same column
    for(i = 0; i < 4; i++)
    {
        rr = Math.floor(Math.random() * 6) + 6; //only rows 6-11 have blocks
        rc = Math.floor(Math.random() * 6);

        //Make sure we choose a unique block
        while( grid_data[rr][rc].state == BlockState.BREAK )
        {
            rr = Math.floor(Math.random() * 6) + 6; //only rows 6-11 have blocks
            rc = Math.floor(Math.random() * 6);
        }

        grid_data[rr][rc].state = BlockState.BREAK;

        //Remove 3 blocks from the same column on the first pass
        if (i == 0)
        {
            if(rr+1 < ROWS)
            {
                grid_data[rr + 1][rc].state = BlockState.BREAK;
                if(rr+2 < ROWS)
                {
                    grid_data[rr + 2][rc].state = BlockState.BREAK;
                }
                else
                {
                    grid_data[rr - 1][rc].state = BlockState.BREAK;
                }
            }
            else
            {
                grid_data[rr - 1][rc].state = BlockState.BREAK;
                if(rr-2 >= 0)
                {
                    grid_data[rr - 2][rc].state = BlockState.BREAK;
                }
                else
                {
                    grid_data[rr + 1][rc].state = BlockState.BREAK;
                }
            }
        }
    }


    //Remove all blocks in the BREAK state (only rows 6-11 have blocks)
    for(r = 6; r < ROWS; r++)
    {
        for(c = 0; c < COLS; c++)
        {
            if(grid_data[r][c].state == BlockState.BREAK)
            {
                if((r-1) >= 0 && grid_data[r-1][c] != 0)
                {
                    var i = r;
                    while( (i-1) >= 0 && grid_data[i-1][c] != 0 )
                    {
                        grid_data[i][c] = grid_data[i-1][c];
                        grid_data[i][c].pos_y += BLK_SIZE;
                        grid_data[i-1][c] = 0;
                        i--;
                    }
                }
                else
                    grid_data[r][c] = 0;
            }
        }
    }

    //Change any blocks that are 3 in a row
    for (r = 6; r < ROWS; r++)
    {
        for (c = 0; c < COLS; c++)
        {
            if (grid_data[r][c] == 0)
            {
                continue;
            }
            else
            {
                clear_initial_combos(r, c);
            }
        }
    }
}

/*
 * Checks for 3+ blocks in a row  both vertically and horizontally
 *  Upon finding a combo, change its middle block to a new type
 */
function clear_initial_combos(r, c)
{
    var i = r;
    var j = c;
    var count = 0;

    //Check vertical combos
    while(i < ROWS && grid_data[i][j].block_type == grid_data[r][c].block_type)
    {
        count++;
        i++;
    }
    if(count >= 3)
    {
        i = i - count + Math.floor(count/2);
        grid_data[i][j].block_type = ((grid_data[i][j].block_type + 1) % 6);
        if(grid_data[i][j].block_type == 0) grid_data[i][j].block_type++;

        if((j-1) >= 0 && (j+1) < COLS && grid_data[i][j] != 0 && grid_data[i][j-1] != 0
            && grid_data[i][j+1] != 0 && grid_data[i][j].block_type == grid_data[i][j-1].block_type
            && grid_data[i][j].block_type == grid_data[i][j+1].block_type)
        {
            grid_data[i][j].block_type = ((grid_data[i][j].block_type + 1) % 6);
            if(grid_data[i][j].block_type == 0) grid_data[i][j].block_type++;
        }
    }

    count = 0;
    i = r;

    //Check horizontal combos
    while(j < COLS && grid_data[i][j].block_type == grid_data[r][c].block_type)
    {
        count++;
        j++;
    }
    if(count >= 3)
    {
        j = j - count + Math.floor(count/2);
        grid_data[i][j].block_type = ((grid_data[i][j].block_type + 1) % 6);
        if(grid_data[i][j].block_type == 0) grid_data[i][j].block_type++;

        if((i-1) >= 0 && (i+1) < ROWS && grid_data[i][j] != 0 && grid_data[i-1][j] != 0
            && grid_data[i+1][j] != 0 && grid_data[i][j].block_type == grid_data[i-1][j].block_type
            && grid_data[i][j].block_type == grid_data[i+1][j].block_type)
        {
            grid_data[i][j].block_type = ((grid_data[i][j].block_type + 1) % 6);
            if(grid_data[i][j].block_type == 0) grid_data[i][j].block_type++;
        }
    }
}

function update()
{
    curTime = new Date().getTime();

    if(curTime - prevTime > 250)
    {
        offset++;
        if(offset == BLK_SIZE)
        {
            offset = 0;
            cur_y--;
            for(r = 0; r < ROWS; r++)
            {
                for(c = 0; c < COLS; c++)
                {
                    grid_data[r][c].pos_y -= BLK_SIZE;

                    if(r+1 < ROWS)
                    {
                        grid_data[r][c] = grid_data[r+1][c];

                    }
                    else
                    {
                        temp_block = new block(r, c, Math.floor(Math.random() * 5) + 1);
                        grid_data[r][c] = temp_block;
                    }
                }
            }
        }

        prevTime = curTime;
    }

    ctx.clearRect(0,0,GRID_W, GRID_H);
    draw_blocks();
    draw_cursor();

    if(!isGameOver)
    {
        requestAnimationFrame(update);
    }
    else
    {
        //draw game over
    }

}

function draw_blocks()
{
    //draw background image

    for(var r = 0; r < ROWS; r++)
    {
        for(var c = 0; c < COLS; c++)
        {
            if(grid_data[r][c] != 0)
            {
                ctx.drawImage(block_img, (grid_data[r][c].block_type - 1) * BLK_SIZE, 0, BLK_SIZE, BLK_SIZE, grid_data[r][c].pos_x, grid_data[r][c].pos_y - offset, BLK_SIZE, BLK_SIZE);
            }
        }
    }
}

function draw_cursor()
{
    ctx.drawImage(cursor_img, cur_x * BLK_SIZE, cur_y * BLK_SIZE - offset);
}

/**
 * Handles Input
 */
function handle_input(e)
{
    if(!e) { e  = window.event; }

    //ADD WHEN DONE PLS
    //e.preventDefault();

    if(!isGameOver)
    {
        switch(e.keyCode)
        {
            case UP:
                if(cur_y > 0)
                    cur_y -= 1;
                break;
            case LEFT:
                if(cur_x > 0)
                    cur_x -= 1;
                break;
            case DOWN:
                if(cur_y < (ROWS - 1))
                    cur_y += 1;
                break;
            case RIGHT:
                if(cur_x < (COLS - 2))
                cur_x += 1;
                break;
            case SELECT:
                //Swap blocks
                swap_blocks(cur_y, cur_x);
                break;
            case SCROLL:
                add_row();
                break;
        }
    }
    else
    {
        init_game();
    }
}

function swap_blocks(y, x)
{
    if(grid_data[y][x] == 0 && grid_data[y][x+1] == 0)
    {
        return;
    }
    else if(grid_data[y][x] == 0)
    {
        grid_data[y][x] = grid_data[y][x+1];
        grid_data[y][x].pos_x -= BLK_SIZE;

        grid_data[y][x+1] = 0;

        var did_fall = false;
        if((y+1) < ROWS && grid_data[y+1][x] == 0)
        {
            did_fall = true;
            fall(y, x);
        }
        if((y-1) >= 0 && grid_data[y-1][x+1] != 0)
        {
            did_fall = true;
            fall(y-1, x+1);
        }
        if(did_fall)
            check_all();
        else
            clear_combos(y, x);
    }
    else if(grid_data[y][x+1] == 0)
    {
        grid_data[y][x+1] = grid_data[y][x];
        grid_data[y][x+1].pos_x += BLK_SIZE;

        grid_data[y][x] = 0;

        var did_fall = false;
        if((y+1) < ROWS && grid_data[y+1][x+1] == 0)
        {
            did_fall = true;
            fall(y, x + 1);
        }
        if((y-1) >= 0 && grid_data[y-1][x] != 0)
        {
            did_fall = true;
            fall(y - 1, x);
        }

        if(did_fall)
            check_all();
        else
            clear_combos(y, x+1);
    }
    else
    {
        var temp = grid_data[y][x];

        grid_data[y][x] = grid_data[y][x+1];
        grid_data[y][x].pos_x -= BLK_SIZE;

        grid_data[y][x+1] = temp;
        grid_data[y][x+1].pos_x += BLK_SIZE;

        clear_combos(y, x);
        clear_combos(y, x+1);
    }
}

/*
 * Move the block at location y,x and all blocks above it down
 */
function fall(y, x)
{
    var i = y;
    var count = 0;
    //Go up the block stack until hitting a blank space
    while( grid_data[i][x] != 0)
    {
        grid_data[i][x].state = BlockState.FALL;
        count++;
        i--;
    }
    i+= count;
    while(count > 0)
    {
        while ((i + 1) < ROWS && grid_data[i + 1][x] == 0)
        {
            grid_data[i + 1][x] = grid_data[i][x];
            grid_data[i + 1][x].pos_y += BLK_SIZE;
            grid_data[i][x] = 0;
            i++;
        }
        count--;
        y--;
        i=y;
    }
}

//horizontal fall

function clear_combos(y, x)
{
    var i = y;
    var j = x;
    var count = 0;

    //Move i to the top most block in the potential combo
    while(i >= 0 && grid_data[i][j].block_type == grid_data[y][x].block_type)
    {
        i--;
    }
    i++;

    //Check vertical combos
    while(i < ROWS && grid_data[i][j].block_type == grid_data[y][x].block_type)
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
            grid_data[i][j].state = BlockState.BREAK;
            grid_data[i][j] = 0;
            count--;
            i++;
        }
        fall(top, j);
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
    while(j < COLS && grid_data[i][j].block_type == grid_data[y][x].block_type)
    {
        count++;
        j++;
    }
    if(count >= 3)
    {
        j -= count;
        while(count > 0)
        {
            grid_data[i][j].state = BlockState.BREAK;
            grid_data[i][j] = 0;
            count--;
            fall(y-1, j);
            j++;
        }
    }
}

function check_all()
{
    var r, c;
    for(r = 0; r < ROWS; r++)
    {
        for(c = 0; c < COLS; c++)
        {
            if(grid_data[r][c] != 0)
            {
                clear_combos(r, c);
            }
        }
    }
}

function add_row()
{
    var temp_block;
    var temp_row = [];

    for(var c = 0; c < COLS; c++)
    {
        temp_block = new block(ROWS, c, Math.floor(Math.random() * 5) + 1);
        temp_row.push(temp_block);
    }
    ROWS++;
    grid_data[ROWS-1] = temp_row;
}