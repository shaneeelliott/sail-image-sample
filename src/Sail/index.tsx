import React from 'react';
import Comments from './Comments';
import SailImage from './SailImageV2';
import CurveInfo from '../Curves/CurveInfo';
import Grid from '@mui/material/Grid';
import ImageData from './ImageData';
import LogData from './LogData';
import AppBar from '../UI/AppBar';

// Sample data will be loaded via fetch

class TrueNorthSASail extends React.Component<any, any> {
  private imageGrid: React.RefObject<any>;
  private myImage: React.RefObject<any>;
  private imageDataRef: React.RefObject<any>;
  private loginforef: React.RefObject<any>;
  private commentsref: React.RefObject<any>;

  constructor(props: any) {
    super(props);
    
    // Add refs
    this.imageGrid = React.createRef();
    this.myImage = React.createRef();
    this.imageDataRef = React.createRef();
    this.loginforef = React.createRef();
    this.commentsref = React.createRef();

    this.state = {
      name: '',
      url: '',
      ratio: 1,
      updated: false,
      curves: [],
      selectedCurve: null,
      selectedLine: null,
      lines: [],
      centreline: false,
      centrelineTwist: 0,
      points: [],
      Xmin: 0,
      Ymin: 0,
      pointer: 'default',
      imageInfo: null,
      imageTime: false,
      imageSRC: '',
      image: null,
      project: false,
      projectDir: false,
      projectName: '',
      saildialog: false,
      sail: '',
      sailType: '',
      isImage: false,
      Log: '',
      LogData: [],
      comments: "",
    };

  }

  componentDidMount() {
    this.loadSampleData();
  }

  loadSampleData = () => {
    // Fetch sample data from public directory
    fetch('/sampleData/data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Sample data loaded successfully:', data);

        // Update imagePath to use local sample image
        const imagePath = '/sampleData/image.jpg';

        this.setState({
          isImage: true,
          sail: data.sail,
          sailType: data.sailType,
          imageInfo: data.imageInfo,
          lines: data.lines || [],
          centreline: data.centreline,
          centrelineTwist: data.centrelineTwist,
          curves: data.curves || []
        });

        // Load the sample image
        if (this.myImage) {
          this.myImage.openSail(imagePath, data, () => {
            console.log('Sample image loaded successfully');
          });
        }
      })
      .catch(error => {
        console.error('Error loading sample data:', error);
        // Set some default state to prevent errors
        this.setState({
          isImage: true,
          sail: 'Sample Sail',
          sailType: 1,
          imageInfo: { Name: 'Sample Image' },
          lines: [],
          centreline: null,
          centrelineTwist: 0,
          curves: []
        });
      });
  }

  editCurve = (curveData) => {
    // Handle curve editing
    console.log('Editing curve:', curveData);
    // Add your curve editing logic here
  }

  render() {

    const { url, imageLoading } = this.state;
    let curveInfo;
    const { imageInfo } = this.state;

    if (this.state.curves.length > 0) {
      let crvs = [...this.state.curves];
      crvs.sort((a, b) => (a.name > b.name) ? 1 : -1)
      curveInfo = (<CurveInfo data={crvs} editHandler={this.editCurve}></CurveInfo>);
    }


    let img = (
      <SailImage ref={node => { this.myImage = node; }} app={this} />
    );


    let imgInfo;
    let logInfo;
    let comments;


    if (this.state.isImage) {
      imgInfo = (
        <ImageData ref={node => { this.imageDataRef = node; }} data={imageInfo} sail={this.state.sail} app={this}></ImageData>
      );

      logInfo = (
        <LogData ref={node => { this.loginforef = node; }} app={this} data={imageInfo}></LogData>
      );

      comments = (
        <Comments ref={node => { this.commentsref = node; }} app={this}></Comments>
      );
    }

    let app_bar = (
      <AppBar
        projectName={"TrueNorth Sail Analysis"}
        app={this}>
      </AppBar>
    );

    return (
      <div style={{ height: '100%' }}>
        {app_bar}

        <Grid
          style={{ padding: '5px 5px 5px 5px' }}
          container>

          <Grid item xs={12} sm={12} md={7} lg={7} style={{ padding: '5px 5px 5px 5px' }} ref={this.imageGrid}>
            {img}
          </Grid>

          <Grid item xs={12} sm={12} md={5} lg={5} style={{ padding: '5px 5px 5px 5px', marginBottom: "10px" }}>
            {imgInfo}
            {curveInfo}
            {logInfo}
            {comments}
          </Grid>

        </Grid>
      </div>
    );
  }
}

export default TrueNorthSASail;