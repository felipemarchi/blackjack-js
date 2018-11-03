// variaveis globais
var ultimaPosicaoAlocada = 0
var sobreporCarta = false 
var firstTime = true
var somaDealer = 0
var somaPlayer = 0
var dinheiro = 0
var usuario = ""
var pote = 0
// botoes da dom
var btnInicio = document.getElementById("btnInicio")
var btnHit = document.getElementById("btnHit")
var btnStand = document.getElementById("btnStand")
var btnVirar = document.getElementById("btnVirar")
var btnHit2 = document.getElementById("btnHit2")
var btnStand2 = document.getElementById("btnStand2")
// outros elementos da dom
var escolhaAposta = document.getElementById("aposta")
var dinheiroPlayer = document.getElementById("dinheiro")
var nomeUsuario = document.getElementById("usuario")
var dinheiroPote = document.getElementById("pote")
var dealerTurn = document.getElementById("dealer")
var playerTurn = document.getElementById("player")
var chat = document.getElementById("chat")
// funcao que retorna um numero de 1 a 52 para escolha de uma carta
function sorteiaCarta() {
    return Math.floor( 1 + Math.random() * 52 )
}
// funcao para obter o valor da carta passada por parametro
function calculaValorCarta(carta) {
    var valor
    if (carta < 40)
        carta%10 == 0 ? valor = 10 : valor = carta%10
    else
        valor = 10
    return valor
}
function aposta(aposta) {
    aposta = parseInt(aposta)
    pote += aposta
    dinheiro -= aposta
    dinheiroPote.innerHTML = pote
    dinheiroPlayer.innerHTML = dinheiro
}
// funcao que inicia o jogo ou atualiza a pagina se este ja foi jogado
function startGame() {
    if (firstTime && dinheiro>0) {
        // aposta inicial
        aposta(50)
        //
        firstTime = false
        ultimaPosicaoAlocada = 2
        // visibilidade dos botoes e vez do jogador
        btnInicio.setAttribute("hidden","hidden")
        btnHit.removeAttribute("hidden")
        btnStand.removeAttribute("hidden")
        playerTurn.setAttribute("class","coin active")
        // cria cartas dorsos
        var c1 = document.createElement("img");c1.setAttribute("src","baralho/dorso.jpg")
        var c2 = document.createElement("img");c2.setAttribute("src","baralho/dorso.jpg")
        var c3 = document.createElement("img");c3.setAttribute("src","baralho/dorso.jpg")
        var c4 = document.createElement("img");c4.setAttribute("src","baralho/dorso.jpg")
        // aloca cartas
        document.getElementById("d1").appendChild(c1)
        document.getElementById("d2").appendChild(c2)
        document.getElementById("p1").appendChild(c3)
        document.getElementById("p2").appendChild(c4)        
        // anima cartas
        document.getElementById("d1").children[0].setAttribute("class","animacao-carta") 
        document.getElementById("p1").children[0].setAttribute("class","animacao-carta")
        document.getElementById("p2").children[0].setAttribute("class","animacao-carta")
        // substitui cartas apos um tempo
        window.setTimeout(function(){
            var carta = sorteiaCarta()
            somaDealer += calculaValorCarta(carta)
            document.getElementById("d1").children[0].setAttribute("src","baralho/carta (" + carta + ").jpg")

            carta = sorteiaCarta()
            somaPlayer += calculaValorCarta(carta)
            document.getElementById("p1").children[0].setAttribute("src","baralho/carta (" + carta + ").jpg")
            
            carta = sorteiaCarta()
            somaPlayer += calculaValorCarta(carta)     
            document.getElementById("p2").children[0].setAttribute("src","baralho/carta (" + carta + ").jpg")
        },250)
    } else {
        if (dinheiro > 0)
            location.reload()
        else
            window.location.replace("denied.html")
    }
}
// funcao para desabilitar cor e funcao dos 4 botoes principais do jogo
function desabilitaBtns() {
    btnHit.setAttribute("disabled","disabled")
    btnHit.setAttribute("class","btn btn-jogo btn-disabled")
    btnStand.setAttribute("disabled","disabled")
    btnStand.setAttribute("class","btn btn-jogo btn-disabled")
    btnHit2.setAttribute("disabled","disabled")
    btnHit2.setAttribute("class","btn btn-jogo btn-disabled")
    btnStand2.setAttribute("disabled","disabled")
    btnStand2.setAttribute("class","btn btn-jogo btn-disabled")    
}
// funcao para o player permanecer com suas cartas e passar a vez
function standPlayer() {
    // visibilidade de elementos
    btnHit.setAttribute("hidden","hidden")
    btnStand.setAttribute("hidden","hidden")
    btnVirar.removeAttribute("hidden")
    dealerTurn.setAttribute("class","coin active")
    playerTurn.setAttribute("class","coin")
    // valor de variaveis globais
    ultimaPosicaoAlocada = 2
    sobreporCarta = false
}
// 
function configuraApostas() {
    pote = 0
    dinheiroPote.innerHTML = pote
    dinheiroPlayer.innerHTML = dinheiro

    localStorage.setItem("dinheiro", dinheiro)
}
// funcao que decide rumo do jogo a cada jogada do player
function verificaPontuacaoPlayer() {
    if (somaPlayer == 21)
    {
        standPlayer()
    }
    else if (somaPlayer > 21)
    {
        // derrota player
        chat.setAttribute("class","chat")
        chat.innerHTML = "<p>Tente novamente! Você perdeu por ter ultrapassado 21 pontos</p><a href='javascript:startGame();'>Novo Jogo</a>"
        
        desabilitaBtns()
        configuraApostas()
    }
}
// funcao para abrir mais uma carta na mesa do player
function hitPlayer() {
    // gerencia aposta
    if (escolhaAposta.value != "") {
        aposta(escolhaAposta.value)
    }
    if (somaPlayer < 21)
    {
        // cria carta dorso
        var c = document.createElement("img"); c.setAttribute("src","baralho/dorso.jpg")        
        // define posicao
        if (++ultimaPosicaoAlocada > 5) {
            ultimaPosicaoAlocada = 1
            sobreporCarta = true
        }
        // aloca carta para o player
        sobreporCarta == true ? c.setAttribute("class", "carta carta-sobreposta animacao-carta") : c.setAttribute("class","animacao-carta")
        document.getElementById("p" + ultimaPosicaoAlocada).appendChild(c)
        // substitui carta apos um tempo
        window.setTimeout(function(){
            var carta = sorteiaCarta()
            somaPlayer += calculaValorCarta(carta)
            c.setAttribute("src","baralho/carta (" + carta + ").jpg")
        },250)
    }
    window.setTimeout(verificaPontuacaoPlayer, 500)
}
// funcao inicial das jogadas do dealer
function virarCarta() {
    // gerencia aposta
    if (escolhaAposta.value != "") {
        aposta(escolhaAposta.value)
    }
    // vira dorso
    document.getElementById("d2").children[0].setAttribute("class","animacao-carta")
    // substitui carta apos um tempo
    window.setTimeout(function(){
        var carta = sorteiaCarta()
        somaDealer += calculaValorCarta(carta)
        document.getElementById("d2").children[0].setAttribute("src","baralho/carta (" + carta + ").jpg")
        // visibilidade de elementos
        btnVirar.setAttribute("hidden","hidden")

        // /* PARA TOMAR DECISÕES PELO DEALER
            // btnHit2.removeAttribute("hidden")
            // if (somaDealer >= 17)
               // btnStand2.removeAttribute("hidden")
        // */

    },250)

    // /* DEALER JOGA AUTOMATICAMENTE
        window.setTimeout(function(){
            if (somaDealer < 17 || somaDealer < somaPlayer)
                hitDealer()
            else
                verificaPontuacao2()
        },1000)
    // */
}
// funcao que decide rumo do jogo a cada jogada do dealer
function verificaPontuacao2() {
    if (somaDealer > 21)
    {    
        // vitoria player
        dinheiro += pote*2
        document.getElementById("chat").setAttribute("class","chat")    
        document.getElementById("chat").innerHTML = "<p>Parabéns! Você ganhou pois o Dealer ultrapassou 21 pontos</p><a href='javascript:startGame();'>Novo Jogo</a>"        
        
        desabilitaBtns()
        configuraApostas()

    } else verificaPontuacaoFinal()
}
// funcao final que nomeia ganhador (standDealer)
function verificaPontuacaoFinal() {
    // gerencia aposta
    if (escolhaAposta.value != "") {
        aposta(escolhaAposta.value)
    }

    document.getElementById("chat").setAttribute("class","chat")
    
    if (somaPlayer == somaDealer) {
        // empate
        dinheiro += pote
        document.getElementById("chat").innerHTML = "<p>Quase lá! Você empatou com o Dealer</p><a href='javascript:startGame();'>Novo Jogo</a>"

    } else if (somaPlayer > somaDealer) {
        // vitoria player
        dinheiro += pote*2
        document.getElementById("chat").innerHTML = "<p>Parabéns! Você ganhou por " + (somaPlayer-somaDealer) + " pontos de diferença</p><a href='javascript:startGame();'>Novo Jogo</a>"

    } else {
        // vitoria dealer
        document.getElementById("chat").innerHTML = "<p>Tente novamente! Você perdeu por " + (somaDealer-somaPlayer) + " pontos de diferença</p><a href='javascript:startGame();'>Novo Jogo</a>"
    }

    desabilitaBtns()
    configuraApostas()
}
// funcao para abrir mais uma carta na mesa do dealer
function hitDealer() {
    // gerencia aposta
    if (escolhaAposta.value != "") {
        aposta(escolhaAposta.value)
    }
    if (somaDealer < 21)
    {
        // cria carta
        var carta = document.createElement("img")
        carta.setAttribute("src","baralho/dorso.jpg")
        
        // define posicao
        if (++ultimaPosicaoAlocada > 5) {
            ultimaPosicaoAlocada = 1
            sobreporCarta = true
        }

        // aloca carta para o dealer        
        sobreporCarta == true ? carta.setAttribute("class", "carta carta-sobreposta animacao-carta") : carta.setAttribute("class","animacao-carta") 
        document.getElementById("d" + ultimaPosicaoAlocada).appendChild(carta)

        window.setTimeout(function(){
            // substitui carta
            var sorteio = sorteiaCarta()
            carta.setAttribute("src","baralho/carta (" + sorteio + ").jpg")
            somaDealer += calculaValorCarta(sorteio)

            /* PARA TOMAR DECISÕES PELO DEALER
                if (somaDealer >= 17) {
                    document.getElementById("btnHit2").setAttribute("class","btn btn-jogo verde")
                    document.getElementById("btnStand2").removeAttribute("hidden")
                }
            */

        },250)

        // /* DEALER JOGA AUTOMATICAMENTE
            window.setTimeout(function(){
                if (somaDealer >= 17 && somaDealer > somaPlayer)
                    verificaPontuacao2()
                else
                    hitDealer()                
            },1000)
        // */

    } else window.setTimeout(verificaPontuacao2, 500)    
}
// funcoes de clique dos botoes
btnInicio.addEventListener("click", startGame)
btnHit.addEventListener("click", hitPlayer)
btnStand.addEventListener("click", standPlayer)
btnVirar.addEventListener("click", virarCarta)
btnHit2.addEventListener("click", hitDealer)
btnStand2.addEventListener("click", verificaPontuacaoFinal)
// utiliza ultimo jogo do localstorage
if (!localStorage.getItem("usuario") || localStorage.getItem("usuario")=="null") {    
    swal({
        text: "Digite um nome de usuario:",
        content: "input",
        button: true,
      })
      .then((name) => {       
        usuario = name
        localStorage.setItem("usuario",usuario)
        dinheiro = 500
        dinheiroPlayer.innerHTML = dinheiro
        nomeUsuario.innerHTML = usuario
      })
} else {
    swal({
        title: "Continuar jogando como " + localStorage.getItem("usuario") + "?",
        buttons: true,
    })
    .then((continuarJogando) => {
        if (continuarJogando) {
            dinheiro = localStorage.getItem("dinheiro")
            usuario = localStorage.getItem("usuario")
            dinheiroPlayer.innerHTML = dinheiro
            nomeUsuario.innerHTML = usuario
        } else {            
            swal({
                text: "Digite um nome de usuario:",
                content: "input",
                button: true,
            })
            .then((name) => {       
                usuario = name
                localStorage.setItem("usuario",usuario)
                dinheiro = 500
                dinheiroPlayer.innerHTML = dinheiro
                nomeUsuario.innerHTML = usuario
            })
        }
    })
}