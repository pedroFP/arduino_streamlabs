const io = require('socket.io-client');
const serialport = require("serialport");
const SerialPort = serialport.SerialPort;
const portName = process.argv[2]; // => $ npm start COM4

const streamlabs = io(`https://sockets.streamlabs.com?token=${process.env.STREAMLABS_SOCKET_TOKEN}`, {transports: ['websocket']});

const myPort = new serialport(portName,{
    baudRate:9600,
    parser: new serialport.parsers.Readline("\r\n")
})

myPort.on('open', ()=>{arduMessage("ARDUINO CONECTADO")});

function arduMessage(message){
  setTimeout(function(){
    myPort.write(`${message} `);
  }, 2000)
}

streamlabs.on('connect', () => {console.log('CONNECTION SUCCESS')});

streamlabs.on('event', (eventData) => {

  var message = eventData.message[0]

  if (eventData.type === 'donation') {
    name = message.from;
    amount = message.amount;
    data = `${name}: $${amount}`
    console.log(data);
    arduMessage(data);
  }
  if (eventData.for === 'twitch_account') {
    switch(eventData.type) {
      case 'follow':
        data = `FOLLOW: ${message.name}`
        console.log(data);
        arduMessage(data);
        break;
      case 'subscription':
        data = `SUB: ${message.name}`
        console.log(data);
        arduMessage(data);
        break;
      case 'beats':
        data = `BITS: ${message.name}, ${message.amount}`
        console.log(data);
        arduMessage(data);
        break;
      default:
        console.log(message);
    }
  }
});
