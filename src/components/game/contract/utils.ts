import type { Contract } from '@/lib/api'

export const getContractStatusLabel = (contract: Contract) => {
  if (contract.Status === 'PARTIALLY_FULFILLED') {
    const fulfilledCount = contract.Conditions.filter(
      c => c.Status === 'FULFILLED',
    ).length
    return `partial (${fulfilledCount}/${contract.Conditions.length})`
  }
  return contract.Status.toLowerCase().replaceAll('_', ' ')
}
