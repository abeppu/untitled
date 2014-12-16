
/**
 * @name untitled
 */
var A = 440;

export function dsp(t) {
  var raw = backAndForth(t) * (0.8 + womp(3 * quaver/7,t));
  return smooth(raw);
}

function smooth(y) {
  return 2.0 * Math.atan(y)/(Math.PI);
}

var tempo = 120.0; // bpm
var quaver = 60 / tempo;
var beatsPerMeter = 4;

var A1 = 440;

var halfstep = Math.pow(2, (1/12));

function womp(length,t) {
  var z = (t % length) / length;
  return Math.sqrt(0.5 * (1 + Math.cos(z * 2 * Math.PI + Math.PI)));
}

function evenStepMelody(steps, t) {
  var l = quaver * steps.length;
  var z = Math.floor( (t % l)/quaver);
  var raw = womp(t) * atFreq(sine, 220 * Math.pow(halfstep, steps[z]))(t);
  return smooth(raw);
}

function variedMelody(notes, t) {
  var total = 0;
  for(var i=0;i<notes.length;i++) {
    total += notes[i]['duration'];
  }
  var z = t % total;
  var soFar = 0;
  var idx = 0;
  var freq = 0;
  for(i=0;i<notes.length;i++) {
    soFar += notes[i]['duration'];
    if (soFar > z) {
      freq = notes[i]['freq'];
      break;
    }
  }
  var raw = atFreq(sine, freq)(t);
  return smooth(raw);
}

function note(length, steps) {
  var freq = 440 * Math.pow(halfstep, steps);
  var obj = {};
  obj.duration = length;
  obj.freq = freq;
  return obj;
}

function lnote(start, length, steps) {
  var n = note(length, steps);
  n.start = start;
  return n;
}

function polyphonic(notes, t) {
  var last = 0;
  for(var i=0;i<notes.length;i++) {
    last = Math.max(last, notes[i].start + notes[i].duration);
  }
  var z = t % last;
  var sum = 0;
  for(i=0;i<notes.length;i++) {
    if (z > notes[i].start && z < (notes[i].start + notes[i].duration)) {
      sum += atFreq(st, notes[i].freq)(t);
    }
  }
  return smooth(sum);
}

function maj2(t) {
  return polyphonic([lnote(0, 2 * quaver, 0), lnote(0, 2 * quaver,-4), lnote(0, 2* quaver, -9)],t);
}

function min2(t) {
  return polyphonic([lnote(0, 2 * quaver, 0), lnote(0, 2 * quaver,-5), lnote(0, 2* quaver, -9)],t);
}

function seven(t) {
  return polyphonic([lnote(0, 2 * quaver, -1), lnote(0, 2 * quaver, -5), lnote(0,2 * quaver, -7)], t);
}

function backAndForth(t) {
  var z = t % 3;
  if (z > 1.5) {
    return maj2(t);
  } else {
    return min2(t);
  }
}

function m1(t) {
  return variedMelody([note(quaver/2, 1), note(quaver, 5), note(2 * quaver, 3)],t);//, note(quaver/2, 5), note(quaver,9)]);
}

function maj(t) {
  return variedMelody([note(quaver/2,0), note(quaver/2,4),note(quaver/2,7),note(quaver,12)], t);
}

function min(t) {
  return variedMelody([note(quaver/2,0), note(quaver/2,3),note(quaver/2,7), note(quaver,12)], t);
}

function scale(t) {
  return evenStepMelody([0,-8,4,5,7,9,11,12], t);
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

function ss(z) {
  return sine(z) - square(z);
}

function st(z) {
  return (saw(z) - triangle(z)) - sine(z);// * sine(z) - sine(z); 
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
