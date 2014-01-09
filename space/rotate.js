/*
	This allows you to rotate an arbitary point in 3D space 
	around an arbitary axis by a specific angle.
	If angle == 2 * pi then its a full rotation 360 degrees.
*/

function QuaternionMultiply(a , b) {
  var out = {};
  out.w = a.w*b.w - a.x*b.x - a.y*b.y - a.z*b.z;
  out.x = a.w*b.x + a.x*b.w + a.y*b.z - a.z*b.y;
  out.y = a.w*b.y - a.x*b.z + a.y*b.w + a.z*b.x;
  out.z = a.w*b.z + a.x*b.y - a.y*b.x + a.z*b.w;
  return out;
}


function rotate(_vector, _axis, _angle) {
  
  var axis = { 
  	x: _axis.x * Math.sin(_angle/2), 
  	y: _axis.y * Math.sin(_angle/2), 
  	z: _axis.z * Math.sin(_angle/2), 
  	w: Math.cos(_angle/2)
  }

  var vector = {
  	x: _vector.x,
  	y: _vector.y,
  	z: _vector.z,
  	w: 0
  }

  var axisInv = { x: -axis.x, y: -axis.y, z: -axis.z, w: axis.w}  
  var vRot = QuaternionMultiply(axis, vector);
  var vRotb = QuaternionMultiply(vRot, axisInv);

  _vector.x = vRotb.x
  _vector.y = vRotb.y
  _vector.z = vRotb.z
}

/* ============================= TESTS ========= */

var pointA = {
  x: 0,
  y: 0,
  z: 1,
  w: 0
}

var axisB = {
  x: 0,
  y: 1,
  z: 0,
  w: 0
}

var angleC = Math.PI/2;

console.log("point")
console.log(pointA)
rotate(pointA, axisB, angleC);
console.log("point rotated:")
console.log(pointA)