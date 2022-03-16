import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { SignupUser, SigninUser } from 'App/Validators'

export default class AuthController {
  public async signup({ auth, request, response }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password'])
    await request.validate(SignupUser)
    const existentUser = await User.findBy('email', data.email)

    if (existentUser) {
      return response.status(400).json({ error: { message: 'Email already exists' } })
    }

    const user = await User.create(data)
    const token = await auth.use('api').attempt(data.email, data.password, {
      expiresIn: '7days',
    })

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
      updated_at: user.createdAt,
    }

    return { userInfo, token }
  }

  public async signin({ auth, request, response }: HttpContextContract) {
    const data = request.only(['email', 'password'])
    await request.validate(SigninUser)

    try {
      const user = await User.findBy('email', data.email)
      const token = await auth
        .use('api')
        .attempt(data.email, data.password, { expiresIn: '7days', name: user?.serialize().email })

      const formatedUser = user?.serialize()
      const userInfo = {
        id: formatedUser?.id,
        name: formatedUser?.name,
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
