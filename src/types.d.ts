declare module '*.js' {
    const content: any;
    export default content;
}

declare module './Comments' {
    const Comments: any;
    export default Comments;
}

declare module './Sail/SailImageV2' {
    import { Component } from 'react';

    interface SailImageV2Props {
        image?: string | null;
        data?: any;
    }

    class SailImageV2 extends Component<SailImageV2Props> {
        newCurveClick: (event: any) => void;
        newLineClick: (centreline: boolean) => void;
        flipImage: (event: any) => void;
    }

    export default SailImageV2;
}

declare module '../Curves/CurveInfo' {
    const CurveInfo: any;
    export default CurveInfo;
}

declare module './ImageData' {
    const ImageData: any;
    export default ImageData;
}

declare module './LogData' {
    const LogData: any;
    export default LogData;
}

declare module '../UI/AppBar' {
    const AppBar: any;
    export default AppBar;
}
