function init() {

    var gameScreen = $('#gameScreen');

    var canvas = document.getElementById('gameScreen');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');

    var gameScreenSize = {
        width: gameScreen.width(),
        height: gameScreen.height()
    };

    var outgoingEvents = createOutgoingEvents(gameScreenSize);

    var draw = createDraw(gameScreenSize);

    var collisionDetection = createCollisionDetection();

    var player = createPlayer(outgoingEvents);

    var update = createUpdate(player, outgoingEvents, collisionDetection, draw, gameScreenSize);

    var incomingEvents = createIncomingEventHandler();

    incomingEvents.registerEventHandlers(update);

    outgoingEvents.newPlayer({
        id: player.id,
        coordinates: player.coordinates
    });

    setInterval(function () {
        update.mainLoop(canvas, ctx)
    }, 1000 / 30);
    console.log('initialised');
}

window.onload = init;