import React from 'react';
import { Stage, Layer, Rect, Text, Circle, Image, Line, Group } from 'react-konva';
import * as math from 'mathjs';

function findPointfromAngle(x, y, angle, dist) {

    let x2 = x + dist * Math.cos(angle * Math.PI / 180.0);
    let y2 = y + dist * Math.sin(angle * Math.PI / 180.0);
    return [x2, y2];

}

function findAngle(p1, p2) {
    let point1 = p1;
    let point2 = p2;
    if (p1[0] > p2[0]) {
        point1 = p2;
        point2 = p1;
    }
    let angleDeg = Math.atan2(point2[1] - point1[1], point2[0] - point1[0]) * 180 / Math.PI;
    return angleDeg;
}

function findIntersection(line1a, line1b, line2a, line2b) {
    let inter = math.intersect(line1a, line1b, line2a, line2b);
    return [inter[0], inter[1]];
}

function dist(point1, point2) {
    let dst = math.distance(point1, point2);
    return dst;
}

class newLine extends React.Component {
    constructor(props) {
        super(props);

        let points = props.data.c;
        let data = this.returnData(points);

        this.state = {
            name: "",
            points: points,
            data: data,
            key: props.data.key,
            twist: findAngle([points[0].x, points[0].y], [points[1].x, points[1].y]),
            color: 'green',
            radius: 2,
            selectedPoint: 0,
        };
    }

    handleClick = (event, index) => {
        this.setState({
            selectedPoint: index,
        });
    };

    returnData = (points) => {
        let data = [points[0].x, points[0].y, points[1].x, points[1].y];
        return data;
    }

    returnCurve() {
        let selectedCurve = {
            c: this.state.points,
            twist: this.state.twist,
            key: this.state.key,
            edit: true,
        };
        return selectedCurve;
    }

    handleDrag = (event, index) => {
        let pnt = { ...this.state.points[index] };
        pnt.x = event.target.x();
        pnt.y = event.target.y();
        let pnts = [...this.state.points];
        pnts[index] = pnt;
        this.setState({
            points: pnts,
            data: this.returnData(pnts),
            twist: findAngle([pnts[0].x, pnts[0].y], [pnts[1].x, pnts[1].y]),
        });
    }

    handleDragEnd = (event, index) => {
        // Update the parent component with the new line data
        this.props.sailImage.updateLineData(this.returnCurve());
    }

    saveLine = () => {
        this.props.sailImage.saveLine(this.returnCurve());
    }

    cancelEdit = () => {
        this.props.sailImage.cancelLineEdit();
    }

    curveMouseOver = (event) => {
        this.props.sailImage.setState({ pointer: "move" });
    }

    curveMouseLeave = (event) => {
        this.props.sailImage.setState({ pointer: "default" });
    }

    render() {

        let points = null;
        let curve = null;

        points = (
            <Group>
                {this.state.points.map((point, index) => {
                    return <Circle
                        x={point.x}
                        y={point.y}
                        radius={this.state.radius}
                        strokeWidth={0.5}
                        fill={'red'}
                        stroke={'black'}
                        onMouseOver={this.curveMouseOver}
                        onMouseLeave={this.curveMouseLeave}
                        draggable
                        onDragMove={(event) => this.handleDrag(event, index)}
                        onDragEnd={(event) => this.handleDragEnd(event, index)}
                        key={`line-point-${index}`}
                    />
                })
                }
            </Group>
        );

        curve = (
            <Line
                points={this.state.data}
                stroke={'yellow'}
                strokeWidth={1}
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

export default newLine;
