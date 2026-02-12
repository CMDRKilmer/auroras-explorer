CREATE DATABASE prun;

CREATE TABLE IF NOT EXISTS "fio_user_contracts" (
  "ContractId" TEXT NOT NULL,
  "ContractLocalId" TEXT NOT NULL,
  "DateEpochMs" BIGINT NOT NULL,
  "ExtensionDeadlineEpochMs" BIGINT,
  "DueDateEpochMs" BIGINT,
  "CanExtend" BOOLEAN,
  "CanRequestTermination" BOOLEAN,
  "TerminationSent" BOOLEAN,
  "TerminationReceived" BOOLEAN,
  "Name" TEXT,
  "Preamble" TEXT,
  "Party" TEXT,
  "Status" TEXT,
  "PartnerId" TEXT,
  "PartnerName" TEXT,
  "PartnerCompanyCode" TEXT,
  "UserNameSubmitted" TEXT NOT NULL,
  "Timestamp" TIMESTAMP,
  "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("ContractId", "UserNameSubmitted")
);

CREATE INDEX IF NOT EXISTS "idx_fio_user_contracts_ContractId" ON "fio_user_contracts" ("ContractId");
CREATE INDEX IF NOT EXISTS "idx_fio_user_contracts_ContractLocalId" ON "fio_user_contracts" ("ContractLocalId");
CREATE INDEX IF NOT EXISTS "idx_fio_user_contracts_PartnerId" ON "fio_user_contracts" ("PartnerId");
CREATE INDEX IF NOT EXISTS "idx_fio_user_contracts_Status" ON "fio_user_contracts" ("Status");
CREATE INDEX IF NOT EXISTS "idx_fio_user_contracts_Party" ON "fio_user_contracts" ("Party");
CREATE INDEX IF NOT EXISTS "idx_fio_user_contracts_UserNameSubmitted" ON "fio_user_contracts" ("UserNameSubmitted");

-- export interface ContractCondition {
--   Dependencies: string[]
--   Address: string | null
--   MaterialId: string | null
--   MaterialTicker: string | null
--   MaterialAmount: number | null
--   Weight: number
--   Volume: number
--   BlockId: string | null
--   Type: string
--   ConditionId: string
--   Party: string
--   ConditionIndex: number
--   Status: string
--   DeadlineDurationMs: number | null
--   DeadlineEpochMs: number | null
--   Amount: number
--   Currency: string
--   Destination: string | null
--   ShipmentItemId: string | null
--   PickedUpMaterialId: string | null
--   PickedUpMaterialTicker: string | null
--   PickedUpAmount: number | null
--   InterestAmount: number | null
--   InterestCurrency: string | null
--   RepaymentAmount: number | null
--   RepaymentCurrency: string | null
--   TotalAmount: number | null
--   TotalCurrency: string | null
-- }
CREATE TABLE IF NOT EXISTS "fio_user_contract_conditions" (
  "ConditionId" TEXT NOT NULL,
  "ContractId" TEXT NOT NULL,
  "UserNameSubmitted" TEXT NOT NULL,
  "Dependencies" TEXT[],
  "Address" TEXT,
  "MaterialId" TEXT,
  "MaterialTicker" TEXT,
  "MaterialAmount" BIGINT,
  "Weight" DOUBLE PRECISION,
  "Volume" DOUBLE PRECISION,
  "BlockId" TEXT,
  "Type" TEXT NOT NULL,
  "Party" TEXT NOT NULL,
  "ConditionIndex" INTEGER NOT NULL,
  "Status" TEXT NOT NULL,
  "DeadlineDurationMs" BIGINT,
  "DeadlineEpochMs" BIGINT,
  "Amount" DOUBLE PRECISION,
  "Currency" TEXT,
  "Destination" TEXT,
  "ShipmentItemId" TEXT,
  "PickedUpMaterialId" TEXT,
  "PickedUpMaterialTicker" TEXT,
  "PickedUpAmount" BIGINT,
  "InterestAmount" DOUBLE PRECISION,
  "InterestCurrency" TEXT,
  "RepaymentAmount" DOUBLE PRECISION,
  "RepaymentCurrency" TEXT,
  "TotalAmount" DOUBLE PRECISION,
  "TotalCurrency" TEXT,
  "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("ConditionId", "UserNameSubmitted")
);

CREATE INDEX IF NOT EXISTS "idx_fio_user_contract_conditions_ContractId" ON "fio_user_contract_conditions" ("ContractId");
CREATE INDEX IF NOT EXISTS "idx_fio_user_contract_conditions_ConditionId" ON "fio_user_contract_conditions" ("ConditionId");
CREATE INDEX IF NOT EXISTS "idx_fio_user_contract_conditions_Type" ON "fio_user_contract_conditions" ("Type");
CREATE INDEX IF NOT EXISTS "idx_fio_user_contract_conditions_Party" ON "fio_user_contract_conditions" ("Party");
CREATE INDEX IF NOT EXISTS "idx_fio_user_contract_conditions_Status" ON "fio_user_contract_conditions" ("Status");
CREATE INDEX IF NOT EXISTS "idx_fio_user_contract_conditions_MaterialTicker" ON "fio_user_contract_conditions" ("MaterialTicker");
