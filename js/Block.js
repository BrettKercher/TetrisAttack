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


define([], function() {

        var Block = function(y, x, type, size)
        {
            this.block_type     = type;
            this.pos_x          = x * size;
            this.pos_y          = y * size;
            this.state          = 0;
        };

//--------------------------------------------------------------------------------------------------------------------\\

        Block.prototype.SetState = function(_state)
        {
            this.state = _state;
        };

//--------------------------------------------------------------------------------------------------------------------\\

        return Block;
    }
);