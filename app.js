import express, {json} from "express";
// Primeiro instalar npm i cookie-parser e em seguida importar
import cookieParser from "cookie-parser";
import { v4 } from 'uuid';
import cors from "cors";

const app = express();
app.use(json());
app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(cookieParser()); // Usa como middleware
const PORT = 5000;


app.get('/', (req,res) =>{

    //res.clearCookie("token"); --> Para apagar o token na hora de fazer a demonstração do login
    // Primeiro faz a rota do login, gera o token e armazena no cookie
    // depois faz o post no secondopage 
    // Depois para demonstrar o cookie, vai para essa página, limpa o cookie com o res.clear e 
    // vai direto para a rota secondpage que é para não ser autorizado
    // Isso deve ser feito no thunderclient, insomnia ou algum outro do gênero

    res.send(`<h1> Cookies </h1>
                <ul>
                    <li> O que são cookies? </li> 
                    <li> Como lemos e escrevemos Cookies através do back-end? </li> 
                    <li> Onde são transmitidos os Cookies do front-end pro back-end? </li> 
                    <li> E onde são transmitidas as ordens para criar/deletar Cookies do back-end pro front-end? </li> 
                    <li> Qual a diferença de Cookie e Local Storage? </li> 
                    <li> Como Cookies são usados para direcionar anúncios customizados para você? </li>     
                                                    </ul>`)
});


app.get('/set-cookie', (req,res) =>{
    //res.setHeader('set-cookie', 'foo=bar');
    res.cookie('foo', 'bar', {
        //maxAge: 5000,
        //expires: new Date('24 May 2022'),  
        httpOnly: true
    });
    res.status(201).send('Cookies are set');
});

app.get('/get-cookie', (req,res) => {
    res.send(req.cookies);
});


app.get('/del-cookie', (req,res) => {
    res.clearCookie("token");
    res.send('Cookie has been deleted');
});

// Parte da aplicação do front com o back (Thunder client e localhost)
let token;

app.post("/login", (req,res) => {
    // Olhar explicação rota (/)
    token = v4();
    //console.log(req.headers.cookie);
    const {email} = req.body;
    try {
    //res.setHeader('set-cookie', `${req.headers.cookie}`);
    res.cookie('token', token, {
        httpOnly: true
    }); 
/*    res.cookie('email', email, {
        httpOnly: true
    });  */
    res.status(201).send(token);
    } catch (e) {
        res.status(404).send("Erro no login");
    }
}); 

app.post("/secondpage", (req,res) => {
    // Olhar explicação rota (/)
    console.log(req.headers.cookie)
    const tokenValidate = req.cookies.token;
    if(tokenValidate === token) {
    res.status(200).send("Token validado");
    } else {
        res.status(401).send("Não autorizado");
    }
}) 

app.listen(PORT, () => console.log(`Back-end running on port ${PORT}`));