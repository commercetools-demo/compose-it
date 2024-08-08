declare module '@commercetools/sync-actions' {
  export type SyncAction = { action: string; [x: string]: unknown };
  function buildActions<NextDraft, OriginalDraft>(
    nextDraft: NextDraft,
    originalDraft: OriginalDraft
  ): SyncAction[];
  export type Syncer = {
    buildActions: typeof buildActions;
  };
  export function createSyncChannels(): Syncer;
  export function createSyncAttributeGroups(): Syncer;
  export function createSyncCartDiscounts(): Syncer;
  export function createSyncCategories(): Syncer;
  export function createSyncChannels(): Syncer;
  export function createSyncCustomerGroup(): Syncer;
  export function createSyncCustomers(): Syncer;
  export function createSyncDiscountCodes(): Syncer;
  export function createSyncInventories(): Syncer;
  export function createSyncOrders(): Syncer;
  export function createSyncProductDiscounts(): Syncer;
  export function createSyncProductSelections(): Syncer;
  export function createSyncProductTypes(): Syncer;
  export function createSyncProducts(): Syncer;
  export function createSyncProjects(): Syncer;
  export function createSyncShippingMethods(): Syncer;
  export function createSyncStandalonePrices(): Syncer;
  export function createSyncStates(): Syncer;
  export function createSyncStores(): Syncer;
  export function createSyncTaxCategories(): Syncer;
  export function createSyncTypes(): Syncer;
  export function createSyncZones(): Syncer;
}
