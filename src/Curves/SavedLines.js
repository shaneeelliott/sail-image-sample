import React from 'react';
import { Circle, Line, Group } from 'react-konva';

class SavedLines extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: 'red',
      radius: 2,
    };
  }

  BtnClick = (event, index) => {
    this.props.editHandler(index);
  }

  returnData = (points) => {
    let data = [points[0].x, points[0].y, points[1].x, points[1].y];
    return data;
  }

  render() {

    let curves = [];

    const { newCurve } = this.props.parent.state;

    {
      this.props.data.map((curve, index) => {

        let luffPoint = curve.c[0];
        let leechPoint = curve.c[1];

        let c = (
          <Group>
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
              points={this.returnData(curve.c)}
              stroke={'red'}
              strokeWidth={1}
              ref={node => { this.ln = node; }}
              onMouseOver={newCurve ? null : this.props.mouseOver}
              onMouseLeave={newCurve ? null : this.props.mouseLeave}
            />
            <Line
              points={this.returnData(curve.c)}
              stroke={'red'}
              opacity={0.001}
              strokeWidth={12}
              onMouseOver={newCurve ? null : this.props.mouseOver}
              onMouseLeave={newCurve ? null : this.props.mouseLeave}
              onClick={newCurve ? null : (event) => this.BtnClick(event, index)}
            />
            <Circle
              x={luffPoint.x}
              y={luffPoint.y}
              radius={this.state.radius}
              fill={this.state.color}
              stroke={'black'}
              strokeWidth={0.5}
              onMouseOver={newCurve ? null : this.props.mouseOver}
              onMouseLeave={newCurve ? null : this.props.mouseLeave}
            />
            <Circle
              x={leechPoint.x}
              y={leechPoint.y}
              radius={this.state.radius}
              fill={this.state.color}
              stroke={'black'}
              strokeWidth={0.5}
              onMouseOver={newCurve ? null : this.props.mouseOver}
              onMouseLeave={newCurve ? null : this.props.mouseLeave}
            />

          </Group>
        );
        curves.push(c);

      })
    };



    return (
      <Group>
        {curves.map((curve, index) => (
          <Group key={`line-${index}`}>
            {curve}
          </Group>
        ))}
      </Group>
    );
  }
}

export default SavedLines