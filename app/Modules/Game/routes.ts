import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/new', 'GamesController.store')
    Route.put('/:game_id', 'GamesController.update')
    Route.delete('/:game_id', 'GamesController.destroy')
  }).middleware('auth').middleware('adminAuth')

  Route.get('/', 'GamesController.index')
  Route.get('/:game_id', 'GamesController.show')
}).prefix('games')