// ===============================
// ELEMENTOS DO HTML
// ===============================

const telaInicial = document.getElementById("telaInicial");
const telaJogo = document.getElementById("telaJogo");
const telaFinal = document.getElementById("telaFinal");

const campoJogo = document.getElementById("campoJogo");
const nave = document.getElementById("nave");

const pontuacaoTexto = document.getElementById("pontuacao");
const vidasTexto = document.getElementById("vidas");
const pontuacaoFinal = document.getElementById("pontuacaoFinal");

const mensagemFinal = document.getElementById("mensagemFinal");

const btnJogar = document.getElementById("btnJogar");
const btnNovamente = document.getElementById("btnNovamente");

const btnEsquerda = document.getElementById("btnEsquerda");
const btnDireita = document.getElementById("btnDireita");

const btnCriador = document.getElementById("btnCriador");
const infoCriador = document.getElementById("infoCriador");


// ===============================
// VARIÁVEIS DO JOGO
// ===============================

let pontuacao = 0;

let vidas = 3;

let posicaoNave = 50;

let jogoRodando = false;

let meteoros = [];

let intervaloMeteoros;

let intervaloPontuacao;

let teclas = {
    esquerda: false,
    direita: false
};


// ===============================
// INICIAR JOGO
// ===============================

function iniciarJogo() {

    // Resetar valores
    pontuacao = 0;

    vidas = 3;

    posicaoNave = 50;

    jogoRodando = true;

    // Atualizar tela
    pontuacaoTexto.textContent = pontuacao;
    vidasTexto.textContent = vidas;

    nave.style.left = posicaoNave + "%";


    // Remover meteoros antigos

    meteoros.forEach(function(meteoro) {
        meteoro.remove();
    });

    meteoros = [];


    // Mostrar tela do jogo

    telaInicial.classList.add("escondido");

    telaFinal.classList.add("escondido");

    telaJogo.classList.remove("escondido");


    // Criar meteoros

    intervaloMeteoros = setInterval(criarMeteoro, 900);


    // Aumentar pontuação

    intervaloPontuacao = setInterval(function() {

        if (!jogoRodando) {
            return;
        }

        pontuacao += 5;

        pontuacaoTexto.textContent = pontuacao;


        // Vitória

        if (pontuacao >= 100) {

            terminarJogo(true);

        }

    }, 1000);


    // Começar movimento

    requestAnimationFrame(atualizarJogo);
}


// ===============================
// CRIAR METEORO
// ===============================

function criarMeteoro() {

    if (!jogoRodando) {
        return;
    }

    const meteoro = document.createElement("div");

    meteoro.classList.add("meteoro");

    meteoro.textContent = "☄️";


    // Posição aleatória

    const posicao = Math.random() * 90 + 5;

    meteoro.style.left = posicao + "%";


    // Velocidade

    const velocidade = Math.random() * 3 + 2;

    meteoro.dataset.velocidade = velocidade;


    campoJogo.appendChild(meteoro);

    meteoros.push(meteoro);
}


// ===============================
// ATUALIZAR JOGO
// ===============================

function atualizarJogo() {

    if (!jogoRodando) {
        return;
    }


    // Movimento da nave

    if (teclas.esquerda) {

        posicaoNave -= 1;

    }

    if (teclas.direita) {

        posicaoNave += 1;

    }


    // Impedir sair da tela

    if (posicaoNave < 5) {
        posicaoNave = 5;
    }

    if (posicaoNave > 95) {
        posicaoNave = 95;
    }


    nave.style.left = posicaoNave + "%";


    // Mover meteoros

    meteoros.forEach(function(meteoro, indice) {

        let topo = parseFloat(meteoro.style.top);

        if (isNaN(topo)) {
            topo = -60;
        }


        const velocidade =
            Number(meteoro.dataset.velocidade);


        topo += velocidade;


        meteoro.style.top = topo + "px";


        // Verificar colisão

        if (verificarColisao(nave, meteoro)) {

            meteoro.remove();

            meteoros.splice(indice, 1);

            perderVida();

        }


        // Remover meteoro quando sair da tela

        else if (topo > campoJogo.clientHeight) {

            meteoro.remove();

            meteoros.splice(indice, 1);

        }

    });


    requestAnimationFrame(atualizarJogo);
}


// ===============================
// VERIFICAR COLISÃO
// ===============================

function verificarColisao(objeto1, objeto2) {

    const a = objeto1.getBoundingClientRect();

    const b = objeto2.getBoundingClientRect();


    return (

        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top

    );
}


// ===============================
// PERDER VIDA
// ===============================

function perderVida() {

    vidas--;

    vidasTexto.textContent = vidas;


    if (vidas <= 0) {

        terminarJogo(false);

    }
}


// ===============================
// TERMINAR JOGO
// ===============================

function terminarJogo(vitoria) {

    jogoRodando = false;


    clearInterval(intervaloMeteoros);

    clearInterval(intervaloPontuacao);


    pontuacaoFinal.textContent = pontuacao;


    if (vitoria) {

        mensagemFinal.textContent =
            "🏆 Você venceu!";

    } else {

        mensagemFinal.textContent =
            "💥 Fim de jogo!";

    }


    telaJogo.classList.add("escondido");

    telaFinal.classList.remove("escondido");
}


// ===============================
// TECLADO
// ===============================

document.addEventListener("keydown", function(event) {

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        teclas.esquerda = true;

    }


    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        teclas.direita = true;

    }

});


document.addEventListener("keyup", function(event) {

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        teclas.esquerda = false;

    }


    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        teclas.direita = false;

    }

});


// ===============================
// CONTROLE POR TOQUE
// ===============================

btnEsquerda.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();

        teclas.esquerda = true;

    }
);


btnEsquerda.addEventListener(
    "touchend",
    function() {

        teclas.esquerda = false;

    }
);


btnDireita.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();

        teclas.direita = true;

    }
);


btnDireita.addEventListener(
    "touchend",
    function() {

        teclas.direita = false;

    }
);


// Também permite clicar nos botões no computador

btnEsquerda.addEventListener("mousedown", function() {
    teclas.esquerda = true;
});

btnEsquerda.addEventListener("mouseup", function() {
    teclas.esquerda = false;
});


btnDireita.addEventListener("mousedown", function() {
    teclas.direita = true;
});

btnDireita.addEventListener("mouseup", function() {
    teclas.direita = false;
});


// ===============================
// BOTÕES
// ===============================

btnJogar.addEventListener("click", iniciarJogo);

btnNovamente.addEventListener("click", iniciarJogo);


// ===============================
// CRIADOR DO JOGO
// ===============================

btnCriador.addEventListener("click", function() {

    infoCriador.classList.toggle("escondido");

});
