const yt = require('youtube-dl-exec');
yt('https://www.youtube.com/watch?v=lea-Wl_uWXY', {extractorArgs: 'youtube:player_client=ios', dumpSingleJson: true})
.then(d => console.log('SUCCESS:', d.title))
.catch(e => console.error('FAILED:', e.message));
