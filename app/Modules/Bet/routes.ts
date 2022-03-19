import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'BetsController.index')
}).prefix('bet')