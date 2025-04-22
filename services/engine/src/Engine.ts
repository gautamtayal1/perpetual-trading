export class Engine {
  public static instance: Engine

  private constructor() {

  }

  public static getInstance(): Engine {
    if(!this.instance) {
      this.instance = new Engine()
    }
    return this.instance
  }

}