export const getContractStatusLabel = (status: string) => {
  if (status === 'PARTIALLY_FULFILLED') {
    return 'partial'
  }
  return status.toLowerCase().replaceAll('_', ' ')
}
