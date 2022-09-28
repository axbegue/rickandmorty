export class MathHelper {
  private static readonly decimales: number = 2;
  
  public static round(d: number): number
  public static round(d: number, decimalPlace: number): number
  public static round(d: number, decimalPlace?: number): number {
    let factor: number = 1;
    if (decimalPlace !== undefined) {
      factor = Math.pow(10, decimalPlace);
    } else {
      factor = Math.pow(10, this.decimales);
    }
    return Math.round(d * factor ) / factor;
  }
  
  public static roundUp(d: number): number
  public static roundUp(d: number, decimalPlace: number): number
  public static roundUp(d: number, decimalPlace?: number): number {
    let factor: number = 1;
    d += 0.5;
    if (decimalPlace !== undefined) {
      factor = Math.pow(10, decimalPlace);
    } else {
      factor = Math.pow(10, this.decimales);
    }
    return Math.round(d * factor ) / factor;
  }
}
