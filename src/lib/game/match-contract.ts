import type { UserContractConditionPO } from '@/server/store/type'

interface Trading {
  ticker: string
  quantity: number
  currency: string
  totalPrice: number
}

interface ShipmentItem {
  currency: string
  totalPrice: number
  from: string
  to: string
  volume: number
  weight: number
}

export class ContractMatcher {
  index = 0
  tradings: Trading[] = []
  shipments: ShipmentItem[] = []
  type: string = ''
  patterns: ContractPatternMatcher[] = [
    matchBuyingContractPattern,
    matchSellingContractPattern,
    matchShipmentContractPattern,
  ]

  constructor(public conditions: UserContractConditionPO[]) {}

  consume(): UserContractConditionPO | undefined {
    return this.conditions[this.index++]
  }

  reset() {
    this.index = 0
    this.tradings = []
  }

  tryMatch(matcher: ContractPatternMatcher) {
    while (this.index < this.conditions.length) {
      const ok = matcher.match(this)
      if (!ok) return false
    }
    this.type = matcher.name
    return true
  }

  match() {
    for (const matcher of this.patterns) {
      this.reset()
      if (this.tryMatch(matcher)) {
        return true
      }
    }
    return false
  }
}

interface ContractPatternMatcher {
  name: string
  match(matcher: ContractMatcher): boolean
}

const matchBuyingContractPattern: ContractPatternMatcher = {
  name: 'BUYING',
  match(matcher) {
    const [a, b] = [matcher.consume(), matcher.consume()]
    if (
      a &&
      a.Party === 'PROVIDER' &&
      a.Type === 'PAYMENT' &&
      a.Currency &&
      a.Amount &&
      b &&
      b.Party === 'CUSTOMER' &&
      b.Type === 'DELIVERY' &&
      b.MaterialTicker &&
      b.MaterialAmount
    ) {
      matcher.tradings.push({
        ticker: b.MaterialTicker,
        quantity: b.Amount,
        currency: a.Currency,
        totalPrice: a.Amount,
      })
      return true
    }
    return false
  },
}

const matchSellingContractPattern: ContractPatternMatcher = {
  name: 'SELLING',
  match: matcher => {
    const [a, b, c] = [matcher.consume(), matcher.consume(), matcher.consume()]
    if (
      a &&
      a.Party === 'PROVIDER' &&
      a.Type === 'PROVISION' &&
      a.MaterialTicker &&
      a.MaterialAmount &&
      b &&
      b.Party === 'CUSTOMER' &&
      b.Type === 'PAYMENT' &&
      b.Currency &&
      b.Amount &&
      c &&
      c.Party === 'CUSTOMER' &&
      c.Type === 'COMEX_PURCHASE_PICKUP' &&
      c.MaterialTicker &&
      c.MaterialAmount &&
      a.MaterialTicker === c.MaterialTicker &&
      a.MaterialAmount === c.MaterialAmount
    ) {
      matcher.tradings.push({
        ticker: a.MaterialTicker,
        quantity: a.MaterialAmount,
        currency: b.Currency,
        totalPrice: b.Amount,
      })
      return true
    }
    return false
  },
}

const matchShipmentContractPattern: ContractPatternMatcher = {
  name: 'SHIPMENT',
  match: matcher => {
    const [a, b, c, d] = [
      matcher.consume(),
      matcher.consume(),
      matcher.consume(),
      matcher.consume(),
    ]
    if (
      a &&
      a.Party === 'PROVIDER' &&
      a.Type === 'PROVISION_SHIPMENT' &&
      a.Address &&
      a.Weight &&
      a.Volume &&
      b &&
      b.Party === 'PROVIDER' &&
      b.Type === 'PAYMENT' &&
      b.Amount &&
      b.Currency &&
      c &&
      c.Party === 'CUSTOMER' &&
      c.Type === 'PICKUP_SHIPMENT' &&
      c.Address &&
      c.Weight &&
      c.Volume &&
      c.Dependencies.includes(a.ConditionId) &&
      d &&
      d.Party === 'CUSTOMER' &&
      d.Type === 'DELIVERY_SHIPMENT' &&
      d.Destination &&
      d.Dependencies.includes(c.ConditionId)
    ) {
      matcher.shipments.push({
        currency: b.Currency,
        totalPrice: b.Amount,
        from: a.Address,
        to: d.Destination,
        volume: a.Volume,
        weight: a.Weight,
      })
      return true
    }
    return false
  },
}
