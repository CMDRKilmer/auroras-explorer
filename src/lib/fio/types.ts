// "OrderId": "e1576e85a7c6543847a7f478528817ea",
// "CompanyId": "68d282e10b2650dee8c75ff76cb16d38",
// "CompanyName": "Lumber Liquidators",
// "CompanyCode": "MM",
// "ItemCount": 100,
// "ItemCost": 410.0
export interface Order {
  OrderId: string
  CompanyId: string
  CompanyName: string
  CompanyCode: string
  ItemCount: number
  ItemCost: number
}

// "CXDataModelId": "0037f5f779eb63ac545af0d5c1744061",
// "MaterialName": "zircon",
// "MaterialTicker": "ZIR",
// "MaterialId": "82583e13472538b113667abc82421bda",
// "ExchangeName": "Moria Station Commodity Exchange",
// "ExchangeCode": "NC1",
// "Currency": "NCC",
// "Previous": null,
// "Price": 888.0,
// "PriceTimeEpochMs": 1767968133317,
// "High": 888.0,
// "AllTimeHigh": 4000.0,
// "Low": 888.0,
// "AllTimeLow": 29.299999237060547,
// "Ask": 888.0,
// "AskCount": 919,
// "Bid": 410.0,
// "BidCount": 100,
// "Supply": 6658,
// "Demand": 5487,
// "Traded": 0,
// "VolumeAmount": 0.0,
// "PriceAverage": 888.0,
// "NarrowPriceBandLow": 88.80000305175781,
// "NarrowPriceBandHigh": 2220.0,
// "WidePriceBandLow": 88.80000305175781,
// "WidePriceBandHigh": 2220.0,
// "MMBuy": null,
// "MMSell": null,
// "UserNameSubmitted": "VALMARUS",
// "Timestamp": "2026-01-14T16:20:22.172754Z"
export interface TradingSummary {
  BuyingOrders: Order[]
  SellingOrders: Order[]
  CXDataModelId: string
  MaterialName: string
  MaterialTicker: string
  MaterialId: string
  ExchangeName: string
  ExchangeCode: string
  Currency: string
  Previous: number | null
  Price: number
  PriceTimeEpochMs: number
  High: number
  AllTimeHigh: number
  Low: number
  AllTimeLow: number
  Ask: number
  AskCount: number
  Bid: number
  BidCount: number
  Supply: number
  Demand: number
  Traded: number
  VolumeAmount: number
  PriceAverage: number
  NarrowPriceBandLow: number
  NarrowPriceBandHigh: number
  WidePriceBandLow: number
  WidePriceBandHigh: number
  MMBuy: number | null
  MMSell: number | null
  UserNameSubmitted: string
  Timestamp: string
}

// "MaterialId": "e73f2311d23a1dc4e096d2cf389e5ee2",
// "CategoryName": "ship shields",
// "CategoryId": "a8e32e7e16219394989aea62fc0cd943",
// "Name": "advancedRadiationShielding",
// "Ticker": "ARP",
// "Weight": 0.03999999910593033,
// "Volume": 0.20000000298023224,
// "UserNameSubmitted": "TAIYI",
// "Timestamp": "2026-01-14T15:35:56.779516Z"

export interface Material {
  CategoryId: string
  CategoryName: string
  MaterialId: string
  Name: string
  Ticker: string
  Timestamp: string
  UserNameSubmitted: string
  Volume: number
  Weight: number
}

// [
//   {
//     "BuildingTicker": "RIG",
//     "RecipeName": "=\u003E",
//     "StandardRecipeName": "RIG:=\u003E",
//     "Inputs": [],
//     "Outputs": [],
//     "TimeMs": 17280000
//   },
//   {
//     "BuildingTicker": "TNP",
//     "RecipeName": "1xTC 4xREA 4xFLX=\u003E1xETC",
//     "StandardRecipeName": "TNP:4xFLX-4xREA-1xTC=\u003E1xETC",
//     "Inputs": [
//       {
//         "Ticker": "TC",
//         "Amount": 1
//       },
//       {
//         "Ticker": "REA",
//         "Amount": 4
//       },
//       {
//         "Ticker": "FLX",
//         "Amount": 4
//       }
//     ],
//     "Outputs": [
//       {
//         "Ticker": "ETC",
//         "Amount": 1
//       }
//     ],
//     "TimeMs": 69120000
//   },
export interface RecipeItem {
  Ticker: string
  Amount: number
}

export interface Recipe {
  BuildingTicker: string
  RecipeName: string
  StandardRecipeName: string
  Inputs: RecipeItem[]
  Outputs: RecipeItem[]
  TimeMs: number
}

// "ComexExchangeId": "428b9f5cf86d62bbb29f9485f10a88d3",
// "ExchangeName": "Hortus Station Commodity Exchange",
// "ExchangeCode": "IC1",
// "ExchangeOperatorId": null,
// "ExchangeOperatorCode": null,
// "ExchangeOperatorName": null,
// "CurrencyNumericCode": 5,
// "CurrencyCode": "ICA",
// "CurrencyName": "Austral",
// "CurrencyDecimals": 2,
// "LocationId": "0deca369a92788b8079e7ac245be66f7",
// "LocationName": "Hortus Station",
// "LocationNaturalId": "HRT"

export interface CommodityExchange {
  ComexExchangeId: string
  ExchangeName: string
  ExchangeCode: string
  ExchangeOperatorId: string | null
  ExchangeOperatorCode: string | null
  ExchangeOperatorName: string | null
  CurrencyNumericCode: number
  CurrencyCode: string
  CurrencyName: string
  CurrencyDecimals: number
  LocationId: string
  LocationName: string
  LocationNaturalId: string
}

// "BuildingCosts": [
//   {
//     "CommodityName": "basicStructuralElements",
//     "CommodityTicker": "BSE",
//     "Weight": 0.30000001192092896,
//     "Volume": 0.5,
//     "Amount": 12
//   }
// ],
// "Recipes": [
//   {
//     "Inputs": [],
//     "Outputs": [],
//     "BuildingRecipeId": "@RIG=>",
//     "DurationMs": 17280000,
//     "RecipeName": "=>",
//     "StandardRecipeName": "RIG:=>"
//   }
// ],
// "BuildingId": "00e3d3d9ac2fc9ba7cac62519915dc43",
// "Name": "rig",
// "Ticker": "RIG",
// "Expertise": "RESOURCE_EXTRACTION",
// "Pioneers": 30,
// "Settlers": 0,
// "Technicians": 0,
// "Engineers": 0,
// "Scientists": 0,
// "AreaCost": 10,
// "UserNameSubmitted": "SAGANAKI",
// "Timestamp": "2025-05-08T12:49:39.054422Z"

export interface BuildingCost {
  CommodityName: string
  CommodityTicker: string
  Weight: number
  Volume: number
  Amount: number
}

export interface Building {
  BuildingCosts: BuildingCost[]
  Recipes: Recipe[]
  BuildingId: string
  Name: string
  Ticker: string
  Expertise: string
  Pioneers: number
  Settlers: number
  Technicians: number
  Engineers: number
  Scientists: number
  AreaCost: number
  UserNameSubmitted: string
  Timestamp: string
}

// "Dependencies": [],
// "Address": null,
// "MaterialId": null,
// "MaterialTicker": null,
// "MaterialAmount": null,
// "Weight": 0,
// "Volume": 0,
// "BlockId": null,
// "Type": "PAYMENT",
// "ConditionId": "17f4c0415594c6ddadbf2ab0ca3efc41",
// "Party": "PROVIDER",
// "ConditionIndex": 0,
// "Status": "PENDING",
// "DeadlineDurationMs": null,
// "DeadlineEpochMs": null,
// "Amount": 1,
// "Currency": "ICA",
// "Destination": null,
// "ShipmentItemId": null,
// "PickedUpMaterialId": null,
// "PickedUpMaterialTicker": null,
// "PickedUpAmount": null,
// "InterestAmount": null,
// "InterestCurrency": null,
// "RepaymentAmount": null,
// "RepaymentCurrency": null,
// "TotalAmount": null,
// "TotalCurrency": null
export interface UserContractCondition {
  Dependencies: {
    Dependency: string
  }[]
  Address: string | null
  MaterialId: string | null
  MaterialTicker: string | null
  MaterialAmount: number | null
  Weight: number
  Volume: number
  BlockId: string | null
  Type: string
  ConditionId: string
  Party: string
  ConditionIndex: number
  Status: string
  DeadlineDurationMs: number | null
  DeadlineEpochMs: number | null
  Amount: number
  Currency: string
  Destination: string | null
  ShipmentItemId: string | null
  PickedUpMaterialId: string | null
  PickedUpMaterialTicker: string | null
  PickedUpAmount: number | null
  InterestAmount: number | null
  InterestCurrency: string | null
  RepaymentAmount: number | null
  RepaymentCurrency: string | null
  TotalAmount: number | null
  TotalCurrency: string | null
}

// "Conditions": [],
// "ContractId": "33c909ae4ba8f9bc663d8ca5dae4a0df",
// "ContractLocalId": "0XD2RH9",
// "DateEpochMs": 1770903024981,
// "ExtensionDeadlineEpochMs": null,
// "DueDateEpochMs": null,
// "CanExtend": false,
// "CanRequestTermination": true,
// "TerminationSent": false,
// "TerminationReceived": false,
// "Name": "SNGP-OF375c-4d",
// "Preamble": "",
// "Party": "PROVIDER",
// "Status": "OPEN",
// "PartnerId": "6a246f61d0315e1f90f9c89d35f9d508",
// "PartnerName": "RestAurantCn",
// "PartnerCompanyCode": "RACN",
// "UserNameSubmitted": "IVY_EXE",
// "Timestamp": "2026-02-12T13:30:25.532137Z"

export interface UserContract {
  Conditions: UserContractCondition[]
  ContractId: string
  ContractLocalId: string
  DateEpochMs: number
  ExtensionDeadlineEpochMs: number | null
  DueDateEpochMs: number | null
  CanExtend: boolean
  CanRequestTermination: boolean
  TerminationSent: boolean
  TerminationReceived: boolean
  Name: string
  Preamble: string
  Party: string
  Status: string
  PartnerId: string
  PartnerName: string
  PartnerCompanyCode: string
  UserNameSubmitted: string
  Timestamp: string
}

export interface Group {
  GroupAdmins: {
    GroupAdminUserName: string
  }[]
  GroupUsers: {
    GroupUserName: string
  }[]
}

// {
//   "Balances": null,
//   "Planets": [
//     {
//       "PlanetId": "cb158c1405b3b25c7490eb874fef777a",
//       "PlanetNaturalId": "VH-331b",
//       "PlanetName": "VH-331b"
//     },
//   ],
//   "Offices": [
//     {
//       "PlanetNaturalId": "IA-158d",
//       "PlanetName": "IA-158d",
//       "StartEpochMs": 1764977250642,
//       "EndEpochMs": 1767396450642
//     }
//   ],
//   "UserDataId": "9696def7589d878d58dd15ed43091de3",
//   "UserId": "f0370f4ab8abdc24dbe37ad04fde5c5c",
//   "UserName": "YuLun",
//   "SubscriptionLevel": "PRO",
//   "Tier": "GALAXY",
//   "Team": false,
//   "Pioneer": false,
//   "Moderator": false,
//   "CreatedEpochMs": 1651976575303,
//   "CompanyId": "9696def7589d878d58dd15ed43091de3",
//   "CompanyName": "YuLun Group",
//   "CompanyCode": "YLG",
//   "CountryId": "4a2fe1ae3e1ca07dcfebbdf25c4b8d6a",
//   "CountryCode": "IC",
//   "CountryName": "Insitor Cooperative",
//   "CorporationId": "737ec7bb539a636c6b16a05d09624f80",
//   "CorporationName": "華龍集团 - Hua Loong Group",
//   "CorporationCode": "HLG",
//   "OverallRating": "A",
//   "ActivityRating": null,
//   "ReliabilityRating": null,
//   "StabilityRating": null,
//   "HeadquartersNaturalId": null,
//   "HeadquartersLevel": -1,
//   "HeadquartersBasePermits": -1,
//   "HeadquartersUsedBasePermits": -1,
//   "AdditionalBasePermits": -1,
//   "AdditionalProductionQueueSlots": -1,
//   "RelocationLocked": false,
//   "NextRelocationTimeEpochMs": 0,
//   "UserNameSubmitted": "IVY_EXE",
//   "Timestamp": "2026-02-14T13:22:21.007925Z"
// }

export interface Planet {
  PlanetId: string
  PlanetNaturalId: string
  PlanetName: string
}

export interface Office {
  PlanetNaturalId: string
  PlanetName: string
  StartEpochMs: number
  EndEpochMs: number
}

export interface Company {
  Planets: Planet[]
  Offices: Office[]
  UserDataId: string
  UserId: string
  UserName: string
  SubscriptionLevel: string
  Tier: string | null
  Team: boolean
  Pioneer: boolean
  Moderator: boolean
  CreatedEpochMs: number
  CompanyId: string
  CompanyName: string
  CompanyCode: string
  CountryId: string
  CountryCode: string
  CountryName: string
  CorporationId: string
  CorporationName: string
  CorporationCode: string
  OverallRating: string
  ActivityRating: string | null
  ReliabilityRating: string | null
  StabilityRating: string | null
  HeadquartersNaturalId: string | null
  HeadquartersLevel: number
  HeadquartersBasePermits: number
  HeadquartersUsedBasePermits: number
  AdditionalBasePermits: number
  AdditionalProductionQueueSlots: number
  RelocationLocked: boolean
  NextRelocationTimeEpochMs: number
  UserNameSubmitted: string
  Timestamp: string
}
