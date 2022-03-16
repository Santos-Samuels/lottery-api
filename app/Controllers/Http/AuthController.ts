import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const user = await User.findBy('email', email)
      const token = await auth
        .use('api')
        .attempt(email, password, { expiresIn: '50mins', name: user?.serialize().email })

      const formatedUser = user?.serialize()
      const userInfo = {
        id: formatedUser?.id,
        email: formatedUser?.email,
        created_at: formatedUser?.created_at,
        updated_at: formatedUser?.created_at,
      }

      return { token, user: userInfo }
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }
}
