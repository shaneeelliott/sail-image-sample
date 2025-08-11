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

function getCurveData(array, isNewCurve, save, centreline) {

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
        curve.controlPoints = result[1];
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

        let curve = getCurveData(props.data.c, true, false, centrelineTwist);

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
        console.log('Point clicked:', index);
        // Prevent event from bubbling up to the stage
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

    curveMouseOver = (event) => {
        // Prevent event from bubbling up to the stage
        event.evt.stopPropagation();
        this.props.sailImage.setState({ pointer: "move" });
    }

    curveMouseLeave = (event) => {
        // Prevent event from bubbling up to the stage
        event.evt.stopPropagation();
        this.props.sailImage.setState({ pointer: "default" });
    }

    render() {

        let points = null;
        let curve = null;

        points = (
            <Group>
                {this.state.data.map((point, index) => {
                    if (index === this.state.selectedPoint) {
                        return <Circle
                            x={point.x}
                            y={point.y}
                            radius={this.state.radius}
                            strokeWidth={0.5}
                            fill={'yellow'}
                            stroke={'black'}
                            onMouseOver={this.curveMouseOver}
                            onMouseLeave={this.curveMouseLeave}
                            onClick={(event) => this.handleClick(event, index)}
                            onMouseDown={(event) => event.evt.stopPropagation()}
                            draggable
                            onDragStart={(event) => this.handleDragStart(event, index)}
                            onDragMove={(event) => this.handleDrag(event, index)}
                            onDragEnd={(event) => this.handleDragEnd(event, index)}
                            name="curve-point"
                            key={`point-${index}`}
                        />
                    } else {
                        return <Circle
                            x={point.x}
                            y={point.y}
                            radius={this.state.radius}
                            fill={this.state.color}
                            stroke={'black'}
                            strokeWidth={0.5}
                            onMouseOver={this.curveMouseOver}
                            onMouseLeave={this.curveMouseLeave}
                            onClick={(event) => this.handleClick(event, index)}
                            onMouseDown={(event) => event.evt.stopPropagation()}
                            draggable
                            onDragStart={(event) => this.handleDragStart(event, index)}
                            onDragMove={(event) => this.handleDrag(event, index)}
                            onDragEnd={(event) => this.handleDragEnd(event, index)}
                            name="curve-point"
                            key={`point-${index}`}
                        />
                    }

                })
                }
            </Group>
        );

        curve = (
            <Line
                points={this.state.points}
                stroke={'red'}
                strokeWidth={0.5}
                ref={node => { this.ln = node; }}
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
