
import * as math from 'mathjs';



function findPointfromAngle(x, y, angle, distance) {

  let x2 = x + distance * Math.cos(angle * Math.PI / 180.0);
  let y2 = y + distance * Math.sin(angle * Math.PI / 180.0);
  return [x2, y2];
}

function findAngle(p1, p2) {
  let angleDeg = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI;
  return angleDeg;
}

function findIntersection(line1a, line1b, line2a, line2b) {
  let intersect = math.intersect(line1a, line1b, line2a, line2b);
  return [intersect[0], intersect[1]];
}

function distance(point1, point2) {
  let dst = math.distance(point1, point2);
  return dst;
}

function tangent(x1, y1, x2, y2) {
  let angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  let [x3, y3] = findPointfromAngle(x1, y1, (angle), 50);
  let [x0, y0] = findPointfromAngle(x1, y1, (angle + 180), 50);
  let tan = [x0, y0, x3, y3];
  return tan;
}


const CalculateCurve = (xarray, yarray, save, centreline) => {

  let searching = true;
  let xnew = [...xarray];
  let ynew = [...yarray];

  const start = [xarray[0], yarray[0]];
  const end = [xarray[xarray.length - 1], yarray[yarray.length - 1]];

  const line2x1 = start[0];
  const line2y1 = start[1]
  const line2x2 = end[0]
  const line2y2 = end[1]

  let twist = 0;
  let centrelineAngle = centreline;

  try {
    twist = findAngle(start, end);
  }
  catch (err) {
    twist = 0;
  }

  let centreLineTwist = twist - centrelineAngle
  //twist = twist - centrelineAngle;

  let n = 0;
  let camber = 0;
  let draft = 0;
  let chords = [];
  let line3s = []
  let controlpoints = [];
  const sections = [6, 13, 24, 35, 50, 75];
  let section = 0;
  let draftPoint = [];
  let camberLength = 0;
  let frontCambers = [];
  let backCambers = [];

  let p1 = {
    x: start[0],
    y: start[1]
  };
  controlpoints.push(p1);
  line3s.push([[start[0], start[1]], [start[0], start[1]]]);

  {
    xnew.map((a, index) => {
      let line1x1 = a
      let line1y1 = ynew[n]
      let [line1x2, line1y2] = findPointfromAngle(line1x1, line1y1, (270 + twist), 500);
      let line1 = [[line1x1, line1y1], [line1x2, line1y2]];
      let line2 = [[line2x1, line2y1], [line2x2, line2y2]];
      let [line3x2, line3y2] = findIntersection(line1[0], line1[1], line2[0], line2[1]);
      let line3 = [[line1x1, line1y1], [line3x2, line3y2]];
      let chord = distance([line2x1, line2y1], [line2x2, line2y2]);
      let c = distance([line1x1, line1y1], [line3x2, line3y2]);
      let tempCamber = (c / chord);
      let tempdraft = ((distance([line2x1, line2y1], [line3x2, line3y2])) / chord) * 100
      chords.push({ draft: tempdraft, camber: c });
      if (Math.round(tempdraft) == sections[section]) {
        let p2 = {
          x: line1x1,
          y: line1y1
        };
        controlpoints.push(p2);
        line3s.push(line3);
        section = section + 1;
      }
      if (tempCamber > camber && searching) {
        camber = tempCamber;
        camberLength = c;
        draft = tempdraft;
        draftPoint = { x: line1x1, y: line1y1 };
      }
      n = n + 1
    })
  }
  line3s.push([[end[0], end[1]], [end[0], end[1]]]);
  controlpoints.push({ x: end[0], y: end[1] });

  //return ['draft = ', draft ,'camber = ', camber,'twist = ', twist, line3s, controlpoints, draftPoint];

  if (!save) {
    return [centreLineTwist, controlpoints, draftPoint];
  } else {

    /*
    tan = self.draw_tangent(xnew[0],ynew[0],xnew[1],ynew[1])
    try:
        EnA = math.degrees((math.atan2(tan[3]-tan[1], tan[2]-tan[0])))
    except ZeroDivisionError as error:
        EnA = 0
    EntryAngle = (twist - EnA) * -1
    */

    let tan = tangent(xnew[0], ynew[0], xnew[1], ynew[1]);
    let EnA = (Math.atan2(tan[3] - tan[1], tan[2] - tan[0])) * 180 / Math.PI;
    let EntryAngle = (twist - EnA) * -1;

    /*
    tanEnd = self.draw_tangent(xnew[-1],ynew[-1],xnew[-2],ynew[-2])
    try:
        ExA = math.degrees((math.atan2(tanEnd[1]-tanEnd[3], tanEnd[0]-tanEnd[2])))
    except ZeroDivisionError as error:
        ExA = 0
    ExitAngle = ExA - twist
    */

    let tanEnd = tangent(xnew[xnew.length - 1], ynew[ynew.length - 1], xnew[xnew.length - 2], ynew[ynew.length - 2]);
    let ExA = (Math.atan2(tanEnd[1] - tanEnd[3], tanEnd[0] - tanEnd[2])) * 180 / Math.PI;
    //let ExitAngle = 180 -(ExA - twist);
    let ExitAngle = ExA - twist;

    let c = distance([xnew[0], ynew[0]], [xnew[xnew.length - 1], ynew[ynew.length - 1]]);
    let frontchord = c * (draft / 100);
    let backchord = c - frontchord;
    let midfront = Math.round(draft / 2);
    let midback = Math.round(((100 - draft) / 2) + draft);
    let frontPercent = 0;
    let backPercent = 0;
    {
      chords.map((chord, index) => {
        if (Math.round(chord.draft) == midfront) {
          let frontCamber = chord.camber;
          frontCambers.push(frontCamber);
          frontPercent = (frontCamber / camberLength) * 100;
        }
        if (Math.round(chord.draft) == midback) {
          let backCamber = chord.camber;
          backCambers.push(backCamber);
        }
      })
    }

    frontPercent = (frontCambers[Math.round(frontCambers.length / 2)] / camberLength) * 100;
    backPercent = (backCambers[Math.round(backCambers.length / 2)] / camberLength) * 100;

    return [centreLineTwist, controlpoints, draftPoint, draft, camber, frontPercent, backPercent, tan, tanEnd, EntryAngle, ExitAngle];

  }






















};

export default CalculateCurve