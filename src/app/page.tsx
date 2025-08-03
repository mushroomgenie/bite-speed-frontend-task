"use client"
import { useCallback, useRef, useEffect, useState } from "react";
import { ReactFlow, addEdge, Connection, Background, useReactFlow, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Sidebar from "./components/sideBar";
import MessageNode from "./components/messageNode";
import { useDnD } from "&/context/dndContext";

const nodeTypes = {
  messageNode: MessageNode
}
let id = 3;
const getId = () => `n${id++}`;



export default function Home() {
  const reactFlowWrapper = useRef(null);


  const initialNodes = [
    { id: 'n1', position: { x: -100, y: 0 }, type: 'messageNode', data: { label: 'Node 1' } },
    { id: 'n2', position: { x: 0, y: 100 }, type: "messageNode", data: { label: 'Node 2' } }
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [nodeLabel, setNodeLabel] = useState('');
  const [sideBarType, setSideBarType] = useState("nodes")
  const [save, setSave] = useState(true)

  const { screenToFlowPosition } = useReactFlow();
  const [type, setType] = useDnD();

  const handleNodeClick = (event, node) => {
    setNodeLabel(node.data.label)
    setCurrentNodeId(node.id)
    setSideBarType("nodeMessage")
  }

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  useEffect(() => {
    if (currentNodeId) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === currentNodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                label: nodeLabel
              }
            }
          }
          return node
        })
      )
    }
  }, [setNodes, currentNodeId, nodeLabel])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      // check if the dropped element is valid
      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      console.log(id, "here")
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `Node ${id - 1}` },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes, type],
  );

  const onDragStart = (event, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.setData('text/plain', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges],
  );
  const onNodesChange = useCallback(
    (changes) => {
      setSave(true)
      setNodes((nds) => applyNodeChanges(changes, nds))
    },
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes) => {
      setSave(true)
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    [setEdges],
  );

  const saveFlow = () => {
    const nodesWithNoSources = nodes.filter((node) => !edges.some((edge) => edge.target === node.id))
    if (nodesWithNoSources.length > 1) {
      setSave(false)
    }
    else {
      setSave(true)
      alert("Flow Saved")
    }
  }
  return (
    <>
      <div className="bg-slate-200 flex justify-end">
        {!save ? <p className="bg-red-200 font-bold flex items-center rounded-xl mr-10 my-4 px-4">Cannot Save Flow</p> : null}
        <button className="mr-10 my-4 cursor-pointer border-black-100 border-1 rounded-lg" onClick={saveFlow}>
          <p className="p-2">Save Changes</p>
        </button>
      </div>
      <div className="grow h-full flex-row flex" ref={reactFlowWrapper}>
        <div className="grow h-screen flex">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onNodeClick={handleNodeClick}
            fitView
            nodeTypes={nodeTypes}
          >
            <Background />
          </ReactFlow>
          <Sidebar nodeLabel={nodeLabel} setNodeLabel={setNodeLabel} sideBarType={sideBarType} setSideBarType={setSideBarType} />
        </div>
      </div>
    </>
  );
}
