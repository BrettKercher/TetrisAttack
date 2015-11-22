/**
 * Created by Brett on 2/7/2015.
 */

define([], function() {

        var Cursor = function(_x, _y)
        {
            this.x      = _x;
            this.y      = _y;
        };

//--------------------------------------------------------------------------------------------------------------------\\

        Cursor.prototype.Draw = function(ctx, img, blk_size, offset)
        {
            ctx.drawImage(img, this.x * blk_size, this.y * blk_size - offset);
        };

//--------------------------------------------------------------------------------------------------------------------\\


        return Cursor;
    }
);