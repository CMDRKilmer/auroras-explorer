
-- export interface Contract {
--   Conditions: UserContractCondition[]
--   ContractId: string
--   ContractLocalId: string
--   DateEpochMs: number
--   ExtensionDeadlineEpochMs: number | null
--   DueDateEpochMs: number | null
--   CanExtend: boolean
--   CanRequestTermination: boolean
--   TerminationSent: boolean
--   TerminationReceived: boolean
--   Name: string
--   Preamble: string
--   Status: string

--   CustomerUsername: string
--   ProviderUsername: string
--   Type: string
--   Timestamp: string // when the contract was submitted by the user
--   CreatedAt: string // when the contract was created in the server database
--   UpdatedAt: string // when the contract was synced to the server
--   LastSubmittedBy: string
-- }

CREATE TABLE IF NOT EXISTS "contracts" (
  "ContractId" TEXT PRIMARY KEY,
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
  "Status" TEXT,
  "CustomerUsername" TEXT NOT NULL,
  "ProviderUsername" TEXT NOT NULL,
  "Type" TEXT,
  "Timestamp" TIMESTAMP,
  "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "LastSubmittedBy" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_contracts_ContractLocalId" ON "contracts" ("ContractLocalId");
CREATE INDEX IF NOT EXISTS "idx_contracts_CustomerUsername" ON "contracts" ("CustomerUsername");
CREATE INDEX IF NOT EXISTS "idx_contracts_ProviderUsername" ON "contracts" ("ProviderUsername");
CREATE INDEX IF NOT EXISTS "idx_contracts_Status" ON "contracts" ("Status");
CREATE INDEX IF NOT EXISTS "idx_contracts_Type" ON "contracts" ("Type");
CREATE INDEX IF NOT EXISTS "idx_contracts_DateEpochMs" ON "contracts" ("DateEpochMs");
