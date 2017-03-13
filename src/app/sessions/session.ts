export class Session {
  constructor(
    public id: number,
    public start: string,
    public end: string,
    public card: number,
    public duration: number,
    is_active: boolean) { }
}
