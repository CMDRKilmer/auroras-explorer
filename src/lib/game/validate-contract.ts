import type { GameData } from '@/server/services/game-data'
import type { Contract, UserPlan } from '../api'
import { ContractTags } from '../constants'
import { normalizeAddress } from './address'

export interface ContractValidationResult {
  isRequest?: boolean
  hasPlan?: boolean
  matchPlan?: boolean
}

const addSupplyFromNeeds = (
  data: GameData,
  materials: Set<string>,
  type: string,
) => {
  const workforceNeeds = data.workforceNeedsByType[type]
  if (!workforceNeeds) return
  for (const need of workforceNeeds.Needs) {
    materials.add(need.MaterialTicker)
  }
}

const getWorkforceSupply = (data: GameData, building: string) => {
  const buildingData = data.buildingsByTicker[building]
  const materials = new Set<string>()
  if (!buildingData) return
  if (buildingData.Pioneers) addSupplyFromNeeds(data, materials, 'PIONEER')
  if (buildingData.Settlers) addSupplyFromNeeds(data, materials, 'SETTLER')
  if (buildingData.Technicians)
    addSupplyFromNeeds(data, materials, 'TECHNICIAN')
  if (buildingData.Engineers) addSupplyFromNeeds(data, materials, 'ENGINEER')
  if (buildingData.Scientists) addSupplyFromNeeds(data, materials, 'SCIENTIST')
  return materials
}

const getWorkforceSupplyForBuildings = (
  data: GameData,
  buildings: string[],
) => {
  const materials = new Set<string>()
  for (const building of buildings) {
    const buildingMaterials = getWorkforceSupply(data, building)
    if (buildingMaterials) {
      for (const material of buildingMaterials) {
        materials.add(material)
      }
    }
  }
  return materials
}

export const validateContract = (
  data: GameData,
  contract: Contract,
  allPlans: UserPlan[],
) => {
  const result: ContractValidationResult = {}
  if (
    !contract.Tags.includes(ContractTags.PRICE_TOO_LOW) ||
    contract.Type !== 'BUYING'
  ) {
    result.isRequest = false
    return result
  }

  result.isRequest = true

  const location = contract.Conditions.find(c => c.Address)?.Address

  if (!location) {
    return result
  }

  const contractPlanetId = normalizeAddress(location)

  const plan = allPlans.find(plan => plan.planetId === contractPlanetId)

  if (!plan) {
    return result
  }

  result.hasPlan = true

  const allMaterials = new Set<string>()
  for (const cond of contract.Conditions) {
    if (cond.MaterialTicker) {
      allMaterials.add(cond.MaterialTicker)
    }
  }

  if (allMaterials.isSubsetOf(new Set(plan.inputs))) {
    result.matchPlan = true
    return result
  }

  const workforceSupply = getWorkforceSupplyForBuildings(data, plan.buildings)
  if (allMaterials.isSubsetOf(workforceSupply)) {
    result.matchPlan = true
  }

  return result
}
