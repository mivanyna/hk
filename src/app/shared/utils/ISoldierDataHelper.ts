import { ISoldierData } from '../ISoldierData'

export class ISoldierDataHelper {
  public static isOfficer(data: ISoldierData) {
    return (data.rank?.includes('солдат') || data.rank?.includes('сержант')) ? 0 : 1
  }
}
