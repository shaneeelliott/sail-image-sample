import React from 'react';
import { Stage, Layer, Rect, Text, Circle, Image, Line, Group } from 'react-konva';
import * as math from 'mathjs';
import CalculateCurve from './CubicSpline/CalculateCurve'
import interpolator from 'natural-spline-interpolator';

function returnSpline(xyArray, resolution) {

    const xd = (xyArray[xyArray.length - 1][0] - xyArray[0][0]) / (resolution - 1);
    const start = xyArray[0][0];
    const length = xyArray[xyArray.length - 1][0];
    const f = interpolator(xyArray);
    let newArray = []
    for (let i = start; i < length; i += xd) {
        newArray.push([i, f(i)])
    }
    newArray.push([xyArray[xyArray.length - 1][0], xyArray[xyArray.length - 1][1]])
    return newArray;
}

function findPointfromAngle(x, y, angle, distance) {

    let x2 = x + distance * Math.cos(angle * Math.PI / 180.0);
    let y2 = y + distance * Math.sin(angle * Math.PI / 180.0);
    return [x2, y2];
}

function dist(point1, point2) {
    let dst = math.distance(point1, point2);
    return dst;
}

export function getCurveData(array, isNewCurve, save, centreline) {

    let curve = {
        name: "",
        pnts: [],
        controlPoints: 0,
        draft: 0,
        camber: 0,
        twist: 0,
        splinePoints: [],
    };

    let xyArray = [];
    let xarray = [];
    let yarray = [];

    let totaldistance = 0;

    let lastpoint = [array[0].x, array[0].y];

    {
        array.map((point) => {
            const p1 = lastpoint;
            const p2 = [point.x, point.y];
            totaldistance = totaldistance + dist(p1, p2);
            xyArray.push([point.x, point.y]);
            lastpoint = p2;
        })
    }

    const resolution = Math.floor(totaldistance * 5);

    let pnts = returnSpline(xyArray, resolution);
    curve.splinePoints = pnts;

    {
        pnts.map((point, index) => {
            xarray.push(point[0]);
            yarray.push(point[1]);
            curve.pnts.push(point[0]);
            curve.pnts.push(point[1]);
        })
    }


    let result = CalculateCurve(xarray, yarray, save, centreline);

    if (save) {
        curve.controlPoints = isNewCurve ? result[1] : array;
        curve.draftPoint = result[2];
        curve.draft = result[3];
        curve.camber = result[4];
        curve.twist = result[0];
        curve.frontPercent = result[5];
        curve.backPercent = result[6];
        curve.tan = result[7];
        curve.tanEnd = result[8];
        curve.EntryAngle = result[9];
        curve.ExitAngle = result[10];
        curve.key = xarray[0];
        curve.splinePoints = [];

    } else {

        curve.twist = result[0];

        if (isNewCurve) {
            curve.controlPoints = result[1];
        } else {
            curve.controlPoints = array;
        }
    }

    return curve;

}

class Curve extends React.Component {
    constructor(props) {
        super(props);

        const centrelineTwist = props.sailImage.state.centrelineTwist

        let curve = getCurveData(props.data.c, false, false, centrelineTwist);

        this.state = {
            name: "",
            data: curve.controlPoints,
            points: curve.pnts,
            key: props.data.key,
            twist: curve.twist,
            splinePoints: curve.splinePoints,
            centrelineTwist: centrelineTwist,
            color: 'green',
            radius: 1.5,
            selectedPoint: 0,
        };
    }

    handleClick = (event, index) => {
        event.evt.preventDefault();
        event.evt.stopPropagation();
        this.setState({
            selectedPoint: index,
        });
    };

    returnCurve() {
        let selectedCurve = {
            c: this.state.data,
            twist: this.state.twist,
            key: this.state.key,
            edit: true,
        };
        return selectedCurve;
    }

    handleDragStart = (event, index) => {
        // Prevent stage from starting to drag when we start dragging curve points
        event.evt.stopPropagation();
        // Disable stage dragging
        event.target.getStage().draggable(false);
    }

    handleDrag = (event, index) => {
        // Prevent event from bubbling up to the stage
        event.evt.stopPropagation();

        let pnt = { ...this.state.data[index] };
        pnt.x = event.target.x();
        pnt.y = event.target.y();
        let pnts = [...this.state.data];
        pnts[index] = pnt;
        let curve = getCurveData(pnts, false, false, this.state.centrelineTwist);
        this.setState({
            points: curve.pnts,
            data: curve.controlPoints,
            splinePoints: curve.splinePoints,
            twist: curve.twist,
        });
    }

    handleDragEnd = (event, index) => {
        // Re-enable stage dragging after curve point drag ends
        event.evt.stopPropagation();
        // Force the stage to be draggable again
        const stage = event.target.getStage();
        if (stage) {
            stage.draggable(true);
        }
    }

    saveCurve = () => {
        let curve = getCurveData(this.state.data, false, true, this.state.centrelineTwist);
        this.props.sailImage.saveCurve(curve);
    }

    cancelEdit = () => {
        this.props.sailImage.cancelCurveEdit();
    }

    pointMouseOver = (event) => {
        // Prevent event from bubbling up to the stage
        event.evt.stopPropagation();
        this.props.sailImage.setState({ pointer: "move" });
    }

    curveMouseOver = (event) => {
        // Prevent event from bubbling up to the stage
        event.evt.stopPropagation();
        this.props.sailImage.setState({ pointer: "cell" });
    }

    mouseLeave = (event) => {
        // Prevent event from bubbling up to the stage
        event.evt.stopPropagation();
        this.props.sailImage.setState({ pointer: "default" });
    }

    curveMouseDown = (event) => {
        // Prevent stage from starting to drag when we click on the curve
        event.evt.preventDefault();
        event.evt.stopPropagation();
        event.evt.stopImmediatePropagation();

        // Temporarily disable stage dragging to prevent it from starting
        const stage = event.target.getStage();
        if (stage) {
            stage.draggable(false);
        }
    }

    curveMouseUp = (event) => {
        // Re-enable stage dragging when mouse is released
        event.evt.preventDefault();
        event.evt.stopPropagation();

        const stage = event.target.getStage();
        if (stage) {
            stage.draggable(true);
        }
    }

    handleCurveRightClick = (event) => {
        // Prevent default context menu and stage dragging
        event.evt.preventDefault();
        event.evt.stopPropagation();
        event.evt.stopImmediatePropagation();

        const transform = this.props.sailImage.img.getAbsoluteTransform().copy();
        const stage = event.target.getStage();
        transform.invert();
        const pos = stage.getPointerPosition();
        const circlePos = transform.point(pos);

        let x = circlePos.x / this.props.sailImage.state.scale;
        let y = circlePos.y / this.props.sailImage.state.scale;

        let index = 0;
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].x > x) {
                index = i;
                break;
            }
        }
        // Insert the new control point
        this.insertControlPoint(x, y, index);
    }

    pointToLineDistance = (px, py, x1, y1, x2, y2) => {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;

        if (lenSq === 0) {
            return Math.sqrt(A * A + B * B);
        }

        let param = dot / lenSq;

        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    insertControlPoint = (x, y, index) => {
        const newPoint = { x: x, y: y };
        const newData = [...this.state.data];
        newData.splice(index, 0, newPoint);

        // Recalculate the curve with the new control point
        let curve = getCurveData(newData, false, false, this.state.centrelineTwist);

        this.setState({
            data: curve.controlPoints,
            points: curve.pnts,
            splinePoints: curve.splinePoints,
            twist: curve.twist,
        });
    }

    handleContextMenu = (event, index) => {
        event.evt.preventDefault();
        event.evt.stopPropagation();
        this.deletePoint(index);
    }

    deletePoint = (index) => {
        let newData = [...this.state.data];
        newData.splice(index, 1);
        let curve = getCurveData(newData, false, false, this.state.centrelineTwist);
        this.setState({
            data: curve.controlPoints,
            points: curve.pnts,
            splinePoints: curve.splinePoints,
            twist: curve.twist,
        });
    }

    render() {

        let points = null;
        let curve = null;
        let buffer = null;

        points = (
            <Group>
                {this.state.data.map((point, index) => {
                    return <Circle
                        x={point.x}
                        y={point.y}
                        radius={this.state.radius}
                        hitStrokeWidth={this.state.radius + 2.5}
                        strokeWidth={0.5}
                        fill={index === this.state.selectedPoint ? 'yellow' : 'green'}
                        stroke={'black'}
                        onMouseOver={this.pointMouseOver}
                        onMouseLeave={this.mouseLeave}
                        onClick={(event) => this.handleClick(event, index)}
                        onContextMenu={(event) => this.handleContextMenu(event, index)}
                        onMouseDown={(event) => event.evt.stopPropagation()}
                        draggable
                        onDragStart={(event) => this.handleDragStart(event, index)}
                        onDragMove={(event) => this.handleDrag(event, index)}
                        onDragEnd={(event) => this.handleDragEnd(event, index)}
                        name="curve-point"
                        key={`point-${index}`}
                    />
                })
                }
            </Group>
        );

        curve = (
            <Line
                points={this.state.points}
                stroke={'red'}
                strokeWidth={0.5}
                hitStrokeWidth={5}
                ref={node => { this.ln = node; }}
                onClick={this.handleCurveRightClick}
                onMouseOver={this.curveMouseOver}
                onMouseLeave={this.mouseLeave}
                onMouseDown={this.curveMouseDown}
                onMouseUp={this.curveMouseUp}
            />
        );

        return (
            <Group>
                {curve}
                {points}
            </Group>
        );
    }
}

export default Curve;
