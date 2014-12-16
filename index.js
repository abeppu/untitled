
/**
 * @name untitled
 */
var prev = [];
var max_entries = 10;

export function dsp(t) {
  var raw =  womp(t) * rising(t);
  prev.push(raw);
  var ret = average(prev);
  if (prev.length > max_entries) {
    arr.shift();
  }
  return ret;
}

function average(values) {
  var sum = 0;
  for(var i=0;i<values.length;i++) {
    sum += values[i];
  }
  return sum/values.length;
}

function smooth(y) {
  return Math.atan(y);
}

var tempo = 120.0; // bpm
var quaver = 60 / tempo;
var beatsPerMeter = 4;

var A1 = 440;

var halfstep = Math.pow(2, (1/12));



function womp(t) {
  var z = (t % quaver) / quaver;
  return Math.sqrt(0.5 * (1 + Math.cos(z * 2 * Math.PI)));
}

function rising(t) {
  var length = 2; // seconds
  var z = t % length;
  var freq;
  if(z > length / 2) {
    freq = 10 * Math.pow(halfstep, z);
  } else {
    freq = 10 * Math.pow(halfstep, length - z);
  }
  return atFreq(sine, freq)(t);
}

function evenStepMelody(steps) {
  var totalLength = steps.length * quaver;
  console.log("totalLength => " + totalLength);
  var fns = [];
  for (var i=0;i<steps.length;i++) {
    var freq = 220 * Math.pow(halfstep, steps[i]);
    fns[i] = atFreq(sine,freq);
  }
  return function(t) {
    var x = (t % totalLength)/quaver;
    var idx = Math.floor(x);
    var z = (x % quaver)/quaver;
    return (1 - Math.cos(z * 2 * Math.PI)) * fns[idx](t);
  };
}

function scale() {
  return evenStepMelody([0,2,4,5,7,9,11,12]);
}

function sine(z) {
  return Math.sin(z * Math.PI * 2);
}

function atFreq(f, hz) {
  return function(t) {
    var period = 1/hz;
    var x = t % period;
    var z = x / period;
    return f(z);
  };
}

function square(z) {
  if (z < 0.5) {
    return 1;
  } else {
    return 0;
  }
}

function saw(z) {
    return z;
}

function triangle(z) {
  if (z < 0.5) {
    return 2 * z;
  } else {
    return 2 - 2 * z;
  }
}
