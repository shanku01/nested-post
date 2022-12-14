
import './App.css';
import { useState,useEffect } from 'react';
import _ from 'lodash';

const TYPE ={
  data:"DATA",
  child:"CHILD"
}

const ChildrenDiv = ({nodeData, toggle, addChild, inputData})=>{
  return nodeData.map(item=><Parent key={item.name} nodeData={item} toggle={toggle} addChild={addChild} inputData={inputData}/>)
}

const Parent =({nodeData, toggle, addChild, inputData})=>{
  return(
      <div className='parent-div' key={nodeData.name}>
        <div>
          <button className='toggle' onClick={(e)=>toggle(nodeData.name)}>></button>
          <span className='parent-name'>{nodeData.name}</span>
          <button className='add-child' onClick={(e)=>addChild(nodeData.name)}>Add Child</button>
        </div>
        <div className='{nodeData.name} child-div'>{nodeData.children && nodeData.children.length?<ChildrenDiv nodeData={nodeData.children} toggle={toggle} addChild={addChild} inputData={inputData}/>:<input type="text" onChange={(event)=>inputData(nodeData.name,event.target.value)}/>}</div>
      </div>
  )
}

function App() {
  const [nodeData, setNodeData] = useState({
    name:"root"
  })

  const onToggle=(nodeName)=>{
    console.log(nodeName)
  }


  function updateNode(arr,nodeName,type,data) {
    if(typeof arr =="object"){
      arr.forEach(i => {
          if(_.isEqual(i.name, nodeName)) {
              if(type === TYPE.child){
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
  return (
    <div className="App">
      <h1>I am inside app, {nodeData.name}</h1>
      <Parent nodeData={nodeData} toggle={onToggle} addChild={onAddChild} inputData={onInputData}/>
    </div>
  );
}

export default App;
