
/**
 * test
 */
 import {smooth, womp, lnote, pitchToSteps,polyphonic} from './index';
 
 
var tempo = 120.0; // bpm
var quaver = 60 / tempo;

export function dsp(t) {
  var raw = backAndForth(t) * (0.9+ 0.5 * womp(3 * quaver/7,t));
  return smooth(raw);
}

function backAndForth(t) {
  var z = t % 3;
  if (z > 1.5) {
    return maj2(t);
  } else {
    return min2(t);
  }
}

function four(t) {
  return polyphonic
}

function maj2(t) {
  return polyphonic([lnote(0, 2 * quaver, pitchToSteps("A4")), lnote(0, 2 * quaver, -4), lnote(0, 2* quaver, -9)],t);
}

 function min2(t) {
  return polyphonic([lnote(0, 2 * quaver, 0), lnote(0, 2 * quaver, -5), lnote(0, 2* quaver, -9)],t);
}
