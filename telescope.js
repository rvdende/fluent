// calculates the lens dimensions for a parabolic reflector telescope

//config this:
var telescope = {
	focallength : 2000,
	mirrordiameter : 300
}

// run this:

// node telescope.js

// ################################################################# //

calclens = function (focallength, radius) {
	return radius*radius/4/focallength

}

for (var a = 0; a <= (telescope.mirrordiameter/2); a+=10) {
	console.log("r:"+a+" depth:"+calclens(telescope.focallength,a))
}



