
/**
 * @module womp womp
 * @name untitled
 */

export function smooth(y) {
  return 2.0 * Math.atan(y)/(Math.PI);
}


var tempo = 120.0; // bpm
var quaver = 60 / tempo;
var beatsPerMeter = 4;

var A1 = 440;

var halfstep = Math.pow(2, (1/12));

export function womp(length,t) {
  var z = (t % length) / length;
  return Math.sqrt(0.5 * (1 + Math.cos(z * 2 * Math.PI + Math.PI)));
}

export function note(start, length, steps) {
  var n = {};
  n.start = start;
  n.duration = length;
  var freq = 440 * Math.pow(halfstep, steps);
  n.freq = freq;
  return n;
}

export function pitchToSteps(pitchString) {
  var name = pitchString[0];
  var num = pitchString[pitchString.length - 1];
  var base = 440;
  var scale = {
    "C" : -9,
    "D" : -7,
    "E" : -5,
    "F" : -4,
    "G" : -2,
    "A" : 0,
    "B" : 2,
  };
  var offset = scale[name];
  if (pitchString.length == 3) {
      var modifier = pitchString[1];
      if (modifier == "#") {
        offset += 1;
      } else if(modifier == "b") {
        offset -= 1;
      }
  }
  if (num != 4) {
    offset += (num - 4) * 12;
  }
  return offset;
}


export function polyphonic(voice, notes, t) {
  var last = 0;
  for (var i = 0; i < notes.length; i++) {
    last = Math.max(last, notes[i].start + notes[i].duration);
  }
  var z = t % last;
  var sum = 0;
  for (i = 0; i < notes.length; i++) {
    var note = notes[i];
    if (z > note.start && z < (note.start + note.duration)) {
      sum += atFreq(voice, note.freq)(t);
    }
  }
  return smooth(sum);
}

function voiceFromName(name) {
  if (name == "sine") {
    return sine;
  } else if (name =="square") {
    return square;
  } else {
    console.log("cannot match name " + name);
  }
}


function maj3(t) {
  return polyphonic([vnote(0, 2 * quaver, "C4", "sine"), vnote(0, 2 * quaver,"f4", "sine"), vnote(0, 2* quaver, "G4", "square")],t);
}

function min3(t) {
  return polyphonic([vnote(0, 2 * quaver, "C4", sine), vnote(0, 2 * quaver, "Eb4", sine), vnote(0, 2* quaver, "G4", saw)],t);
}


function seven(t) {
  return polyphonic([lnote(0, 2 * quaver, -1), lnote(0, 2 * quaver, -5), lnote(0,2 * quaver, -7)], t);
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


function atFreq(f, hz) {
  return function(t) {
    var period = 1/hz;
    var x = t % period;
    var z = x / period;
    return f(z);
  };
}


/** Voices, take a value within a period, zero to 1**/
function ss(z) {
  return sine(z) - square(z);
}

function st(z) {
  return (saw(z) - triangle(z)) - sine(z);// * sine(z) - sine(z); 
}

export function sine(z) {
  return Math.sin(z * Math.PI * 2);
}

function noize(z) {
  return Math.random();
}

export function square(z) {
  if (z < 0.5) {
    return 1;
  } else {
    return 0;
  }
}

function saw(z) {
    return z;
}

export function triangle(z) {
  if (z < 0.5) {
    return 2 * z;
  } else {
    return 2 - 2 * z;
  }
}
