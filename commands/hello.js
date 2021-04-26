module.exports = {
    name: 'hello',
    description: "This is a test command.",
    usage: "-mn-hello",
    execute(message,args){
        console.log('Im here');
        message.channel.send('Hi, how are ya!');
    }
}