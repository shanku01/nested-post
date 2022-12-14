
import './App.css';
import { useState,useEffect } from 'react';
import _ from 'lodash';

const TYPE ={
  data:"DATA",
  child:"CHILD"
}

const ChildrenDiv = ({nodeData, toggle, addChild, inputData, display})=>{
  return nodeData.map(item=><Parent key={item.name} nodeData={item} toggle={toggle} addChild={addChild} inputData={inputData} display={display}/>)
}

const Parent =({nodeData, toggle, addChild, inputData, display})=>{
  return(
      <div className='parent-div' key={nodeData.name}>
        <div className='header-div'>
          <button className="toggle" onClick={(e)=>toggle(nodeData.name)}><div className={display[nodeData.name]?"":"rotate-90"}>></div></button>
          <span className='parent-name'>{nodeData.name}</span>
          <button className='add-child' onClick={(e)=>addChild(nodeData.name)}>Add Child</button>
        </div>
        <div className={display[nodeData.name]?"hide":""}>{nodeData.children && nodeData.children.length?<ChildrenDiv nodeData={nodeData.children} toggle={toggle} addChild={addChild} inputData={inputData} display={display}/>:<div className='data-input'>Data <input type="text" onChange={(event)=>inputData(nodeData.name,event.target.value)}/></div>}</div>
      </div>
  )
}

function App() {
  const [nodeData, setNodeData] = useState({
    name:"root"
  })

  const [display, setDisplay] = useState({});

  const onToggle=(nodeName)=>{
    if(display[nodeName]){
      setDisplay({
        ...display,
        [nodeName]:false
      });
    }else{
      setDisplay({
        ...display,
        [nodeName]:true
      });
    }
  }


  function updateNode(arr,nodeName,type,data) {
    if(typeof arr =="object"){
      arr.forEach(i => {
          if(_.isEqual(i.name, nodeName)) {
              if(type === TYPE.child){
                delete i.data;
                if(i.children){
                  i.children =[...i.children,{
                      name:nodeName+"-child-"+(i.children.length+1),
                    }]
                }else{
                  i.children =[{
                    name:nodeName+"-child-"+1
                  }]
                }
              }else{
                i.data = data
              }
          }else {
            updateNode(i.children,nodeName)
          }
      });
    }
  }

  const onAddChild=(nodeName)=>{
    if(nodeName === "root"){
      delete nodeData.data;
      if(nodeData.children){
        setNodeData({
          ...nodeData,
            children: [...nodeData.children,{
            name:"child-"+(nodeData.children.length+1),
          }]
      });
      }else{
        setNodeData({
          ...nodeData,
            children: [{
            name:"child-1",
          }]
      });
      }
    }else{
      let newData = nodeData;
      updateNode(newData.children,nodeName,TYPE.child,"");
      setNodeData(newData);
    }
  }
  const onInputData=(nodeName,data)=>{
    if(nodeName === "root"){
      setNodeData({
        ...nodeData,
        data:data
      });
    }else{
      let newData = nodeData;
      updateNode(newData.children,nodeName,TYPE.data,data);
      setNodeData(newData);
    }
  }

  useEffect(()=>{
    setNodeData(nodeData);
  },[nodeData]);

  const [print, setPrint] = useState(false);
  return (
    <div className='backgorund'>
        <Parent nodeData={nodeData} toggle={onToggle} addChild={onAddChild} inputData={onInputData} display={display}/>
        <button className="export" onClick={(e)=>setPrint(!print)}>Export</button>
        <div className={print?"print-data":"print-data hide"}>{JSON.stringify(nodeData)}</div>
    </div>
  );
}

export default App;
