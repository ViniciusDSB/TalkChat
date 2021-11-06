const socket = io()

var form = document.getElementById('form')

socket.on('newConnection', (connectionId)  => {
    let idList = document.getElementById('idList')
    let newId = document.createElement('li')
    newId.innerText = `Alguém chegou. ID:  ${connectionId}`
    idList.append(newId)
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    let imgLink = document.getElementById('avatar').src
    let author = document.getElementById('author').innerText
    let messageText = document.getElementById('messageInput').value

    if(imgLink == false){
        imgLink = 'https://www.dclick.com.br/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png'
    }

    if(author && messageText){

        let messageObj = {
            avatar: imgLink,
            nick: author,
            message: messageText,
        }
        socket.emit('sendMessage', messageObj)
        document.getElementById('messageInput').value=''
    }
})

socket.on('previousMessages', (msgArr => {
    for(let msgs of msgArr){
        renderMsg(msgs)
    }
}))

socket.on('recivedMessage', (msgObj) => {
    renderMsg(msgObj)
})


function renderMsg(msg){

    let messageItem = document.createElement('div')
    messageItem.className = 'messageItem'

    let imgDiv = document.createElement('div')
    imgDiv.id = 'imgDiv'
    let textDiv = document.createElement('div')
    textDiv.id = 'textDiv'

    let messageAvatar = document.createElement('img')
    let messageNick= document.createElement('strong')
    let messageTxt = document.createElement('p')

    messageAvatar.src = `${msg.avatar}`
    messageNick.innerText = `${msg.nick}`
    messageTxt.innerText = `${msg.message}`

    imgDiv.append(messageAvatar)
    textDiv.append(messageNick, messageTxt)

    messageItem.append(imgDiv, textDiv)

    messageList.append(messageItem)

    let chatHeight = document.getElementById('messageList').scrollHeight
    console.log(chatHeight)
    document.getElementById('messageList').scrollTo(0, chatHeight)
}