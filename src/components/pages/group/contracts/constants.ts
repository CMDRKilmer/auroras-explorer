export const TypesMap: Record<string, string[]> = {
  All: ['TRADING', 'BUYING', 'SELLING', 'SHIPMENT'],
  Trading: ['TRADING', 'BUYING', 'SELLING'],
  Shipment: ['SHIPMENT'],
}

export const StatusMap: Record<string, string[]> = {
  All: [],
  Open: ['OPEN'],
  Closed: ['CLOSED'],
  Fulfilled: ['FULFILLED'],
  Partial: ['PARTIALLY_FULFILLED'],
  Cancelled: ['CANCELLED'],
  Terminated: ['TERMINATED'],
  Rejected: ['REJECTED'],
  Breached: ['BREACHED'],
}
