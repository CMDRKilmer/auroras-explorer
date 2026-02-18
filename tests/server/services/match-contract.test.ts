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
  })

  it('should match selling contract correctly', () => {
    const { Conditions } = sellingContract as unknown as Contract

    const matcher = new ContractMatcher(Conditions)
    matcher.match()
    expect(matcher.type).toBe('SELLING')
  })

  it('should match shipment contract correctly', () => {
    const { Conditions } = shipmentContract as unknown as Contract

    const matcher = new ContractMatcher(Conditions)
    matcher.match()
    expect(matcher.type).toBe('SHIPMENT')
  })
})
