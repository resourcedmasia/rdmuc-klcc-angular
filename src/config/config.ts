export class Config {

    XMLnograph = `<root> <mxCell id="0" /> <mxCell id="1" parent="0" /> <mxCell id="5cqd6Tq56_ArgYoLdoSi-1" value="No graph selected." style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"> <mxGeometry x="40" y="40" width="560" height="40" as="geometry" /> </mxCell> </root>`;

    DEFAULT_MXGRAPH_STYLESHEET = `../../assets/js/default.xml`;
    
    SLAVE_PARAMETER = "Parameter";

    asyncLocalStorage = {
        setItem: function (key, value) {
            return Promise.resolve().then(function () {
                localStorage.setItem(key, value);
            });
        },
        getItem: function (key) {
            return Promise.resolve().then(function () {
                return localStorage.getItem(key);
            });
        }
      };

    
    mxGraphFilter(mxcode) {
        let code = mxcode;
        if(code.includes(`</mxGraphModel>`)){
            code = code.trim();
            code = code.substr(code.indexOf("<root>"), code.length);
            code = code.replace("</mxGraphModel>","");
        }
        else {
            code = mxcode;
        }
        return code;
    }

    mxFileNameFilter(value) {
        return value.substr(0,value.length-4);
    }

    subscriptionInterval = 10 * 1000;

    /* MxGraph Cell */
    CELL_VALUE_ON = ['On','ON'];

    CELL_VALUE_OFF = ['Off','OFF'];

    cell_colour_OFF = '#DBDBDB'; // Grey

    cell_colour_ON = '#3dff54'; // Green

    /* MxGraph Flow Animation */
    FLOW_TYPE = ['flow_1','flow_2'];

    FLOW_COLOUR = ['Blue','Red', 'Grey']

    FLOW_BLUE = "Blue";

    FLOW_RED = "Red";

    FLOW_GREY = "Grey";

    FLOW_1 = 'flow_1'; // Forward Flow

    FLOW_2 = 'flow_2'; // Backward Flow

    FLOW_COLOUR_BLUE = 'lightBlue';

    FLOW_COLOUR_RED = 'red';

    FLOW_COLOUR_GREY = 'lightGray';





}


