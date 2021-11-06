//Criar servidor express e chamar o socket.io
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

//configurar body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configurar o path
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));



//configurar view engine: handlebars
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

app.engine('handlebars', expressHandlebars({handlebars: allowInsecurePrototypeAccess(Handlebars)}))
app.set('view engine', 'handlebars')

//Chamar banco de dados
const userLogin = require('./models/saveLogin');

//Rotas
app.get('/',(req, res) => {
    res.render('login/login')
})


let userEmail
let userPass

//Renderizar pagina de criação de login
app.get('/createLogin/createLogin', (req, res) => {
    res.render('createLogin/createLogin')
})

//Criar login no banco
app.post('/createlogin', (req, res) => {
    userLogin.create({
        avatar: req.body.userAvatar,
        nick: req.body.userNick,
        email: req.body.userEmail,
        password: req.body.pass
    }).then( () => {
        res.render('login/login')
    }).catch( (err) => {
        res.send(`Algo deu errado: ${err} ---- Volte e tente novamente! Ou faça ocodigo direito ;-;`)
    })

})

//Renderizar página principal
app.post('/talkchathome', (req, res) => {
    userEmail = req.body.email
    userPass = req.body.pass

    userLogin.findOne({
        where:{
            email: userEmail
        }
    }).then( (userData) => {
        if(userPass == userData.password){
            res.render('mainPage/index', {
                avatar: userData.avatar,
                nick: userData.nick,
                email: userData.email
            })
        }else{
            res.render('error', {error: 'Voce errou a senha.'})
        }
    }).catch( () => {
        res.render('error', {error: 'Parece que essa conta não existe! Crie uma ou digite o email certo.'})
    })
})

//Verificar dadosdo usuario antes de editar o perfil, e renderizar pagina de edição
app.post('/verifyUser', (req, res) => {
    userEmail = req.body.userEmail
    userPass = req.body.userPassword

    userLogin.findOne({
        where:{
            email: userEmail
        }
    }).then( (userData) => {
        if(userPass == userData.password){
            res.render('profileSettings/profileSettings', {
                avatar: userData.avatar,
                nick: userData.nick,
                email: userData.email,
                password: userData.password
            })
        }else{
            res.send('Senha errada. Volte e tente novamente!')
        }
    })
})

//Salvar novos dados da conta
app.post('/updateUserProfile', (req, res) => {
    let avatar = req.body.userAvatar;
    let nick = req.body.userNick;
    let email = req.body.userEmail;
    let password = req.body.userPassword;

    let old = req.body.old;

    userLogin.findOne({
        where:{
            email: old
        }
    }).then( (accountData) => {
        accountData.avatar = avatar;
        accountData.nick = nick;
        accountData.email = email;
        accountData.password = password;

        accountData.save()

        res.redirect('/')
    })
})

//Deletar conta
app.post('/deleteAccount', (req, res) => {
    userLogin.findOne({
        where:{
            email: req.body.old
        }
    }).then( (userAccount) => {
        userAccount.destroy()

        res.redirect('/')
    })
})

app.get('/theme', (req, res) => {
    res.send('Aqui deve ficar a pagina pra trocar as cores e o tema da aplicação!')
})

//Area do socket io
let msgArr = [];

io.on("connection", (socket) => {
    
    io.emit('newConnection', (socket.id))

    //eventos de mensagem com socket io
    io.to(socket.id).emit('previousMessages', msgArr)

    socket.on('sendMessage', (messageObj) => {
        msgArr.push(messageObj)
        io.emit('recivedMessage', messageObj)
    })
});

//Dizer que está online
httpServer.listen(3000, () => {
    console.log('Serving')
});