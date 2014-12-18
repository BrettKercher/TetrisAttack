/*
 *
 *  This module was taken from Rhuno from wwww.rhuno.com
 *
 */

function ImageLoader()
{
    this.images = [];
    this.imagesLoaded = 0;
    this.isReady = false;

    this.addImage = function (src, name)
    {
        var img = new Image();
        img.loader = this;
        this.images.push( {image:img, source:src, imgName:name} );
    };

    this.loadImages = function()
    {
        for(var i = 0, len = this.images.length; i < len; i++)
        {
            this.images[i].image.src = this.images[i].source;
            this.images[i].image.onload = this.ImageLoaded;
            this.images[i].image.name = this.images[i].imgName;
        }
    };

    this.onImageLoaded = function()
    {
        this.loader.imagesLoaded++;
        this.loader.onProgressCallback();

        if(this.loader.imagesLoaded == this.loader.images.length)
        {
            this.loader.isReady = true;
            this.loader.onReadyCallback();
        }
    };

    this.getImageAtIndex = function(index) {
        return this.images[index].image;
    };

    this.getImageByName = function(name) {
        var img;

        for(var i = 0, len = this.images.length; i < len; i++)
        {
            if( this.images[i].imgName == name )
            {
                img = this.images[i].image;
                return img;
            }
        }
        throw new Error("No image found with specified name.");
    };

    this.onReadyCallback = function() {
        throw new Error("ImageLoader.onReadyCallback was not set.");
    };

    this.onProgressCallback = function() {
        var result;
        if(this.images.length > 0)
            result = this.imagesLoaded / this.images.length
        else
            result = 0;

        console.log(result);
        return result;
    };
}
