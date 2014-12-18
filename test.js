
/**
 * test
 */
 import {smooth, womp, note, sine, square, triangle, pitchToSteps,polyphonic} from './index';
 
 
var tempo = 120.0; // bpm
var quaver = 60 / tempo;

export function dsp(t) {
  return  (5 * base(t) + chorus(t)) * ( womp(quaver/4,t));
}

function backAndForth(t) {
  var z = t % 3;
  if (z > 1.5) {
    return maj2(t);
  } else {
    return min2(t);
  }
}

function base(t) {
  var line = [note(0, quaver/2, pitchToSteps("C2")),
  note(quaver/2, quaver/2, pitchToSteps("Eb2")),
  note(quaver, quaver/2, pitchToSteps("G2")),
  note(3*quaver/2, quaver/2, pitchToSteps("C3"))];
  return polyphonic(sine, line, t)
}

function chorus(t) {
  var line = [note(quaver/4, quaver/4, pitchToSteps("G3")),
              note(7 * quaver/4, quaver/4, pitchToSteps("G3")),
              note(15 * quaver/4, quaver/4, pitchToSteps("G2"))];
  return polyphonic(triangle, line, t);
}

function maj2(t) {
  return polyphonic(sine, [note(0, 2 * quaver, pitchToSteps("A4")), 
                    note(0, 2 * quaver, -4), 
                    note(0, 2* quaver, -9)],t);
}

 function min2(t) {
  return polyphonic(square, [note(0, 2 * quaver, 0), note(0, 2 * quaver, -5), note(0, 2* quaver, -9)],t);
}
