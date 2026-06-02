const inputs = document.querySelectorAll('input')
const previewSpans = document.querySelectorAll(".preview-span")

inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.classList.add('active')
        if (input.value.trim() === '' || !input){
            input.classList.add('input-error')
            input.placeholder = 'Não pode ser vazio'
        }
    })
    input.addEventListener('blur', () =>{
        input.classList.remove('active')
        if (input.value.trim() === '' || !input) {
            input.classList.add('input-error')
        } else {
            input.classList.remove('input-error')
        }
    })
    input.addEventListener('input', () => {
        if (input.value.trim() !== '' && input){
            input.classList.remove('input-error')
        }

        verificarErros()

        previewSpans.forEach(preview => {
            if (input.getAttribute('name') === preview.getAttribute('name')){
                if (preview.getAttribute('name') === "username"){
                    preview.textContent = `${input.value}`
                }else if (preview.getAttribute('name') === "password"){
                    preview.textContent = `${input.value}`
                }else if (preview.getAttribute('name') === "label"){
                    preview.textContent = `${input.value}`
                }else if (preview.getAttribute('name') === "server"){
                    preview.textContent = `${input.value}`
                }//else if (preview.getAttribute('name') === "usernameSip"){
                    //preview.textContent = `${input.value}`}
                else if (preview.getAttribute('name') === "secret"){
                    preview.textContent = `${input.value}`
                }else if (preview.getAttribute('name') === "displayName"){
                    preview.textContent = `${input.value}`
                }
            }
            
        });
    })
});
const criarBtn = document.querySelector("#criarBtn")

let temErro = true

function verificarErros() {
    temErro = Array.from(inputs).some(input => input.value.trim() === '')
}

verificarErros()

criarBtn.addEventListener('click', (event) =>{
    event.preventDefault();
    if (temErro){
        alert('Preencha os campos corretamente / Nenhum pode ser vazio')
    }else {
        
        popupConfirmacao.classList.add('overlay-on')
        blur.classList.add('overlay-on')
    }
})
const popupConfirmacao = document.querySelector("#popupConfirmacao")
const blur = document.querySelector("#blur")



const naoBtn = document.querySelector("#naoBtn")
naoBtn.addEventListener('click', () =>{
    popupConfirmacao.classList.remove('overlay-on')
    blur.classList.remove('overlay-on')
})

const popupStatus = document.querySelector("#status-conexao")

const fecharStatus = document.querySelector("#fechar-status")


const statusConexaoTextField = document.querySelector("#status-conexao-text")

function zerarStatusConexao() {
    statusConexaoTextField.innerHTML = null
}
let sshFoiSucesso = false
const formularioRamal = document.querySelector('#formularioRamal')
formularioRamal.addEventListener('submit', async (e) => {
    e.preventDefault();

    sshFoiSucesso = false

    const usuario_ssh = document.querySelector(("#usuario_ssh")).value;
    const senha_html = document.querySelector("#senha").value;
    const root_pwd_html = document.querySelector("#root_pwd").value;
    const req_user_html = document.querySelector("#username").value
    const req_pass_html = document.querySelector("#password").value
    const label_html = document.querySelector("#label").value
    const server_html = document.querySelector("#server").value
    const username_html = document.querySelector(".label").value
    const secret_html = document.querySelector("#secret").value
    const display_html = document.querySelector("#displayName").value
    const audio = "PCMA/8000/1 PCMU/8000/1 G729/8000/1"
    popupConfirmacao.classList.remove('overlay-on')
    popupStatus.classList.add('overlay-on')
    
    try {
        const response = await fetch('http://localhost:3000/api/verificar-ssh', {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
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
            })
        })

        
        const dataJson = await response.json();

        console.log("Resposta do backend: ", dataJson)

        if (dataJson.mensagem) {
            statusConexaoTextField.innerHTML += `${dataJson.mensagem}<br>`
        }

        if (!response.ok) {
            sshFoiSucesso = false
            console.log(dataJson)
            return
        }

        if (dataJson.sucesso === true) {
            sshFoiSucesso = true
        }

        //mensagem de sucesso
        console.log(dataJson);  
    }  catch (erro) {
        sshFoiSucesso = false
        console.error(erro)
        //'erro ao conectar no servidor'
    }
    
    

})

fecharStatus.addEventListener('click', () => {
    popupStatus.classList.remove('overlay-on')
    blur.classList.remove('overlay-on')
    zerarStatusConexao()
    if (sshFoiSucesso === true) {
        formularioRamal.reset() 
        
        previewSpans.forEach(preview => {
            preview.textContent = ''
        })
    }
    verificarErros()

    inputs.forEach(input => {
        input.removeAttribute('placeholder')
        input.classList.remove('input-error')
    })
})

async function lerMensagens(){
    while (true) {
        try {
        const resp = await fetch('http://localhost:3000/api/mudar-mensagem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await resp.json()
        if (data.mensagem !== null){
            console.log(data)
            statusConexaoTextField.innerHTML += `${data.mensagem}<br>`
        }
    } catch (erro) {
        console.log("Erro ao ler mensagens: " + erro)
    }
        await new Promise(r => setTimeout(r, 300))
    }
}
lerMensagens()















