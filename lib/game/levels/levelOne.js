ig.module( 'game.levels.levelOne' )
.requires( 'impact.image','game.entities.ship','game.entities.asteroid' )
.defines(function(){
LevelLevelOne=/*JSON[*/{"entities":[{"type":"EntityShip","x":168,"y":308},{"type":"EntityAsteroid","x":92,"y":52},{"type":"EntityAsteroid","x":144,"y":104},{"type":"EntityAsteroid","x":232,"y":124},{"type":"EntityAsteroid","x":276,"y":48}],"layer":[{"name":"background","width":4,"height":4,"linkWithCollision":true,"visible":1,"tilesetName":"media/spaceTile.png","repeat":false,"preRender":false,"distance":"1","tilesize":100,"foreground":false,"data":[[6,6,6,6],[6,6,6,6],[6,6,6,6],[6,6,6,6]]}]}/*]JSON*/;
LevelLevelOneResources=[new ig.Image('media/spaceTile.png')];
});