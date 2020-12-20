module.exports = {
    name: 'hello',
    description: "This is a test command.",
    usage: "-mn-hello",
    async execute(message,args){
        console.log('Im here');
        message.channel.send('Hi, how are ya!');
    }
}