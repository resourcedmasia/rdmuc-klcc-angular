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

    subscriptionInterval = 8000;

    CELL_VALUE_ON = ['On','ON'];

    CELL_VALUE_OFF = ['Off','OFF'];

    cell_colour_OFF = '#DBDBDB';

    cell_colour_ON = '#3dff54';





}


