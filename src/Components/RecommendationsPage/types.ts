export type Recommendation = {
  id: string;
  description: string;
  publish_date: Date;
  systems: number;
  remediation: string;
};

export type Resolution = {
  id: string;
  description: string;
  needs_reboot: boolean;
  resolution_risk: number;
};
