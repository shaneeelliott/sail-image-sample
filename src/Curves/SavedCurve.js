import React from 'react';
import { Circle, Line, Group } from 'react-konva';

class SavedCurve extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: 'yellow',
      radius: 3,
    };
  }

  filterArray = (array) => {

    let x = array.filter((element, index) => {
      return index % 2 === 0;
    })
    let y = array.filter((element, index) => {
      return index % 2 != 0;
    })
    let x1 = x.filter((element, index) => {
      return index % 2 === 0;
    })
    let y1 = y.filter((element, index) => {
      return index % 2 === 0;
    })

    let xy = [];
    x1.map((curve, index) => {
      xy.push(x1[index]);
      xy.push(y1[index]);
    })
    return xy;
  }

  BtnClick = (event, index) => {
    this.props.editHandler(index);
  }

  render() {

    let curves = [];

    const { scale } = this.props.parent.state;

    const { newCurve } = this.props.parent.state;

    {
      this.props.data.map((curve, index) => {

        if (curve.pnts && curve.pnts.length === 0) {
          return;
        }

        let luffPoint = curve.controlPoints[0];
        let leechPoint = curve.controlPoints[(curve.controlPoints.length - 1)];
        let draftPoint = curve.draftPoint;
        //let points = this.filterArray(curve.pnts);

        let selectLine;

        if (this.props.editing) {
          selectLine = null;
        } else {
          selectLine = (
            <Line
              points={curve.pnts}
              stroke={'red'}
              opacity={0.001}
              strokeWidth={11}
              onMouseOver={newCurve ? null : this.props.mouseOver}
              onMouseLeave={newCurve ? null : this.props.mouseLeave}
              onClick={newCurve ? null : this.props.editing ? null : (event) => this.BtnClick(event, index)}
            />
          );
        }

        let c = (
          <Group>
            <Circle
              x={luffPoint.x}
              y={luffPoint.y}
              radius={this.state.radius}
              fill={this.state.color}
              stroke={'black'}
            />
            <Circle
              x={draftPoint.x}
              y={draftPoint.y}
              radius={this.state.radius}
              fill={this.state.color}
              stroke={'black'}
            />
            <Circle
              x={leechPoint.x}
              y={leechPoint.y}
              radius={this.state.radius}
              fill={this.state.color}
              stroke={'black'}
            />

            <Line
              points={curve.frontTangent}
              stroke={'blue'}
              strokeWidth={1}
            />
            <Line
              points={curve.backTangent}
              stroke={'blue'}
              strokeWidth={1}
            />
            <Line
              points={curve.pnts}
              stroke={'red'}
              strokeWidth={1}
              ref={node => { this.ln = node; }}
            />

            {selectLine}

          </Group>
        );
        curves.push(c);

      })
    };



    return (
      <Group>
        {curves.map((curve, index) => (
          <Group key={`curve-${index}`}>
            {curve}
          </Group>
        ))}
      </Group>
    );
  }
}

export default SavedCurve