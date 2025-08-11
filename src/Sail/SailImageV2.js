import React, { Component } from 'react';
import { Stage, Layer, Circle, Image, Group } from 'react-konva';
import SavedCurve from '../Curves/SavedCurve';
import SavedLines from '../Curves/SavedLines';
import CentreLine from '../Curves/CenterLine';
import Curve from '../Curves/Curve';
import NewLine from '../Curves/Line';
import MySpinner from "../Project/MySpinner"
import StripeDialog from '../components/StripeDialog';
import * as EXIF from 'exif-js';
let pointkey = 1;
let curvekey = 1;
let imageData = [];


class Point extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: 'yellow',
      radius: 1.5,
      x: props.x,
      y: props.y,
    };
  }

  render() {
    return (
      <Circle
        x={this.props.x}
        y={this.props.y}
        radius={(this.state.radius / this.props.scale) * 1.2}
        fill={this.state.color}
        stroke={'black'}
        strokeWidth={0.5}
      />
    );
  }
}




class SailImage extends React.Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.myImage = React.createRef();
    this.curvesLayer = React.createRef();
    this.pointsLayer = React.createRef();

    this.state = {
      username: 'Shano',
      col2width: 300,
      col2height: 300,
      divWidth: 300,
      divHeight: 300,
      containerWidth: props.app.containerRef.current?.offsetWidth || 0,
      containerHeight: props.app.containerRef.current?.offsetHeight || 0,
      stageX: 0,
      stageY: 0,
      ratio: 1,
      updated: false,
      curves: [],
      lines: [],
      selectedCurve: null,
      selectedLine: null,
      points: [],
      Xmin: 0,
      Ymin: 0,
      pointer: 'default',
      imageInfo: null,
      image: props.image,
      newImage: true,
      width: 300,
      height: 300,
      pointNo: 0,
      name: '',
      scaleX: 1,
      isCentreline: false,
      centreline: null,
      centrelineTwist: 0,
      newCurve: false,
      oldWidth: 0,
      oldHeight: 0,
      scale: 1,
      loading: true,
      editing: false,
      stripeDialogOpen: false,
      pendingCurveData: null,
    }

    // Initialize wheel timeout for throttling
    this.wheelTimeout = null;

  }

  getWidth() {
    return this.img.width();
  }

  getHeight() {
    return this.img.height();
  }

  getRatio() {
    return this.state.ratio;
  }

  getInfo() {
    let info = this.state.imageInfo;
    return info;
  }

  componentDidMount() {
    // Add wheel event listener to the container to prevent page scrolling
    if (this.myRef.current) {
      this.myRef.current.addEventListener('wheel', this.handleWheel, { passive: false });
    }
  }

  componentWillUnmount() {
    // Remove wheel event listener
    if (this.myRef.current) {
      this.myRef.current.removeEventListener('wheel', this.handleWheel);
    }

    // Clear wheel timeout
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout);
      this.wheelTimeout = null;
    }
  }

  handleWheel = (e) => {
    // Prevent default browser scrolling
    e.preventDefault();
    e.stopPropagation();

    // Call the existing wheel handler
    this.wheelHandler({ evt: e });
  }


  openSail = (img, data, callback) => {
    //this.newImage(img);
    //this.myspinner.handleClickOpen();

    this.openImage(img, data, (img, data) => {

      if (data.sailType == 0) {
        this.props.app.setState({ sail: data.sail, sailType: 0 });
      } else if (data.sailType == 1) {
        this.props.app.setState({ sail: data.sail, sailType: 1 });
      } else {
        this.props.app.setState({ sail: data.sail, sailType: 2 });
      }

      this.props.app.setState({
        curves: data.curves,
        selectedCurve: null,
        imageSRC: img,
        LogData: data.LogData,
        imageTime: data.imageTime,
        comments: data.comments,
        lines: data.lines,
        centreline: data.centreline,
        centrelineTwist: data.centrelineTwist,
      });
      this.props.app.loginforef.setState({ data: data.LogData });
      this.myspinner.handleClose();
      callback();
      //  ////////////////////////////////////

    }
    );
  }

  openImage = (img, data, callback) => {

    const image = new window.Image();
    image.src = img;

    image.onload = () => {

      const w = image.width;
      const h = image.height;

      const imageAspect = h / w;
      const divAspect = this.myRef.current.offsetHeight / this.myRef.current.offsetWidth;

      let height = 0;
      let width = 0;

      //if(divAspect <= imageAspect){
      //   height = this.myRef.current.offsetHeight;
      //   width =  this.myRef.current.offsetHeight / imageAspect;
      //}else{
      height = this.myRef.current.offsetWidth * imageAspect;
      width = this.myRef.current.offsetWidth;
      //}

      let scale = width / data.imageSize.width;

      //this.getSavedImageExif(image, img, data);

      this.props.app.setState({ imageInfo: data, imageTime: data.imageTime });
      //this.props.app.imageDataRef.setState({loading:true});
      this.props.app.imageDataRef.updateInfo(data.imageInfo);

      let scaleX = data.imageSize.scaleX ? data.imageSize.scaleX : 1;
      console.log(scaleX);

      this.setState({
        image: image,
        ratio: imageAspect,
        width: w,
        height: h,
        name: img.replace(/^.*[\\\/]/, ''),
        col2width: width,
        col2height: height,
        divWidth: this.myRef.current.offsetWidth,
        divHeight: this.myRef.current.offsetHeight,
        curves: data.curves,
        lines: data.lines,
        centreline: data.centreline,
        centrelineTwist: data.centrelineTwist,
        selectedCurve: null,
        points: [],
        pointer: 'default',
        imageInfo: data,
        scale: scale,
        scaleX: scaleX,
        x: scaleX === -1 ? width : 0,
      });

      console.log(data.imageSize.scaleX, data.imageSize.x);

      window.addEventListener('resize', this.resize);

      callback(img, data);

    };


  }

  getSavedImageExif = (img, name, imageData) => {
    const self = this;
    EXIF.getData(img, function () {
      //var model = EXIF.getTag(this, "Model");
      let allMetaData = EXIF.getAllTags(this);
      let data = {
        Name: name.replace(/^.*[\\\/]/, ''),
        DateTimeOriginal: imageData.imageTime,
        PixelXDimension: allMetaData.PixelXDimension,
        PixelYDimension: allMetaData.PixelYDimension,
      }
      self.setState({ imageInfo: data });
      self.props.app.setState({ imageInfo: data, imageTime: imageData.imageTime });
      self.props.app.imageDataRef.setState({ loading: true });
      self.props.app.imageDataRef.updateInfo(data);
    });
  }

  updatePoints = (p) => {
    this.setState({
      points: p,
    })
  }

  updateCurves = (c) => {
    this.setState({
      selectedCurve: c,
      points: [],
      pointer: "move",
    })
  }

  editCurve = (index) => {
    console.log('Editing curve:', index);
    let curve = { ...this.state.curves[index] };
    let crvs = [...this.state.curves];
    crvs.splice(index, 1);
    let selectedCurve = {
      c: curve.controlPoints,
      key: curve.key,
      edit: true,
    };
    this.setState({ selectedCurve: selectedCurve, curves: crvs, editing: true });
  }

  editLine = (index) => {
    let curve = { ...this.state.lines[index] };
    let crvs = [...this.state.lines];
    crvs.splice(index, 1);
    let selectedCurve = {
      c: curve.c,
      key: curve.key,
      edit: true,
    };
    this.setState({ selectedLine: selectedCurve, lines: crvs, editing: true });
  }

  editCentreLine = () => {
    let curve = this.state.centreline;
    let selectedCurve = {
      c: curve.c,
      key: curve.key,
      edit: true,
    };
    this.setState({ selectedLine: selectedCurve, centreline: null, isCentreline: true, editing: true });
  }

  updateCurveData = (curveData) => {
    // Update the curve data in the parent state
    this.setState({ selectedCurve: curveData });
  }

  updateLineData = (lineData) => {
    // Update the line data in the parent state
    this.setState({ selectedLine: lineData });
  }

  saveCurve = (curveData) => {
    // If curveData is a string (stripe name), use it to name the curve
    if (typeof curveData === 'string') {
      // Get the actual curve data from the pending curve
      const actualCurveData = this.state.pendingCurveData;
      if (actualCurveData) {
        actualCurveData.name = curveData;
        let curves = [...this.state.curves];
        curves.push(actualCurveData);
        this.setState({
          curves: curves,
          selectedCurve: null,
          editing: false,
          pendingCurveData: null
        });
        this.props.app.setState({
          curves: curves,
        });
      }
    } else {
      // Show stripe dialog to get the stripe name
      this.setState({
        stripeDialogOpen: true,
        pendingCurveData: curveData
      });
    }
  }

  saveLine = (lineData) => {
    let lines = [...this.state.lines];
    lines.push(lineData);
    this.setState({
      lines: lines,
      selectedLine: null,
      editing: false
    });
  }

  cancelCurveEdit = () => {
    this.setState({
      selectedCurve: null,
      editing: false
    });
    this.props.app.setState({
      curves: this.state.curves,
    });
  }

  cancelLineEdit = () => {
    this.setState({
      selectedLine: null,
      editing: false
    });
  }

  handleStripeDialogClose = (stripeName) => {
    this.setState({
      stripeDialogOpen: false
    });

    if (stripeName) {
      this.saveCurve(stripeName);
    }
  }



  wheelHandler = (e) => {
    e.evt.preventDefault();

    // Throttle wheel events to improve performance
    if (this.wheelTimeout) {
      return;
    }

    this.wheelTimeout = setTimeout(() => {
      this.wheelTimeout = null;
    }, 16); // ~60fps

    const increment = 1.08;
    const scaleBy = 1.15; // Smaller scale factor for smoother zoom
    const oldScale = this.stage.scaleX();
    const pointer = this.stage.getPointerPosition();

    // Calculate the point under mouse before scaling
    const mousePointTo = {
      x: (pointer.x - this.stage.x()) / oldScale,
      y: (pointer.y - this.stage.y()) / oldScale
    };

    // Calculate new scale
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = Math.max(0.1, oldScale * Math.pow(scaleBy, direction));

    console.log("oldScale", oldScale, "newScale", newScale);

    if (newScale > 1) {
      // Apply scale
      this.stage.scale({ x: newScale, y: newScale });

      // Calculate new position to keep mouse point in same place
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale
      };

      // Update stage position directly
      this.stage.position(newPos);

      // Update state
      this.setState({
        stageX: newPos.x,
        stageY: newPos.y,
        Xmin: this.getWidth() - (this.getWidth() * newScale),
        Ymin: this.getHeight() - (this.getHeight() * newScale)
      });

      // Resize stage canvas to fill screen when zooming in
      //this.resizeStageCanvas(newScale);
    }
  }

  resizeStageCanvas = (scale) => {
    if (this.myRef.current && this.stage) {
      const container = this.myRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      console.log("containerWidth", containerWidth, "containerHeight", containerHeight);
      console.log("width", this.props.app.state.containerWidth, "height", this.props.app.state.containerHeight);

      // Calculate the scaled content size
      const scaledWidth = this.state.col2width * scale;
      const scaledHeight = this.state.col2height * scale;

      // Set stage size to the larger of container size or scaled content size
      const newWidth = Math.max(containerWidth, scaledWidth);
      const newHeight = Math.max(containerHeight, scaledHeight);

      this.stage.width(newWidth);
      this.stage.height(newHeight);
    }
  }




  ////////////////////////////////////////////////////////////////////////////////////////////////

  resize = () => {

    if (this.myRef.current) {

      const imageAspect = this.state.ratio;
      const divAspect = this.myRef.current.offsetHeight / this.myRef.current.offsetWidth;

      let height = 0;
      let width = 0;

      //if(divAspect <= imageAspect){
      //   height = this.myRef.current.offsetHeight;
      //   width =  this.myRef.current.offsetHeight / imageAspect;
      //}else{
      height = this.myRef.current.offsetWidth * imageAspect;
      width = this.myRef.current.offsetWidth;
      //}

      console.log(width, height);

      this.setState({
        col2width: width,
        col2height: height,
        divWidth: this.myRef.current.offsetWidth,
        divHeight: this.myRef.current.offsetHeight,
      });
    }

  }

  componentDidUpdate() {

  }

  curveMouseOver = (event) => {
    this.setState({ pointer: "pointer" });
  }

  curveMouseLeave = (event) => {
    this.setState({ pointer: "default" });
  }

  findXmin = (pos) => {
    if (pos.x > this.state.Xmin && pos.x < 0) {
      return pos.x;
    }
    else if (pos.x > 0) {
      return 0;
    }
    else {
      return this.state.Xmin;
    }
  }

  findYmin = (pos) => {
    if (pos.y > this.state.Ymin && pos.y < 0) {
      return pos.y;
    }
    else if (pos.y > 0) {
      return 0;
    }
    else {
      return this.state.Ymin;
    }
  }

  resetView = () => {
    this.stage.scale({ x: 1, y: 1 });

    // Reset stage canvas size to original size
    if (this.stage) {
      this.stage.width(this.state.col2width);
      this.stage.height(this.state.col2height);
    }

    this.setState({
      stageX: 0,
      stageY: 0,
      Xmin: 0,
      Ymin: 0
    });
  }


  render() {

    const { loading, editing } = this.state;

    const rwMax = {
      margin: '0px 0px 0px 0px',
    }

    let stageStyle = {
      cursor: this.state.pointer,
      zIndex: 99
    }

    let image = null;
    let stage = null;
    let shapes = null;
    let selectCurve = null;
    let selectLine = null;

    if (this.state.selectedCurve) {
      selectCurve = (<Curve sailImage={this} data={this.state.selectedCurve} ref={node => { this.selectedCurveRef = node; }} />);
    }

    if (this.state.selectedLine) {
      selectLine = (<NewLine sailImage={this} data={this.state.selectedLine} ref={node => { this.selectedLineRef = node; }} />);
    }

    shapes = (
      <Layer
        scale={{ x: this.state.scale, y: this.state.scale }}
        ref={node => { this.shapes = node; }}
      >
        {<CentreLine parent={this} curve={this.state.centreline} mouseOver={editing ? null : this.curveMouseOver} mouseLeave={editing ? null : this.curveMouseLeave} editHandler={this.editCentreLine} editing={editing} />}
        {<SavedCurve parent={this} data={this.state.curves} mouseOver={editing ? null : this.curveMouseOver} mouseLeave={editing ? null : this.curveMouseLeave} editHandler={this.editCurve} editing={editing} />}
        {<SavedLines parent={this} data={this.state.lines} mouseOver={editing ? null : this.curveMouseOver} mouseLeave={editing ? null : this.curveMouseLeave} editHandler={this.editLine} editing={editing} />}
        {selectCurve}
        {selectLine}
      </Layer>
    );

    image = (
      <Image
        image={this.state.image}
        scaleX={this.state.scaleX}
        x={this.state.x}
        width={this.state.col2width}
        height={this.state.col2height}
        onclick={this.state.click}
        ref={node => { this.img = node; }}
      />
    );

    stage = (
      <Stage
        x={this.state.stageX}
        y={this.state.stageY}
        ref={node => { this.stage = node; }}
        width={this.state.col2width}
        height={this.state.col2height}
        style={stageStyle}
        draggable={true}
        dragBoundFunc={(pos) => {
          let newY = this.findYmin(pos);
          let newX = this.findXmin(pos);
          return {
            x: newX,
            y: newY
          }
        }}

        onDragEnd={(e) => {
          // Only handle stage drag end if we're not editing curves or lines
          if (!this.state.selectedCurve && !this.state.selectedLine) {
            console.log("stage Drag end");
            this.setState({
              stageX: e.target.x(),
              stageY: e.target.y()
            });
          }
        }}
        onDblClick={this.resetView}
        onMouseDown={(e) => {
          // Prevent default browser behavior
          e.evt.preventDefault();
        }}>
        <Layer>
          {image}
        </Layer>
        {shapes}
      </Stage>
    );

    let spinner = (
      <MySpinner ref={node => { this.myspinner = node; }} text={"Loading"}></MySpinner>
    );

    let editButtons = null;
    if (editing) {
      editButtons = (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={() => {
              if (this.state.selectedCurve && this.selectedCurveRef) {
                this.selectedCurveRef.saveCurve();
              } else if (this.state.selectedLine && this.selectedLineRef) {
                this.selectedLineRef.saveLine();
              }
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              if (this.state.selectedCurve) {
                this.cancelCurveEdit();
              } else if (this.state.selectedLine) {
                this.cancelLineEdit();
              }
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>
      );
    }

    const stripeDialog = (
      <StripeDialog
        open={this.state.stripeDialogOpen}
        onClose={this.handleStripeDialogClose}
        sailImage={this}
        app={this}
      />
    );

    return (

      <div
        ref={this.myRef}
        style={{
          height: "100%",
          position: "relative",
          overflow: "hidden",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none"
        }}
        onWheel={this.handleWheel}
      >
        {spinner}
        {stage}
        {editButtons}
        {stripeDialog}
      </div>

    );
  }
}

export default SailImage;