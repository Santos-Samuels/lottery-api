import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { formatUser } from 'App/services/formatUser'
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

      const userInfo = formatUser(user!)

      return { token, user: userInfo }
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async store({ auth, request, response }: HttpContextContract) {
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

    const userInfo = formatUser(user!)

    return { userInfo, token }
  }

  public async show({ auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const user = await User.findBy('id', id)
    const userInfo = formatUser(user!)
    
    return { userInfo }
  }

  public async update({ auth, request }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const user = await User.findBy('id', id)

    await request.validate(UpdateUser)
    const data = request.only(['name', 'email', 'password'])

    await user?.merge(data)
    await user?.save()

    const userInfo = formatUser(user!)
    return userInfo
  }

  public async destroy({ auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const user = await User.findBy('id', id)
    await user?.delete()

    return 'User has been deleted'
  }
}
