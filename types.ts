
export enum CostScenario {
  LOW = 'Economy/Budget',
  MID = 'Standard/Market',
  HIGH = 'Premium/Luxury'
}

export enum ShellDeliveryType {
  DARK_SHELL = 'Cold/Dark Shell',
  WARM_SHELL = 'Warm Shell',
  VANILLA_BOX = 'Vanilla Box (White Box)'
}

export enum DemolitionType {
  SITE_ONLY = 'Site Demolition Only',
  BUILDING_ONLY = 'Building Demolition Only',
  BOTH = 'Site and Building Demolition'
}

export enum SitePrepType {
  GRADING = 'Grading and Compaction',
  STUBS_PAD = 'Utility Stubs to Building Pad',
  STUBS_LOT = 'Utility Stubs to Lot Line'
}

export interface ProjectFile {
  name: string;
  type: string;
  data: string; // base64
}

export interface ProjectParams {
  id?: string;
  timestamp?: number;
  name: string;
  
  // Area Parameters
  existingSqft: number;
  existingSiteSqft: number;
  siteSqft: number;
  proposedSqft: number;
  scenario: CostScenario;
  location: string;
  
  includeDemolition: boolean;
  demolitionTypes: DemolitionType[];
  includeSitePrep: boolean;
  sitePrepTypes: SitePrepType[];
  includeStructure: boolean;      
  shellDelivery: ShellDeliveryType; 
  includeInterior: boolean;       
  includeCustomScope: boolean;
  
  customScope?: string;
  files: ProjectFile[];
}

export interface LineItem {
  id: string;
  name: string;
  amount: number;
  included: boolean;
}

export interface BudgetCategory {
  id: string;
  name: string;
  amount: number; // Original suggested amount
  percentage: number;
  items: LineItem[];
}

export interface RecommendedScope {
  name: string;
  importance: string;
  suggestedCostRange: string;
}

export interface BudgetResult {
  totalCost: number;
  siteCostPerSqFt: number; 
  shellCostPerSqFt: number; 
  categories: BudgetCategory[];
  expertAdvice: string;
  recommendedScopes: RecommendedScope[];
  riskFactors: string[];
  timelineWeeks: number;
  costIndex?: number;
  neededFiles?: string[];
  lastUpdated?: number;
}
