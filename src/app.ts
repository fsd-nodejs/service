import { Application } from 'midway'


export default (app: Application) => {
  app.config.coreMiddleware.unshift('errorHandler')
}
