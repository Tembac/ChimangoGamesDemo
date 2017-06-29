import BootState from './states/Boot';
import Game from './states/Game';
import MainMenu from './states/MainMenu';
import Preloader from './states/Preloader';
import gameOptions from "./gameOptions"

window.onload = function() {

  gameOptions.main.version += " " + indexInfo.buildState;

  var innerWidth = window.screen.availWidth;
  var innerHeight = window.screen.availHeight;
	if (innerWidth > innerHeight)
	{
		 gameOptions.main.screenScale =  innerWidth/innerHeight;
	}
	else
	{
		gameOptions.main.screenScale =  innerHeight/innerWidth;
	}

	var game = new Phaser.Game(Math.ceil(600*gameOptions.main.screenScale), 600, Phaser.CANVAS);
  // adding game state
  game.state.add("Boot", BootState);
  game.state.add("Preloader", Preloader);
  game.state.add("MainMenu", MainMenu);
  game.state.add("Game", Game);

  // starting game state
  game.state.start("Boot");

};
