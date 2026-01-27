import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'
import { useGameData } from '@/lib/store'
import '@xyflow/react/dist/style.css'
import { type FC, useCallback, useEffect } from 'react'
import { useExplorerContext } from './context'
import { ExplorerContextProvider } from './context-provider'
import {
  addRecipeRelationToGraph,
  addRecipeToGraphAsNode,
  type Graph,
  getRecipesByInput,
  getRecipesByOutput,
} from './graph'
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
  const { mat } = useExplorerContext()

  const updateGraph = useCallback(async () => {
    const graph: Graph = { nodes: [], edges: [] }
    if (recipes) {
      console.log('updating graph for material', mat)
      const addedKeys = new Set<string>()
      const currentRecipes = getRecipesByOutput(recipes, mat)
      if (currentRecipes.length > 0) {
        for (const recipe of currentRecipes) {
          addRecipeToGraphAsNode(graph, recipe)

          for (const input of recipe.Inputs) {
            const inputRecipes = getRecipesByOutput(recipes, input.Ticker)
            for (const inputRecipe of inputRecipes) {
              if (addedKeys.has(inputRecipe.RecipeName)) {
                continue
              }
              addRecipeToGraphAsNode(graph, inputRecipe)
              addRecipeRelationToGraph(graph, inputRecipe, recipe)
              addedKeys.add(inputRecipe.RecipeName)
            }
          }
        }
      }

      const furtherRecipes = getRecipesByInput(recipes, mat)
      for (const recipe of furtherRecipes) {
        addRecipeToGraphAsNode(graph, recipe)
        for (const currentRecipe of currentRecipes) {
          addRecipeRelationToGraph(graph, currentRecipe, recipe)
        }
      }
    }
    const { nodes, edges } = layout(graph)
    reactFlow.setNodes(nodes)
    reactFlow.setEdges(edges)
    console.log('graph updated', { nodes, edges })
    await reactFlow.fitView()
    await reactFlow.zoomTo(1)
  }, [reactFlow, recipes, mat])

  useEffect(() => {
    updateGraph()
  }, [updateGraph])

  return (
    <ReactFlow
      colorMode="dark"
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
    </ReactFlow>
  )
}

const ProductionLineExplorerPageInner = () => {
  const { isLoading } = useGameData()

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-lg font-medium">
        Loading Necessary Data...
      </div>
    )
  }

  return (
    <div className="p-4 size-full flex flex-col">
      <Setting />
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
