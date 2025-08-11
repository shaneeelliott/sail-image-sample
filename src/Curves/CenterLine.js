import React from 'react';
import { Circle, Line, Group } from 'react-konva';

class CentreLine extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      color: 'red',
      radius: 2,
    };
  } 

  BtnClick = (event) =>{
    this.props.editHandler();
  }

  returnData = (points) =>{
    let data = [points[0].x, points[0].y, points[1].x, points[1].y];
    return data;
  }

  render() {

    let c;

    if(this.props.curve){

      let luffPoint = this.props.curve.c[0];
      let leechPoint = this.props.curve.c[1];

       c = (
        <Group>
            <Line
              points = {this.returnData(this.props.curve.c)}
              stroke = {'blue'}
              strokeWidth = {1}
              ref={node => {this.ln = node;}}
              onMouseOver={this.props.mouseOver}
              onMouseLeave={this.props.mouseLeave}
            />
            <Line
              points = {this.returnData(this.props.curve.c)}
              stroke = {'blue'}
              opacity = {0.001}
              strokeWidth = {12}
              onMouseOver={this.props.mouseOver}
              onMouseLeave={this.props.mouseLeave}
              onClick={(event) => this.BtnClick(event)}
            />
                        <Circle
              x = {luffPoint.x}
              y = {luffPoint.y}
              radius = {this.state.radius}
              fill = {this.state.color}
              stroke = {'black'}
              strokeWidth = {0.5}
              onMouseOver={this.props.mouseOver}
              onMouseLeave={this.props.mouseLeave}
           />
            <Circle
              x = {leechPoint.x}
              y = {leechPoint.y}
              radius = {this.state.radius}
              fill = {this.state.color}
              stroke = {'black'}
              strokeWidth = {0.5}
              onMouseOver={this.props.mouseOver}
              onMouseLeave={this.props.mouseLeave}
           />

        </Group>
      );

    }


    return (
      <Group>
        {c}
      </Group>
    );
  }
}

export default CentreLine