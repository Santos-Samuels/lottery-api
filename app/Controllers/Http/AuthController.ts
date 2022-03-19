import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { SignupUser, SigninUser, UpdateUser } from 'App/Validators'

export default class AuthController {
  public async index({ auth, request, response }: HttpContextContract) {
    const data = request.only(['email', 'password'])
    await request.validate(SigninUser)

    try {
      const user = await User.findBy('email', data.email)
      const token = await auth
        .use('api')
        .attempt(data.email, data.password, { expiresIn: '7days', name: user?.serialize().email })

      return { token, user }
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password'])
    await request.validate(SignupUser)
    const existentUser = await User.findBy('email', data.email)

    if (existentUser) {
      return response.status(400).json({ error: { message: 'There is already a user with this email' } })
    }

    const user = await User.create(data)
    const token = await auth.use('api').attempt(data.email, data.password, {
      expiresIn: '7days',
    })

    return { user, token }
  }

  public async show({ auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const user = await User.findBy('id', id)
    
    return user
  }

  public async update({ auth, request, response }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const user = await User.findBy('id', id)
    
    await request.validate(UpdateUser)
    const data = request.only(['name', 'email', 'password'])
    const existentUser = await User.findBy('email', data.email)

    if (existentUser) {
      return response.status(400).json({ error: { message: 'There is already a user with this email' } })
    }

    user?.merge(data)
    await user?.save()

    return user
  }

  public async destroy({ auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const user = await User.findBy('id', id)
    await user?.delete()
    return 'User has been deleted'
  }
}
