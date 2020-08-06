export default class MyError extends Error {

  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }

}
