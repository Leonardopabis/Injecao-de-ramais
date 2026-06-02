const SSH_HOST = "10.231.32.141"
const SSH_PORTA = 9122

const SSH_HOST_TESTE = "10.231.32.222"


const ARQUIVO_REMOTO = "/usr/local/node/mxipcall-cluster-api/dist/terminals/terminals.router.js"
const BACKUP_REMOTO = "/usr/local/node/mxipcall-cluster-api/dist/terminals/backup"

const LINHA_INJECAO = 147
const INDENT = "                    "

const filaMensagens = []

const express = require('express')
const cors = require('cors')
const { Client } = require('ssh2')

const app = express()

app.use(cors())
app.use(express.json());

// try{

    app.post('/api/verificar-ssh', (req, res) => {

        const {
            usuario_ssh,
            senha_html,
            root_pwd_html,
            req_user_html,
            req_pass_html,
            label_html,
            username_html,
            server_html,
            secret_html,
            display_html,
            audio
        } = req.body;

        const conn = new Client()

        let respostaEnviada = false

        function responderHttp(status, payload){
            if (respostaEnviada) return

            respostaEnviada = true

            try {
                res.status(status).json(payload)
            } catch (err) {
                console.log("Erro ao responder HTTP: ", err.message)
            }
            conn.end()
        }

        conn.on('error', (err) => {
            console.log(err)

            // editarMensagemHtml("Usuário ou Senha SSH incorreta")

            responderHttp(401, {
                sucesso:false,
                mensagem: "Usuário ou senha SSH incorreta"
            })
        })

        conn.on('ready', () => {
            editarMensagemHtml("SSH conectado")
            console.log('ssh conectado')

            conn.exec('su', { pty: true }, (err, stream) => {
                if (err) {
                    editarMensagemHtml("Falha no comando 'su'")
                    
                    responderHttp(500, {
                        sucesso: false,
                        mensagem: err.message
                    })

                    return
                }

                console.log('su iniciado')

                let senhaEnviada = false
                let whoamiEnviado = false

                let rootConfirmado = false
                let criandoRamal = false
                let erroCriarRamal = ""
                let bufferCriarRamal = ""


                stream.on('data', (data) => {
                    const texto = data.toString()
                    const textoLower = texto.toLowerCase()

                    console.log('saida: ', texto)

                    if (respostaEnviada) return

                    if (criandoRamal) {
                        bufferCriarRamal += texto
                        console.log("BUFFER RAMAL: ", bufferCriarRamal)

                        if (textoLower.includes("permission denied") || textoLower.includes("no such file") || textoLower.includes("cannot stat") || textoLower.includes("can't read") || textoLower.includes("erro")){
                            erroCriarRamal += texto
                        }
                        
                        if (bufferCriarRamal.includes("__FIM_CRIAR_RAMAL__:0")){
                            criandoRamal = false
                            
                            editarMensagemHtml("Ramal criado com sucesso")
                            console.log("Ramal criado com sucesso")
                            
                            responderHttp(200, {
                                sucesso: true,
                                mensagem: "Ramal criado com sucesso"
                            })

                            return
                        }
                        
                        if (bufferCriarRamal.includes("__FIM_CRIAR_RAMAL__:") && !bufferCriarRamal.includes("__FIM_CRIAR_RAMAL__:0")){
                            criandoRamal = false
                            
                            editarMensagemHtml("Erro ao criar ramal")
                            editarMensagemHtml(erroCriarRamal || bufferCriarRamal)
                            
                            console.log("Erro ao criar ramal:", erroCriarRamal || bufferCriarRamal)
                            
                        responderHttp(500, {
                            sucesso:false,
                            mensagem: erroCriarRamal || bufferCriarRamal || "Erro ao criar ramal"
                        })
                        return
                    }
                    return
                }

                    if (!senhaEnviada && (textoLower.includes('password') || textoLower.includes('senha'))) {
                        senhaEnviada = true
                        stream.write(`${root_pwd_html}\n`)
                        return
                    }

                    if (!respostaEnviada && (textoLower.includes('senha incorreta') || textoLower.includes('authentication failure') || textoLower.includes('incorrect password') || textoLower.includes('falha de autenticação'))) {

                        editarMensagemHtml("Senha root incorreta")
                        console.log("Senha root incorreta")

                        responderHttp(401, {
                            sucesso:false,
                            mensagem: "Senha root incorreta"
                        })
                        return
                    }

                    if (senhaEnviada && !whoamiEnviado) {
                        whoamiEnviado = true
                        stream.write('whoami\n')
                        return
                    }


                    if (texto.trim() === 'root' && !rootConfirmado) {
                        rootConfirmado = true

                        editarMensagemHtml("Conectado como root")
                        console.log("Conectado como root")

                        criandoRamal = true
                        criarRamal(stream)

                        return
                    }
                })

                stream.stderr.on('data', (data) => {
                    const erro = data.toString()
                    console.error('stderr: ', erro)

                    if (!respostaEnviada) {
                        erroCriarRamal += erro
                    }
                })

                stream.on('close', () => {
                    if (!respostaEnviada) {
                        editarMensagemHtml("Conexão encerrada antes de finalizar o processo")

                        responderHttp(500, {
                            sucesso:false,
                            mensagem: "Conexão encerrada antes de finalizar o processo"
                        })
                    }
                })
            })

        })

        conn.connect({
            host: `${SSH_HOST}`,
            port: `${SSH_PORTA}`,
            username: `${usuario_ssh}`,
            password: `${senha_html}`
        })

        function gerar_bloco() {
            const bloco = `${INDENT}else if (req.body.username == "${req_user_html}" && req.body.password == "${req_pass_html}") {
        ${INDENT}   resp.statuscode = 200;
        ${INDENT}   error = 0;
        ${INDENT}   label = "${label_html}";
        ${INDENT}   server = ${server_html};
        ${INDENT}   username = "${username_html}";
        ${INDENT}   secret = "${secret_html}";
        ${INDENT}   displayName = "${display_html}";
        ${INDENT}   audioCodecs = "${audio}";
        ${INDENT}}
    `

            return bloco
        }

        function criarRamal(stream) {
            //arquivo: caminho do arquivo para a injecao - backup: caminho do arquivo para o backup
        const bloco = gerar_bloco()

        editarMensagemHtml("Iniciando criação do ramal")

const cmd = `
(
    echo "__INICIO_CRIAR_RAMAL__"

    ARQUIVO="${ARQUIVO_REMOTO}"
    BACKUP_DIR="${BACKUP_REMOTO}"

    echo "Arquivo alvo: $ARQUIVO"
    echo "Pasta backup: $BACKUP_DIR"

    mkdir -p "$BACKUP_DIR"

    cp "$ARQUIVO" "$BACKUP_DIR/meu.js.$(date +%Y%m%d_%H%M%S).bak"

    tmpfile=$(mktemp)

    cat > "$tmpfile" <<'EOF'
${bloco}
EOF

    sed -i '\\|// INSERT_HERE|r '"$tmpfile" "$ARQUIVO"

    rm "$tmpfile"

    echo "__RAMAL_INSERIDO__"
)

    STATUS=$?
    echo "__FIM_CRIAR_RAMAL__:$STATUS"
`

            stream.write(`${cmd}\n`)

            editarMensagemHtml("Comando enviado para inserir o ramal")

            editarMensagemHtml("Ramal criado com sucesso")
        }
    })
    
    app.post('/api/mudar-mensagem', (req, res) => {
        
        const mensagem = filaMensagens.shift()
        
        if (mensagem) {
            console.log('fila:' + filaMensagens)
            console.log('enviando ' + mensagem)
            res.json({
                mensagem
            })
        } else {
            res.json({
                mensagem: null
            })
        }
    })
    
    app.listen(3000, () => {
        console.log('servidor rodando')
    })

function editarMensagemHtml(mensagem) {
    console.log('Adicionando: ' + mensagem)
    filaMensagens.push(mensagem)
}