import { describe, expect, it } from 'vitest'
import type { Contract } from '@/lib/api/types'
import { ContractMatcher } from '@/lib/game/match-contract'
import buyingContract from './data/buying-contract.json'
import sellingContract from './data/selling-contract.json'
import shipmentContract from './data/shipment-contract.json'

describe('match contract', () => {
  it('should match buying contract correctly', () => {
    const { Conditions } = buyingContract as unknown as Contract

    const matcher = new ContractMatcher(Conditions)
    matcher.match()
    expect(matcher.type).toBe('BUYING')
    expect(matcher.tradings.length).toBe(5)
    expect(matcher.tradings[0]).toEqual({
      ticker: 'COF',
      quantity: 21,
      currency: 'ICA',
      totalPrice: 1,
    })
  })

  it('should match selling contract correctly', () => {
    const { Conditions } = sellingContract as unknown as Contract

    const matcher = new ContractMatcher(Conditions)
    matcher.match()
    expect(matcher.type).toBe('SELLING')
    expect(matcher.tradings.length).toBe(4)
    expect(matcher.tradings[0]).toEqual({
      ticker: 'LBH',
      quantity: 30,
      currency: 'ICA',
      totalPrice: 22500,
    })
  })

  it('should match shipment contract correctly', () => {
    const { Conditions } = shipmentContract as unknown as Contract

    const matcher = new ContractMatcher(Conditions)
    matcher.match()
    expect(matcher.type).toBe('SHIPMENT')
  })
})
