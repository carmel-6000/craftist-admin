import ReactDataGrid from 'react-data-grid';
import ReactDOM from 'react-dom';
//const exampleWrapper = require('../components/exampleWrapper');
//const React = require('react');
//import { Toolbar }  from 'react-data-grid-addons';
import React, { Component } from 'react';
import update from 'immutability-helper';
import './Grid.css';
import './ContextMenu.css'
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { Link } from "react-router-dom";
import Auth from '../Auth/Auth';
//import TimeAgo from 'javascript-time-ago'
//import en from 'javascript-time-ago/locale/en'
import * as moment from 'moment';
import classNames from 'classnames';
import Modal from 'react-responsive-modal';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

//const { Toolbar, Data: { Selectors } } = require('react-data-grid-addons');

const {
  Menu: { ContextMenu, MenuItem, SubMenu },
  ToolsPanel: { AdvancedToolbar: Toolbar, GroupedColumnsPanel },
  Data: { Selectors },
  Draggable: { Container: DraggableContainer },
  Formatters: { ImageFormatter }
} = require('react-data-grid-addons');

const { Editors, Formatters } = require('react-data-grid-addons');
const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;
const { DropDownFormatter } = Formatters;

const booleansArgs = [{ id: 0, title:'No' ,text:'No',  value:0 }, { id: 1, title:'Yes',text:'Yes', value:1 }];
const BooleanEditor = <DropDownEditor options={booleansArgs} />;

const privatePublicArgs = [
  { id: 0, title:'None' ,text:'None',  value:'None' },
  { id: 1, title:'Private',text:'Private', value:'Private' },
  { id: 2, title:'Public',text:'Public', value:'Public' }
];

const privatePublicEditor = <DropDownEditor options={privatePublicArgs} />;


class BooleanFormatter extends React.Component {

  //static propTypes = {value: PropTypes.number};

  render() {
    //console.log("this.props.value?",this.props.value);
    const val = this.props.value == 1 ? "yes" : "no";
    return (
      <div className="formatter-boolean">
          {val}
      </div>);
  }
}

class ExternalLinkFormatter extends React.Component {

  static propTypes = {value: PropTypes.string};

  render() {
    //console.log("LinkFormatter this.props",this.props.dependentValues.href);
    let val=this.props.dependentValues.val;
    let href=this.props.value;

    if (href=="" || href==undefined){
      return (<div className="formatter-boolean">-</div>);
    }else{
      console.log("HREF",href);
      return (<a href={href} target="_blank">{val}</a>)
    }

  }

}
class LinkFormatter extends React.Component {

  static propTypes = {value: PropTypes.string};

  render() {
    //console.log("LinkFormatter this.props",this.props.dependentValues.href);
    let hrefTmpl=this.props.dependentValues.href;
    let href=null;
    if (hrefTmpl.includes("{this.value}")){
      href=hrefTmpl.replace("{this.value}",this.props.value);
    }else{
      href=hrefTmpl;
    }

    return (
      <div className="formatter-boolean">
          <Link to={href}>{this.props.value}</Link>
      </div>);
  }

}

class DateTimeFormatter extends React.Component {

  static propTypes = {value: PropTypes.string};

  constructor(props){
    super(props);

    let rawDate=this.props.value;
    let dateObj=new Date(rawDate);
    //TimeAgo.locale(en);
    //const timeAgo = new TimeAgo('en-US');
    //let tAgo=timeAgo.format(Date.now() - ((new Date()).getTime()-dateObj.getTime()) );
    this.rawDate=rawDate;
    this.fDate= rawDate=='' || rawDate==null ? "-" : moment(rawDate).format('DD/MM/YY HH:mm');
  }

  render() {
    //console.log("rawDate?",this.rawDate);
    const fDate=this.fDate;

    return (

      <div className="formatter-datetime">
          {fDate}
      </div>);
  }
}




// Create the context menu.
// Use this.props.rowIdx and this.props.idx to get the row/column where the menu is shown.
class MyContextMenu extends React.Component {
  static propTypes = {
    onRowDelete: PropTypes.func.isRequired,
    //onRowInsertAbove: PropTypes.func.isRequired,
    //onRowInsertBelow: PropTypes.func.isRequired,
    //rowIdx: PropTypes.string.isRequired,
    //idx: PropTypes.string.isRequired,
    //id: PropTypes.string.isRequired
  };

  onRowDelete = (e, data) => {
    if (typeof(this.props.onRowDelete) === 'function') {
      this.props.onRowDelete(e, data);
    }
  };

  onRowInsertAbove = (e, data) => {
    if (typeof(this.props.onRowInsertAbove) === 'function') {
      this.props.onRowInsertAbove(e, data);
    }
  };

  onRowInsertBelow = (e, data) => {
    if (typeof(this.props.onRowInsertBelow) === 'function') {
      this.props.onRowInsertBelow(e, data);
    }
  };

  render() {
    const { idx, id, rowIdx } = this.props;
/*
<SubMenu title="Insert Row">
          <MenuItem data={{ rowIdx, idx }} onClick={this.onRowInsertAbove}>Above</MenuItem>
          <MenuItem data={{ rowIdx, idx }} onClick={this.onRowInsertBelow}>Below</MenuItem>
        </SubMenu>
*/
    return (
      <ContextMenu id={id}>
        <MenuItem data={{ rowIdx, idx }} onClick={this.onRowDelete}>Delete Row</MenuItem>

      </ContextMenu>
    );
  }
}


class ChooseFieldsDropDown extends React.Component{


  constructor(props){
    super(props);

    this.state={isOpened:false};
    this.toggleDropDown=this.toggleDropDown.bind(this);


  }

  componentDidMount(){

    //console.log("choose fields drop down is constructed with props.allCols? (componentDidMount)",this.props.allCols);

  }
  toggleDropDown(){


    console.log("toggle drop down on click?");
    const isOpened=this.state.isOpened;
    //let rows=[...this.state.rows];
    this.setState({isOpened:!isOpened})
    this.toggleCheckbox=this.toggleCheckbox.bind(this);

  }

  toggleCheckbox({target}){

    let colName=target.getAttribute("name");

    if (target.checked){
      this.props.addCol(colName);
    }else{
      this.props.removeCol(colName)
    }

  }

  render(){

    //var cx = React.addons.classSet;
    console.log("choose fields drop down is constructed with props?",this.props);
    var classes = classNames({
        'dropdown-menu': true,
        'show-dropdown': this.state.isOpened,
    });
    return (
        <div className="dropdown chooseFieldsDropDown">

          <button
            className="btn btn-secondary dropdown-toggle" type="button"
            id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
            aria-expanded={this.state.isOpened ? 'true' : 'false'}
            onClick={this.toggleDropDown}

          >
            Choose Fields
          </button>

          <div className={classes} aria-labelledby="dropdownMenuButton">
<ul>
{
  this.props.allCols.map((col,i) =>
    <li key={i}><input type='checkbox'
        defaultChecked={true}
        onClick={this.toggleCheckbox}
        name={col.key}
        label={col.name}
    /><label>{col.name}</label></li>)
}
</ul>

          </div>
        </div>
      );

  }
}



class CustomToolbar extends React.Component {

  static propTypes = {
    onAddRow: PropTypes.func,
    onToggleFilter: PropTypes.func,
    enableFilter: PropTypes.bool,
    numberOfRows: PropTypes.number,
    addRowButtonText: PropTypes.string,
    filterRowsButtonText: PropTypes.string,
    children: PropTypes.any,
    groupBy: PropTypes.array.isRequired,
    onColumnGroupAdded: PropTypes.func.isRequired,
    onColumnGroupDeleted: PropTypes.func.isRequired,
    addCol:PropTypes.func,
    removeCol:PropTypes.func,
    allCols:PropTypes.array
  };

   onAddRow = () => {
    if (this.props.onAddRow !== null && this.props.onAddRow instanceof Function) {
      this.props.onAddRow({newRowIndex: this.props.numberOfRows});
    }
   };


  renderAddRowButton = () => {
    //if (this.props.onAddRow ) {
      return (<button type="button" className="btn" onClick={this.onAddRow}>
        Add Row
      </button>);
    //}
  };




  renderCustomButtons=()=>{

    console.log("custom buttons",this.props.customButtons);
    const cButtons=this.props.customButtons;

    return (
    <div>
      {
        cButtons.map((cButton,i) => <button type="button"
          onClick={()=>this.props.handleCustomButtonClick('openRawTable')}
          className="btn" key={i}>{cButton.label}</button>)
      }
    </div>
    )


  }


  renderToggleFilterButton = () => {
    if (this.props.enableFilter) {
      return (<button type="button" className="btn" onClick={this.props.onToggleFilter}>
      {this.props.filterRowsButtonText}
    </button>);
    }
  };

  logOut = () => {

    console.log("logout is launched");

    Auth.logout(()=>{
      window.location.reload();
    });

  }

//toolbar={<Toolbar enableFilter={true}/>}
  render() {
    console.log("CustomToolBar ?! this.props.allCols",this.props.allCols)  ;
    return (

  <React.Fragment>


    <div className="react-grid-Toolbar">

    <div className="tools">

        {this.renderCustomButtons()}
        {this.renderAddRowButton()}
        {this.renderToggleFilterButton()}
        <ChooseFieldsDropDown addCol={this.props.addCol} removeCol={this.props.removeCol} allCols={this.props.allCols}/>
        {this.props.children}

      </div>

    <GroupedColumnsPanel groupBy={this.props.groupBy}
        onColumnGroupAdded={this.props.onColumnGroupAdded}
        onColumnGroupDeleted={this.props.onColumnGroupDeleted}

        />

    </div>
  </React.Fragment>
      );
  }
}

class Grid extends Component {

  static propTypes = {
    whereObj:PropTypes.object,
    modelMeta:PropTypes.string,
    modelApi:PropTypes.string,
    useShortFieldsSyntax:PropTypes.boolean
  }

  constructor(props, context) {
    super(props, context);
    this.state = {allCols:[],originalRows:[],rows:[],cols:[],filters:{},groupBy: [], expandedRows: {},
      modalPopup:()=><div/>,
      isModalPopupOpened:false
    };
    this.customButtons=[];



    console.log("GRID PROPS",this.props);
  }

  ucWords(st){

      st = st.toLowerCase();
      return st.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s){return s.toUpperCase();});

  }



  componentDidMount(){

    let cols=[];
    let allCols=[];

    fetch(this.props.modelMeta).then(response=>{return response.json()}).then(res=> {

        //let validFields=[]
        let fieldProps=null;
        let metaRes=res;
        //for (let field in res.crud.fields){
                //fieldProps=res.crud.fields[field];
                //validFields.push(field);
        //}
        //console.log("validFields",validFields);
        console.log("~~~~~RES",res);
        let col={};





        for (let prop in res.crud.fields){

            //if (validFields.indexOf(prop)!==-1){
                let key=null,name=null;



                if (this.props.useShortFieldsSyntax==true){

                  key = prop;
                  name=this.ucWords(new String(prop).replace(/([A-Z])/g, " $1"));

                }  else{

                  key=new String(prop).replace(/([A-Z])/g, "_$1").toLowerCase();
                  name=this.ucWords(key.replace(/_/g," "));
                }


                col={
                  key:key,
                  name:name,
                  editable:res.crud.fields[prop] && res.crud.fields[prop].editable && res.crud.fields[prop].editable==='true',
                  resizable:true,
                  sortable:true,
                  filterable:true,
                  draggable:true

                }

                //console.log("KEY!?",col);

                if (prop=='id'){
                  col.width=80;
                  col.resizable=false;
                }

                if (res.crud.fields[prop] && res.crud.fields[prop].type && res.crud.fields[prop].type =="boolean"){
                  console.log("prop (%s) is a boolean",prop);
                  if (res.crud.fields[prop].width && !isNaN(res.crud.fields[prop].width)){
                    col.width=res.crud.fields[prop].width;
                  }else{
                    col.width=80;
                  }

                  col.formatter=BooleanFormatter;
                  col.editor=BooleanEditor;
                  col.resizable=false;
                }

                if (res.crud.fields[prop] && res.crud.fields[prop].type && res.crud.fields[prop].type =="datetimePicker"){
                  col.formatter=DateTimeFormatter;
                  //col.width=100;
                }

                if (res.crud.fields[prop] && res.crud.fields[prop].type && res.crud.fields[prop].type =="privatePublicEnum"){
                  col.editor=privatePublicEditor;
                  col.resizable=false;
                }

                if (res.crud.fields[prop] && res.crud.fields[prop].type && res.crud.fields[prop].type =="link"){
                  col.formatter=LinkFormatter;
                  col.getRowMetaData=(row)=>{ return {...row,href:res.crud.fields[prop].href}; }
                }

                if (res.crud.fields[prop] && res.crud.fields[prop].type && res.crud.fields[prop].type =="externalLink"){
                  col.formatter=ExternalLinkFormatter;
                  col.getRowMetaData=(row)=>{ return {...row,val:res.crud.fields[prop].value}; }
                }

                if (res.crud.fields[prop] && res.crud.fields[prop].width && !isNaN(res.crud.fields[prop].width)){
                  col.width=parseInt(res.crud.fields[prop].width);
                }


                if (res.crud.fields[prop] && res.crud.fields[prop].isHidden && res.crud.fields[prop].isHidden =="true" ){

                }else{
                  cols.push(col);
                }

                allCols.push(col);

            //}
        }


        let apiUrl=this.props.modelApi;

        if (this.props.whereObj){
          //console.log("where object~~~",this.props.whereObj);
          apiUrl=this.props.modelApi+"?where="+JSON.stringify(this.props.whereObj);
        }
        //console.log("apiUrl",apiUrl);

        fetch(apiUrl).then(response=>{return response.json()}).then(res=> {

            //console.log("RES?",res);
            if (typeof res=='undefined'){
              res=[];
            }
            this.setState({ originalRows:res,rows: res,cols:cols,  sortColumn: null, sortDirection: null, allCols:allCols });


            if (metaRes.crud && metaRes.crud.menubar && metaRes.crud.menubar.menuitems && typeof Array.isArray(metaRes.crud.menubar.menuitems) && metaRes.crud.menubar.menuitems.length>0){
              console.log("~~~~menubar exist with menuitems longer than 0",metaRes.crud.menubar.menuitems);
              for (let miIndex in metaRes.crud.menubar.menuitems){

                let menuItem=metaRes.crud.menubar.menuitems[miIndex];

                if (menuItem.type){
                  switch(menuItem.type){
                    case "popupAction":
                      //console.log("~~~~~~~~~~~~~~~~~~It's a popupAction menu item type");
                      this.customButtons.push(menuItem);

                      //console.log("rows",res);
                      //console.log("cols",cols);
                      let tac={textAlign:'center'};
                      let borderStyle={border:'1px solid #ededed'};

                      this.setState({modalPopup: ()=>(
                        <Modal open={this.state.isModalPopupOpened} center onClose={this.onCloseModal}>
                            <table border="1" cellspacing="5" cellpadding="5" style={borderStyle}>
                              <tr>
                                {cols.map((col,ii)=><th key={ii}>{col.name}</th>)}
                              </tr>
                              {

                                res.map((row,i)=><tr key={i}>
                                {
                                  cols.map((col,ii)=>{
                                    if (new String(row[col.key]).includes("http")){
                                      return <td key={ii}  style={tac}><a href={row[col.key]}>Link</a></td>
                                    }else{
                                      return <td key={ii}  style={tac}>{row[col.key]}</td>
                                    }

                                  })

                                }</tr>)
                              }
                            </table>
                        </Modal>

                      )});





                    break;
                  }
                }
              }
            }else{
              console.log("~~~~menubar DOES NOT exist with menuitems longer than 0");
            }




        }).catch((err)=> {
            console.log('Fetch Error :-S', err);
        });

    }).catch((err)=> {
        console.log('Fetch Error :-S', err);
    });
  }

  onCloseModal = () => {
    this.setState({ isModalPopupOpened: false });
  };

  addCol=(fieldName)=>{
    //console.log("add col is invoked with fieldName",fieldName);
    let cols=[...this.state.cols];
    let exist=false;
    for (var i in cols) {
        if (cols[i]['key'] == fieldName) {
            exist=true;
        }
    }
    if (exist) return;
    let colsChanged=false;
    for (let c in this.state.allCols){
      if (this.state.allCols[c]['key']==fieldName){
        cols.push(this.state.allCols[c]);
        colsChanged=true;
      }
    }
    this.setState({cols:cols});


  }
  removeCol=(fieldName)=>{
    //console.log("remove col is invoked with fieldName",fieldName);
    let cols=[...this.state.cols];
    for (var i in cols) {
        if (cols[i]['key'] == fieldName) {
            cols.splice(i, 1);
        }
    }
    //console.log("cols after",cols);
    this.setState({cols:cols});

  }

  getSize = () => {
    return this.getRows().length;
  };


  getRows = () => {

    let r= Selectors.getRows(this.state);
    //console.log("rows(r)",r);
    return r;
  };

  /*
  rowGetter = (i) => {
    return this.state.rows[i];
  };
  */

  rowGetter = (rowIdx) => {
    let rows = this.getRows();
    let result =  rows[rowIdx];
    result.c = rowIdx;
    return result;
  };

  addNewRow = (index)=>{

    let rows=[...this.state.rows];
    let newRow={...rows[rows.length-1]};
    for (let key in newRow){
        newRow[key]=null;
    }

    rows.push(newRow);
    this.setState({rows:rows});
    setTimeout(()=>{
      let objDiv = document.querySelector(".react-grid-Canvas");
      objDiv.scrollTop = objDiv.scrollHeight;
    },500);
  }

  handleCustomButtonClick=(type)=>{
    console.log("do action is launched with type",type);
    if (type=='openRawTable'){
      this.setState({isModalPopupOpened:true});
    }
  }

  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };
    const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);
    this.setState({ rows:rows });
  };


  handleFilterChange = (filter) => {

    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    console.log("setting filters on state:",newFilters);
    this.setState({ filters: newFilters });
  };

  onClearFilters = () => {
    // all filters removed
    this.setState({filters: {} });
  };


  deleteRow = (e, { rowIdx }) => {

     const options = {
    //title: 'Title',
    message: 'Are you should you want to delete this entry? This action cannot be undone',
    buttons: [
      {
        label: 'Yes',
        onClick: () => {

          //console.log("row id",this.state.rows[rowIdx].id);

          fetch(this.props.modelApi+'/'+this.state.rows[rowIdx].id, {
              method: 'DELETE',headers: {'Accept': 'application/json','Content-Type': 'application/json'}})
              .then(response=>{return response.json()}).then(res=> {

            if (res.count && res.count==1){

              this.state.rows.splice(rowIdx, 1);
              this.setState({rows: this.state.rows});
            }else{
              console.log("Delete err",res.error);
            }
          });

        }
      },
      {
        label: 'No',
        onClick: () => {}
      }
    ],
    childrenElement: () => <div />,
    //customUI: ({ title, message, onClose }) => <div>Custom UI</div>,
    willUnmount: () => {}
  }

  confirmAlert(options)




  };


  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {

    //console.log("Grid has updated?");
    let rows = this.state.rows.slice();


    for (let i = fromRow; i <= toRow; i++) {

      let rowToUpdate = {...rows[i]};
      let updatedRow = update(rowToUpdate, {$merge: updated});

      rows[i] = updatedRow;
      let uRow={...updatedRow};
      delete uRow.id;
      delete uRow.created;
      //console.log("new row?",updatedRow.id);
      let whereUrlEncoded='{"id":'+(updatedRow.id == null ? '"a"' : updatedRow.id) +'}';
      fetch(this.props.modelApi+'/upsertWithWhere?where='+whereUrlEncoded, {method: 'POST',headers: {'Accept': 'application/json','Content-Type': 'application/json'},body: JSON.stringify(uRow)}).then(response=>{return response.json()}).then(res=> {
        //console.log("Update res",res);

        if (res.id && !isNaN(res.id) && updatedRow.id==null){
          updatedRow.id=res.id;
        }

        if (res.error){
          rows[i]=rowToUpdate;
          this.setState({ rows:rows});
        }
        if (res.count && res.count>0){
          console.log("data is updated");
          //updatedRow.id=res.
          this.setState({ rows:rows});

        }
      });

    }

    this.setState({ rows:rows});
  };


  onColumnGroupAdded = (colName) => {
    let columnGroups = this.state.groupBy.slice(0);
    let activeColumn = this.state.cols.find((c) => c.key === colName)
    let isNotInGroups = columnGroups.find((c) => activeColumn.key === c.name) == null;
    if (isNotInGroups) {
      columnGroups.push({key: activeColumn.key, name: activeColumn.name});
    }

    this.setState({groupBy: columnGroups});
  };

  onColumnGroupDeleted = (name) => {
    let columnGroups = this.state.groupBy.filter(function(g){
      return typeof g === 'string' ? g !== name : g.key !== name;
    });
    this.setState({groupBy: columnGroups});
  };

  onRowExpandToggle = ({ columnGroupName, name, shouldExpand }) => {
    let expandedRows = Object.assign({}, this.state.expandedRows);
    expandedRows[columnGroupName] = Object.assign({}, expandedRows[columnGroupName]);
    expandedRows[columnGroupName][name] = {isExpanded: shouldExpand};
    this.setState({expandedRows: expandedRows});
  };



  render() {

    const ModalPopup=this.state.modalPopup;

    //console.log("cols?",this.cols);
    return  (
      <React.Fragment>
        <DraggableContainer>
            <ReactDataGrid
              ref={ node => this.grid = node }
              enableCellSelect={true}
              enableDragAndDrop={true}
              onGridSort={this.handleGridSort}
              enableCellSelect={true}
              columns={this.state.cols}
              rowGetter={this.rowGetter}
              rowsCount={this.getSize()}
              minHeight={800}
              onAddFilter={this.handleFilterChange}
              onRowExpandToggle={this.onRowExpandToggle}
              contextMenu={<MyContextMenu id="customizedContextMenu" onRowDelete={this.deleteRow}/>}
              toolbar={<CustomToolbar

                handleCustomButtonClick={this.handleCustomButtonClick}
                customButtons={this.customButtons}
                groupBy={this.state.groupBy}
                onColumnGroupAdded={this.onColumnGroupAdded}
                onColumnGroupDeleted={this.onColumnGroupDeleted}
                enableFilter={true}
                onAddRow={this.addNewRow}
                filterRowsButtonText="Filter"
                addCol={this.addCol}
                removeCol={this.removeCol}
                allCols={this.state.allCols}
                />
              }
              onClearFilters={this.onClearFilters}
              onGridRowsUpdated={this.handleGridRowsUpdated} />
        </DraggableContainer>
        <ModalPopup />
      </React.Fragment>

        );
  }
}

export default DragDropContext(HTML5Backend)(Grid);
