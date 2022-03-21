import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  beforeSave,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Bet from './Bet'
import Permission from './Permission'

export default class User extends BaseModel {
  public static table = 'users'

  @hasMany(() => Bet, {
    foreignKey: 'user_id',
  })
  public bets: HasMany<typeof Bet>

  @hasOne(() => Permission)
  public permission: HasOne<typeof Permission>

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
