export interface WorkItem {
  org: string;
  role: string;
  start: string;
  end?: string;
  location?: string;
  logo?: string;
}

export const work: WorkItem[] = [];
