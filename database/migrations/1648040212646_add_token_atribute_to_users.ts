import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddTokenAtributeToUsers extends BaseSchema {
  protected tableName = 'add_token_atribute_to_users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('token').unique()
      table.dateTime('token_created_at')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('token')
      table.dropColumn('token_created_at')
    })
  }
}
