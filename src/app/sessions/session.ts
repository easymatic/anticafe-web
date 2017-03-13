export class Session {
  constructor(
    public id: number,
    public start: string,
    public end: string,
    public card: number,
    public duration: string,
    public costInRub: number,
    public cost: number,
    public durationInSec: number,
    public is_active: boolean) { }
}
