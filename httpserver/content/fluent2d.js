function Fluent2D(context) {
    this.help = "fluentart.com"
    this.date = new Date();
    this.lastupdatetime = this.date.getTime();   
    this.fps = 1.0;
    this.setupcanvas();
    this.context = context;
    this.lastframe = this.date.getTime(); 
};

Fluent2D.prototype.setupcanvas = function () {
    window.requestAnimFrame = (function(callback){
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback){
            window.setTimeout(callback, 1000);
        };
    })();
}

Fluent2D.prototype.newframe = function() {
    var date = new Date();
    this.lastupdatetime = date.getTime();

    if (this.lastupdatetime < (this.lastframe + 1000) ) {
        return false;
    } 
    this.lastframe = this.lastupdatetime;
    return true;
}

Fluent2D.prototype.nextframe = function(draw, context) {
    requestAnimFrame(function(){
        draw(context);
    }); 
}
 
Fluent2D.prototype.line = function(x1, y1, x2, y2) {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
}

Fluent2D.prototype.circle = function(x, y, radius) {
    if (typeof x == "object") {
        this.context.beginPath();
        this.context.arc(x.x, x.y, x.r, 0, 2 * Math.PI, false);    
        this.context.stroke();
    } else {
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2 * Math.PI, false);    
        this.context.stroke();    
    }

    
}

Fluent2D.prototype.distance = function(x1, y1, x2, y2) {
    return Math.sqrt( Math.pow(x2-x1,2) + Math.pow(y2-y1, 2) )
}

Fluent2D.prototype.intersectCircles = function(circles) {
    var d = this.distance(circles[0].x, circles[0].y, circles[1].x, circles[1].y)
    if (d > (circles[0].r + circles[1].r)) {return "no solutions. seperate"}
    if (d < Math.abs(circles[0].r - circles[1].r)) {return "no solutions. contained"}
    if ((d == 0 ) && ( circles[0].r == circles[1].r )) { return "no solutions. equal"}

    return d;

}

Fluent2D.prototype.clearRect = function(x1, y1, x2, y2) {
    this.context.clearRect(x1,y1, x2, y2);
}

//##################################### OLD BELOW //

Fluent2D.prototype.updateScene = function (canvas, Scene){
        var maxVariance = 0.2;
        var SceneSpeed = 200; //px / s
        var segmentsPerSecond = SceneSpeed / Scene.segmentLength;
        var segments = Scene.segments;
        var date = new Date();
        var time = date.getTime();
        var timeDiff = (time - Scene.lastUpdateTime);
        if (timeDiff > 1000 / segmentsPerSecond) {
            var head = segments[segments.length - 1];
            var neck = segments[segments.length - 2];
     
            var direction = Scene.direction;
            var newHeadX = head.x + direction.x * Scene.segmentLength;
            var newHeadY = head.y + direction.y * Scene.segmentLength;
     
            // change direction if collision occurs
            if (newHeadX > canvas.width || newHeadX < 0) {
                direction.x *= -1;
            }
            if (newHeadY > canvas.height || newHeadY < 0) {
                direction.y *= -1;
            }
     
            // add new segment
            segments.push({
                x: newHeadX,
                y: newHeadY
            });
     
            if (segments.length > Scene.numSegments) {
                segments.shift();
            }
     
            var variance = ((maxVariance / 2) - Math.random() * maxVariance);
     
            direction.x += variance;
            direction.y -= variance;
     
            // update direction vector
            if (direction.x > 1) {
                direction.x = 1;
            }
            if (direction.x < -1) {
                direction.x = -1;
            }
     
            // dampering - try to keep direction vectors around -0.5 and +0.5
            direction.x *= Math.abs(direction.x) > 0.5 ? (1 - 0.01) : (1 + 0.01);
            direction.y *= Math.abs(direction.y) > 0.5 ? (1 - 0.01) : (1 + 0.01);
     
            Scene.lastUpdateTime = time;
        }
    }
     



   
     
    function drawScene(context, Scene){
        var segments = Scene.segments;
        var tail = segments[0];
        context.beginPath();
        context.moveTo(tail.x, tail.y);
     
        for (var n = 1; n < segments.length; n++) {
            var segment = segments[n];
            context.lineTo(segment.x, segment.y);
        }
     
        context.lineWidth = 10;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = "green";
        context.stroke();
    }

