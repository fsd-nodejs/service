export default class MyError extends Error {

  status: number
  // eslint-disable-next-line lines-between-class-members
  errors: any[]

  constructor(message: string, status: number, errors: any[]) {
    super(message)
    this.status = status
    this.errors = errors
  }

}
