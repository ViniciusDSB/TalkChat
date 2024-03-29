var socket = io();

function renderMsg(msg){

    let message = document.createElement('div')
    message.innerHTML = 
    `<img id="avatar" src="${msg.avatar}">
    <h1>${msg.nick}</h1>
    <p>${msg.txt}</p>
    `
    let msgList = document.getElementById('messagesList')
    msgList.append(message)

    let chatHeight = document.getElementById('messagesList').scrollHeight
    document.getElementById('messagesList').scrollTo(0, chatHeight)
}

var form = document.getElementById('form');

socket.on('msgForAll', (msgObj) => {
    renderMsg(msgObj)
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let msgObj = {}

    if(document.getElementById('inputMsg').value){
        msgObj = {
            avatar: document.getElementById('avatarInput').value,
            nick: document.getElementById('nickInput').value,
            txt: document.getElementById('inputMsg').value
        }
        socket.emit('newMsg', msgObj);
        document.getElementById('inputMsg').value=''
    }else{
        alert('Digite uma mensagem, caralho')
        document.getElementById('inputMsg').value='Isso aqui serve pra digitar!!!'
    }
        

})