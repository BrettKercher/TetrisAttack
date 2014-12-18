/**
 * Created by Brett on 11/7/2014.
 *
 * Class for a block
 * Private Data Members:
 *  -Block Type
 *      -chosen randomly between 0 and NUM_BLOCKS - 1
 *  -x position
 *  -y position
 */

const NUM_BLOCKS = 5;

function block(x, y)
{
    this.block_type = Math.floor(Math.random() * ((NUM_BLOCKS-1) - 0)) + (NUM_BLOCKS-1);
    this.pos_x = x * 32;
    this.pos_y = y * 32;
}