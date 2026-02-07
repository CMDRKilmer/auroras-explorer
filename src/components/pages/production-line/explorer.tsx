import {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'
import { useDataLoadingState, useGameData } from '@/lib/store'
import '@xyflow/react/dist/style.css'
import { type FC, useCallback, useEffect } from 'react'
import { formatSize } from '@/lib/format'
import { useExplorerContext } from './context'
import { ExplorerContextProvider } from './context-provider'
import { ExplorerControls } from './controls'
import type { Graph } from './graph'
import {
  addBuildingRelatedRecipesToGraph,
  addMaterialRelatedRecipesToGraph,
} from './graph-explorer'
import { layout } from './layout'
import { MaterialNode, RecipeNode } from './node'
import { Setting } from './setting'

const nodeTypes = {
  RecipeNode,
  MaterialNode,
}

const GraphView: FC = () => {
  const { data: { recipes } = {} } = useGameData()
  const reactFlow = useReactFlow()
  const [nodes, , onNodesChange] = useNodesState([])
  const [edges, , onEdgesChange] = useEdgesState([])
  const { mat, building } = useExplorerContext()

  const updateGraph = useCallback(async () => {
    const graph: Graph = { nodes: [], edges: [] }
    if (recipes) {
      if (mat) {
        console.log('updating graph for material', mat)
        addMaterialRelatedRecipesToGraph(graph, recipes, mat)
      } else if (building) {
        console.log('updating graph for building', building)
        addBuildingRelatedRecipesToGraph(graph, recipes, building)
      }
    }
    const { nodes, edges } = layout(graph)
    reactFlow.setNodes(nodes)
    reactFlow.setEdges(edges)
    console.log('graph updated', { nodes, edges })
    await reactFlow.fitView()
    await reactFlow.zoomTo(1)
  }, [reactFlow, recipes, mat, building])

  useEffect(() => {
    updateGraph()
  }, [updateGraph])

  return (
    <ReactFlow
      colorMode="dark"
      minZoom={0.01}
      maxZoom={5}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      nodesDraggable={false}
      nodesConnectable={false}
      nodesFocusable={false}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} />
      <Controls />
      <Panel position="top-left">
        <Setting />
      </Panel>
      <Panel position="bottom-center">
        <ExplorerControls />
      </Panel>
    </ReactFlow>
  )
}

const ProductionLineExplorerPageInner = () => {
  const { isLoading } = useGameData()
  const { progress, rate } = useDataLoadingState()

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-lg font-medium">
        Loading Necessary Data...
        <div
          className="hidden"
          // TODO: show loading progress
        >
          {progress.toFixed(2)}% @ {formatSize(rate)}/s
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 size-full flex flex-col">
      <div className="mt-4 w-full flex-1 border border-border rounded">
        <GraphView />
      </div>
    </div>
  )
}

export const ProductionLineExplorerPage: FC = () => {
  return (
    <ReactFlowProvider>
      <ExplorerContextProvider>
        <ProductionLineExplorerPageInner />
      </ExplorerContextProvider>
    </ReactFlowProvider>
  )
}
