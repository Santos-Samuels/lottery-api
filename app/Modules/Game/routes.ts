import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/new', 'GamesController.store')
    Route.get('/:id', 'GamesController.show')
    Route.put('/:id', 'GamesController.update')
    Route.delete('/:id', 'GamesController.destroy')
  }).middleware('auth')

  Route.get('/', 'GamesController.index')
}).prefix('games')