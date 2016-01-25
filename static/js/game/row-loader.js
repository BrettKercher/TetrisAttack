/**
 * Created by Brett on 2/8/2015.
 */


define(["./queue", "./block"], function(Queue, _block) {

        var Loader = function(_board)
        {
            var board          = _board;
            var row_queue      = new Queue();

            //Populate the queue with 5 rows of blocks
            this.init = function()
            {
                var temp_block;

                for(var i = 0; i < 5; i++)
                {
                    temp_block = new _block(r, c, Math.floor(Math.random() * 5) + 1, this.BLK_SIZE);
                    row_queue.enqueue();
                }
            };

            //Pop the next row off the queue and enqueue a new row
            this.get_row = function()
            {

            };

        };


        return Loader;
    }
);