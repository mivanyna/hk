export interface IPlanItem {
  milUnit: string
  planTotal: number
  planOfficers?: number
}

export interface ICompletedPlan extends IPlanItem {
  serv?: number
  servOfficers?: number
}
