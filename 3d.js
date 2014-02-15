/*
	3d.js - This allows you to rotate an arbitary vectors in 3D space 		
*/

function Vector(referenceVector) { 
  if (referenceVector) {
    this.x = referenceVector.x
    this.y = referenceVector.y
    this.z = referenceVector.z
    this.w = referenceVector.w
  } else {
    this.x = 0
    this.y = 0
    this.z = 0
    this.w = 0
  }
}

Vector.prototype.x = 0.0
Vector.prototype.y = 0.0
Vector.prototype.z = 0.0
Vector.prototype.w = 0.0

Vector.prototype.length = function () {
  return Math.sqrt( this.x*this.x + this.y*this.y + this.z*this.z )
}

Vector.prototype.normalize = function() {
  //scales a vector back to a unit vector. It will have a length of 1
  var lengthval = this.length()
  if (lengthval != 0) {
    this.x /= lengthval;
    this.y /= lengthval;
    this.z /= lengthval; 
    return true 
  } else { 
    return false
  }
}

 Vector.prototype.angle = function(bvector) {
  //returns the Angle between two vectors. 0-2PI
  //we create some temporary vectors so we can normalize them savely
  var anorm = new Vector(this)  
  anorm.normalize()
  var bnorm = new Vector(bvector)
  bnorm.normalize()
  var dotval = vecdot(anorm,bnorm);
  return Math.acos(dotval);
}

Vector.prototype.cross = function(vectorB)
{
  var tempvec = new Vector(this) 
  tempvec.x = (this.y*vectorB.z) - (this.z*vectorB.y);
  tempvec.y = (this.z*vectorB.x) - (this.x*vectorB.z);
  tempvec.z = (this.x*vectorB.y) - (this.y*vectorB.x);
  this.x = tempvec.x
  this.y = tempvec.y
  this.z = tempvec.z
  this.w = tempvec.w
}

 Vector.prototype.QuaternionMultiply = function(vectorB) {
  var out = new Vector();
  out.w = this.w*vectorB.w - this.x*vectorB.x - this.y*vectorB.y - this.z*vectorB.z;
  out.x = this.w*vectorB.x + this.x*vectorB.w + this.y*vectorB.z - this.z*vectorB.y;
  out.y = this.w*vectorB.y - this.x*vectorB.z + this.y*vectorB.w + this.z*vectorB.x;
  out.z = this.w*vectorB.z + this.x*vectorB.y - this.y*vectorB.x + this.z*vectorB.w;
  this.x = out.x
  this.y = out.y
  this.z = out.z
  this.w = out.w
}

 Vector.prototype.rotate = function (inputaxis, inputangle) {
  
  var vector = new Vector(this)
  vector.w = 0

  var axis = new Vector({ 
    x: inputaxis.x * Math.sin(inputangle/2),     
    y: inputaxis.y * Math.sin(inputangle/2),     
    z: inputaxis.z * Math.sin(inputangle/2),     
    w: Math.cos(inputangle/2)} 
    )
  
  var axisInv = new Vector({ x: -axis.x, y: -axis.y, z: -axis.z, w: axis.w}  )
  
  axis.QuaternionMultiply(vector)
  axis.QuaternionMultiply(axisInv)

  this.x = axis.x
  this.y = axis.y
  this.z = axis.z
}

//** ############  end class  ###################### **//

function QuaternionMultiply(a , b) {
  var out = {};
  out.w = a.w*b.w - a.x*b.x - a.y*b.y - a.z*b.z;
  out.x = a.w*b.x + a.x*b.w + a.y*b.z - a.z*b.y;
  out.y = a.w*b.y - a.x*b.z + a.y*b.w + a.z*b.x;
  out.z = a.w*b.z + a.x*b.y - a.y*b.x + a.z*b.w;
  return out;
}


function rotate(inputvector, inputaxis, inputangle) {
  var axis = { 
  	x: inputaxis.x * Math.sin(inputangle/2), 
  	y: inputaxis.y * Math.sin(inputangle/2), 
  	z: inputaxis.z * Math.sin(inputangle/2), 
  	w: Math.cos(inputangle/2)
  }

  var vector = {
  	x: inputvector.x,
  	y: inputvector.y,
  	z: inputvector.z,
  	w: 0
  }

  var axisInv = { x: -axis.x, y: -axis.y, z: -axis.z, w: axis.w}  
  var vRot = QuaternionMultiply(axis, vector);
  var vRotb = QuaternionMultiply(vRot, axisInv);

  inputvector.x = vRotb.x
  inputvector.y = vRotb.y
  inputvector.z = vRotb.z
}

function vectorlength(v) {
  //returns the length of a line from 0,0,0 to vector V (x, y, z)
  return Math.sqrt( v.x*v.x + v.y*v.y + v.z*v.z )
}


function vecdot(a, b)
{
  //returns the total from multiplying two vectors together. dotproduct
  return a.x*b.x+a.y*b.y+a.z*b.z; 
}

function cross(out, a, b)
{
  out.x = (a.y*b.z) - (a.z*b.y);
  out.y = (a.z*b.x) - (a.x*b.z);
  out.z = (a.x*b.y) - (a.y*b.x);
}

function normalize(vector) {
  //scales a vector back to a unit vector. It will have a length of 1
  var lengthval = vectorlength(vector);
  if (lengthval != 0) {
    vector.x /= lengthval;
    vector.y /= lengthval;
    vector.z /= lengthval; 
    return true 
  } else { 
    return false
  }
}


function angle(a, b) {
  //returns the Angle between two vectors. 0-2PI
  var anorm = new Vector(a)  
  anorm.normalize()
  var bnorm = new Vector(b)
  bnorm.normalize()
  var dotval = vecdot(anorm,bnorm);
  return Math.acos(dotval);
}

/* ############################## TESTS ########################## */

var pointA = new Vector({ x: 1,  y: 0,  z: 0,  w: 0 })
var axisB = new Vector({  x: 0,  y: 0,  z: 1,  w: 0 })

var angleC = Math.PI/2;

//3d rotation
console.log("point")
console.log(pointA)

pointA.rotate(axisB, angleC);

console.log("point rotated:")
console.log(pointA)

//length and normalizing
console.log("vectorlength:"+ pointA.length() )
console.log("normalize:"+ pointA.normalize() )
console.log("vectorlength:"+ pointA.length() )

//angles
console.log("angle between A and B:"+ axisB.angle(pointA) )

//creating a new vector from an old one.
var vectorC = new Vector(pointA);
console.log(vectorC)