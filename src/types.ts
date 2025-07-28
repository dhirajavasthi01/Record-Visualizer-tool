

export type AggregatedData = {
  name: string;
  cost: number;
};

export interface CostRecord {
  id: number;
  date: string;
  department: string;
  service: string;
  cost: number;
  currency: string;
  region: string;
  projectName: string;
  category: string;
  resourceType: string;
}
