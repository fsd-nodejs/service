import { Application } from 'midway'
import { DB } from '@/app/model/db'


export default (app: Application) => {
  app.beforeStart(async () => {
    // eslint-disable-next-line no-console
    console.log('🚀 Your awesome APP is launching...')

    await DB.initDB(app.config.sequelize)

    // eslint-disable-next-line no-console
    console.log('✅  Your awesome APP launched')

  })
  app.config.coreMiddleware.unshift('errorHandler')
}
