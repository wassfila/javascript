# example taken from
https://gist.github.com/martinsik/2031681

## License :
for any licensing and publishing, please refer to the original author martinsik from the link above

Any additions taken from this github is free from any restriction (modify, publish, only original author mention is required)

# So what is this ?
a nodejs server to Front-End example for chat with websocket

Additions in this repository are 
 - packet.json, metionning websocket dependency so that "npm install" can update dependencies, 
 - visual studio project (yes, yes, that's nice to have nodejs with intellisense) using https://www.visualstudio.com/en-us/features/node-js-vs.aspx
 
## This was tested on a Raspberrypi 3 
 - server run with command "node server.js"
 - apache only was installed on the raspberry pi, no php, no sql, as apache is enough to serve files for the front end
 - the backend power comes from nodejs, that's the idea
 - content of this directory was placed on the /var/www/html/ directory on the raspberrypi
 - frontend.js was modified to match ip adress of local network for the raspberry pi
 - The front end browser (user) has to call then "http://raspberrypi/frontend.html" (default host name from the pi)

 - a samba share on the pi was used as intermediate directory to develop with visual studio then copy and run on the pi
 - putty used as the windows ssh client, note that you can connect with your password with one click with such shortcut "D:\Projects\putty.exe pi@raspberrypi -pw raspberry"
