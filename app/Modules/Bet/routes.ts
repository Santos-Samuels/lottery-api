import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'BetsController.index')
    Route.post('/new', 'BetsController.store')
  }).middleware('auth')
}).prefix('bet')
