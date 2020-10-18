# Vanilla Audio player
## Introduction
##### This audio player is small javascript library used to overlay images on top of the current page. It's a snap to setup and works on all modern browsers.
##### Supports all major browsers (Google Chrome, Firefox, Safari, IE 11, Edge)

## Installation

#### install package:
##### `npm i vanilla-audio-player`
#### Import package into your JS file as ES6 module:
##### `Import AudioPlayer from 'vanilla-audio-player'`
#### Use Audio player:
`new AudioPlayer('your-selector',options);`
```
new AudioPlayer('.player-1',[  
	{  
		name: 'Song 1',  
		src: '/url/to/your/file.mp3'  
	},  
	{  
		name: '2',  
		src: '/url/to/your/file.mp3'  
	},  
	{  
		name: '3',  
		src: '/url/to/your/file.mp3'
	}  
]); 
```

#### Use Vanilla lightbox styles (scss):
`@import "~vanilla-audio-player/src/scss/app.scss";`


## Options

| Name  | Meaning  |
|--|--|
| name | Your song title that will be shown in player |
| src | Url to your audio file |

