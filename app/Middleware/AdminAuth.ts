import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission'
import User from 'App/Models/User'

export default class AdminAuth {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const { id } = await auth.use('api').authenticate()
    const user = await User.findBy('id', id)
    const permission = await Permission.findBy('id', user!.permissionId)

    if (permission?.name != 'admin')
      return response.status(401).json({ error: { message: "User not allowed for this action." } })
    
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
