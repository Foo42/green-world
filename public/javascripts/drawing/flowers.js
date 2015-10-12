function drawFlower(context, options) {
    context.save();
    var radius = options.radius;
    var flowerColor = options.color;
    context.translate(options.position.x, options.position.y);
    context.beginPath();

    context.arc(0, 0 + radius, radius, 0, 2 * Math.PI, false);
    context.fillStyle = flowerColor;
    context.fill();

    context.beginPath();

    context.arc(0, 0 - radius, radius, 0, 2 * Math.PI, false);
    context.fillStyle = flowerColor;
    context.fill();

    context.beginPath();

    context.arc(0 + radius, 0, radius, 0, 2 * Math.PI, false);
    context.fillStyle = flowerColor;
    context.fill();

    context.beginPath();

    context.arc(0 - radius, 0, radius, 0, 2 * Math.PI, false);
    context.fillStyle = flowerColor;
    context.fill();

    context.beginPath();
    context.arc(0, 0, radius / 1.8, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
    context.restore();
}

function drawFlowerChunk(drawFlower, position, chunkSize, ctx) {
    function generateInitialState(position, chunkSize) {
        var state = {};

        var numberOfFlowers = Math.round(hashRandom(position.x, position.y, 'numberOfFlowers') * 3);
        state.flowers = [];
        for (var i = 0; i < numberOfFlowers; i++) {
            state.flowers.push(i);
        }
        state.flowers = state.flowers.map(function (flowerNumber) {
            var flower = {};
            var flowerSize = hashRandom(position.x, position.y, flowerNumber, 'flower size') * 10 + 5;

            var radius = flowerSize / 3;
            var baseFlowerColor = hashRandom(position.x, position.y, flowerNumber, 'flower color') > 0.98 ? '#FFFF00' : '#FF0000';
            // var colorOp = hashRandom(position.x, position.y, flowerNumber, 'lighten or darken') > 0.5 ? 'lighten' : 'darken';
            // var flowerColor = tinycolor(baseFlowerColor)[colorOp](hashRandom(position.x, position.y, flowerNumber, 'flower darken') * 30).toHexString();
            flowerColor = baseFlowerColor;

            flower.color = flowerColor;
            flower.radius = radius;
            flower.position = {
                x: hashRandom(position.x, position.y, flowerNumber, 'flower-x') * chunkSize,
                y: hashRandom(position.x, position.y, flowerNumber, 'flower-y') * chunkSize
            }
            return flower;
        });

        return state;
    }
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.strokeRect(0, 0, chunkSize, chunkSize);
    // ctx.translate(-chunkSize/2,-chunkSize/2)
    ctx.fillText('chunk: ' + position.x + ',' + position.y, chunkSize / 2, chunkSize / 2);
    ctx.restore();
    generateInitialState(position, chunkSize).flowers.forEach(function (flower) {
        drawFlower(ctx, flower);
    })
}

function makeFlowerChunk(position, chunkSize) {
    return {
        position: position,
        draw: drawFlowerChunk.bind(null, drawFlower, position, chunkSize)
    }
}

(function (exports) {
    exports.createFlowerArtist = function (chunker, screenDimensions) {
        return {
            draw: function (ctx, screenCoordinates) {
                var viewPort = {
                    centre: {
                        x: screenCoordinates.x + screenDimensions.gameWindowWidth / 2,
                        y: screenCoordinates.y + screenDimensions.height / 2,
                    },
                    size: {
                        height: screenDimensions.height,
                        width: screenDimensions.gameWindowWidth
                    }
                };

                var chunks = chunker.getVisibleChunks(viewPort, makeFlowerChunk, 400);

                ctx.save();
                ctx.translate(-screenCoordinates.x, -screenCoordinates.y);
                chunks.forEach(function (chunk) {
                    ctx.save();
                    ctx.translate(chunk.position.x, chunk.position.y);
                    chunk.draw(ctx);
                    ctx.restore();
                })
                ctx.restore();
            }
        }
    }
})(this);
