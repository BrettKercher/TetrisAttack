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
            this.FALL_SPEED     = 8;
            this.BlockState     = Object.freeze({NORM: 0, FALL: 1, BREAK: 2, TO_BREAK: 3});
            this.block_type     = type;
            this.pos_x          = x * size;
            this.pos_y          = y * size;
            this.offset         = 0;
            this.state          = 0;
            this.can_break      = false;
            this.break_delay    = 0;
            this.max_delay      = 50;
        };

//--------------------------------------------------------------------------------------------------------------------\\

        Block.prototype.SetState = function(_state)
        {
            this.state = _state;
        };

//--------------------------------------------------------------------------------------------------------------------\\

        Block.prototype.get_state = function()
        {
            return this.state;
        };

//--------------------------------------------------------------------------------------------------------------------\\

        Block.prototype.setBreakDelay = function(d)
        {
            this.break_delay = d;
        };

//--------------------------------------------------------------------------------------------------------------------\\

        Block.prototype.update = function()
        {
            switch(this.state)
            {
                case this.BlockState.NORM:
                    //Don't need to do anything
                    break;

                case this.BlockState.FALL:
                        this.offset+=this.FALL_SPEED;
                        break;

                case this.BlockState.BREAK:

                    break;

                case this.BlockState.TO_BREAK:
                    this.break_delay = this.max_delay;
                    this.state = this.BlockState.BREAK;
                    break;

                default:
                    console.log("Unknown block state");
                    break;
            }
        };

//--------------------------------------------------------------------------------------------------------------------\\

        return Block;
    }
);