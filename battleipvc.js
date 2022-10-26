// -- -------------------------------------------------------
// -- IPVC Battle Royale
// -- Exercicio Pratico 1
// -- Miguel Lopes 4049
// -- -------------------------------------------------------

//Variavel para imagem de background e personagens
let knightSR;
let knightSL;
let knightAL;
let knightAR;
let knightDL;
let knightDR;
let knightWR;
let knightWL;
let ecgmLogo;
let bg;

// -- Variavel para o microfone

var mic;

// -- Numero de Inimigos

let numInimigos;

// -- Inicializa Arrays para objetos

let arrayInimigos = [];
let arrayKnightM = [];
let arrayPowerUps = [];

// -- Inicializa Arrays para as escolas

let arrayEscolas = ['esa', 'esce', 'esdl', 'ese', 'ess', 'estg'];

// -- Variáveis que guardam o estado das teclas (cursores de teclado)
let estado_keyUp     = false;
let estado_keyDown   = false;
let estado_keyRight  = false;
let estado_keyLeft   = false;

// -- Precisamos variaveis globais que guardam a ultima posicao
// -- para poder trocar as animacoes
let vX   = 5.0;
let posX = 100;
let vY   = 5.0;
let posY = 100;
// -- Precisamos variaveis globais que guardam a ultima posicao
// -- para poder trocar as animacoes
let kStatus;

// -- Variaveis para audio
let somFundo, idying1, idying2, kdying, fighting, pwsound, horn;
// -- Usado para a barra que captura o audio
let som;
let threshold;

// -- Variaveis para atributos do Knight inclusive as que guardam
// -- Os valores antes dos powerups para repor quando o tempo acaba
let kHealth;
let kDamage;
let orKnightDamage;
let kDefense;
let orKnightDefense;
// -- Variaveis usadas para passar valorer quando o ataque e critico
let kCritical;
let iCritical;
// -- Variavel que mantem a pontuacao
let pontuacao;
// -- Variaveis para o temporizador
let intervalo;
let segundos;
// -- Variaveis que controla o limite de PowerUps simultaneos
// -- Uma flag que indica enquanto o efeito esta activo e um
// -- counter para indicar quantos estao stacked
let limPowerUps;
let pwAtivo = false;
let pwCounter;
// -- Verifica se o jogo acabou para iniciar o ecra com o resultado
let gameOver = false;

// -- Flag para por um ecran no inicio e Forcar um click inicial por causa do som
let eInicial;

// -- Carrega os gifs e outras imagens
function preload(){
  knightSR = loadImage('media/chars/knight/knight_standing_right.gif');
  knightSL = loadImage('media/chars/knight/knight_standing_left.gif');
  knightAL = loadImage('media/chars/knight/knight_attacking_left.gif');
  knightAR = loadImage('media/chars/knight/knight_attacking_right.gif');
  knightWR = loadImage('media/chars/knight/knight_walking_right.gif');
  knightWL = loadImage('media/chars/knight/knight_walking_left.gif');
  knightDL = loadImage('media/chars/knight/knight_dying_left.gif');
  knightDR = loadImage('media/chars/knight/knight_dying_right.gif');
  ecgmLogo = loadImage('media/logos/ECGM1.png');
  bg = loadImage('media/background.jpg');

  // -- o áudio para os varios eventos
  soundFormats('mp3', 'ogg', 'wav');
  somFundo = loadSound("media/sound/background.mp3");
  idying1 = loadSound("media/sound/idying1.mp3");
  idying2 = loadSound("media/sound/idying2.mp3");
  kdying = loadSound("media/sound/kdying.mp3");
  kdying = loadSound("media/sound/kdying.mp3");
  fighting = loadSound("media/sound/fight.mp3");
  pwsound = loadSound("media/sound/powerup.mp3");
}


function setup() {
  createCanvas (1000, 800);
  smooth();       // -- incrementa a qualidade das imagens quando "resized"
  frameRate(30);
  // -- Musica de fundo, alter o volume
  somFundo.loop();
  somFundo.setVolume(0.3);

  // -- Criar um Audio input
  mic = new p5.AudioIn();

  // -- Forcar ecran inicial para ter um clique
  eInicial = false;

  // -- Inicia parametros iniciais
  initJogo();
}


function draw() {

  // -- Por imagem como background
  imageMode(CORNER);
  background (255);
  image(bg,0,0);
  imageMode(CENTER);

  // -- Desenha o Knight e mostra o knight, inicia as detetaTeclasKnight
  // -- que o controlam
  desenhaKnight();
  detetaTeclasKnight();
  // -- mostra e aplica o codigo que movimenta os inimogos
  movimentaInimigos();
  // -- Desenha os paineis de informacao
  desenhaTopo();
  desenhaBaixo();
  // -- Deteta Colisoes e ativa a funcao para mostrar os PowerUps
  detetaColisaoInimigos();
  detetaColisaoPowerUpsKnight();
  detetaColisaoPowerUpsInimigos();
  // -- Testa se o som foi alto o suficiente para fazer aparecer um PowerUp
  eventoAudio();
  mostraPowerUp();

  // -- Reseta atributos se PowerUp expirar
  if (pwAtivo == false){
    kDamage = orKnightDamage;
    kDefense = orKnightDefense;
    pwCounter = 0;
  }

  // -- Usado so se precisar testar codigo ou fazer Console.logs
  testaCodigo();

  // -- Verifica se o Jogo terminou
  if (gameOver){
    terminaJogo();
  }
  // -- Ecran Inicial com instrucoes

  if(eInicial == false){ecranInicial();}

}

// -- Funcao usada para testar codigo

function testaCodigo(){
  //console.log(getAudioContext().state);
  //console.log(som);
}


function initJogo(){

// -- Funcao utilizada para iniciar os parametros do jogo
// -- em caso de ser a primeira vez ou se e para reiniciar

  gameOver = false;


  // -- Iniciar o Audio Input.
  mic.start();

  // -- Limpa intervalo para Temporizador e reinicia
  clearInterval(intervalo);
  segundos = 10;
  intervalo = setInterval(tempoRestante, 1000);

  // -- Remove o Objeto knight que morreu caso exista (jogo reiniciou)
  if (arrayKnightM.length > 0){
    arrayKnightM.splice(0,1);
  }

  // -- Reinicia Variaveis e define numero de Inimigos
  // -- e PowerUps que aparecem em simultaneo
  textSize(16);
  kStatus = 'SR';
  numInimigos = 15;
  pontuacao = 0;
  limPowerUps = 2;
  pwCounter = 0;
  threshold = 0.1;


  // -- Inicia os Inimigos
  initInimigos();

  // -- Inicia a funcao para animar a morte do Knight
  initKmorreu();

  //Atributos Iniciais e originais para calcular os valores
  // -- apos terminar o efeito do bonus
  kHealth = 50;
  kDamage = 0.06;
  kDefense = 0.03;
  orKnightDamage = kDamage;
  orKnightDefense = kDefense;
}

// -- Ecran inicial com instrucoes
function ecranInicial(){
  background(50, 200, 125);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text('Bem vindo a Battle Royale IPVC', width / 2, height / 2 - 100);
  textSize(20);
  text('Use as teclas direcionais para controlar o Knight e diga "Powerup" alto para aparecer um bonus' ,width / 2, height / 2 - 50);
  text('Derrote todos os inimigos com ajuda dos PowerUps' ,width / 2, height / 2 - 0);
  text('Clique com o rato para comecar' ,width / 2, height / 2 + 50);
  noLoop();
}

function desenhaKnight(){

  // -- Verifica o kStatus para saber que animacao carregar
  eval('image(knight' + kStatus + ', posX, posY);');

}

// -- Desenha a info na parte de cima e mostra info

function desenhaTopo(){
  // -- Mostra a Pontuacao e Tempo restante do bonus
  fill(0, 102, 204);
  rect(0, 0, width, height / 15);
  fill(255, 255, 255); // -- Cor da fonte
  textSize(16);
  textAlign(LEFT,CENTER);
  // -- Mostra Inimigos e Pontuacao
  text ("Inimigos: " + numInimigos, 400, height / 30);
  text ("Pontuacao: " + pontuacao, 200, height / 30);
  // -- Desenha a barra de energia do jogador
  fill(255, 0, 0);
  noStroke();
  rectMode(CORNER);
  rect(20, 13, 100, height / 30, 30);
  fill(50, 200, 125);
  noStroke();
  rect(20, 13, kHealth * 2, height / 30, 30);
  fill(255);
  textAlign(CENTER,CENTER);
  textSize(12);
  text("Energia: " + Math.round(kHealth) + "/50", 70, height / 30);
}

// -- Desenha a parte de baixo e mostra info
function desenhaBaixo(){
  fill(0, 0, 0);
  rect(0, height - (height / 10), width, height / 10);
  fill(255, 255, 255); // -- Cor da fonte
  textSize(16);
  textAlign(LEFT,CENTER);
  // -- Mostra PowerUps (efeitos e tempo restante do PowerUp)
  text ('PWs Ativos: ' + pwCounter, 400, height - 35);
  text ('PWs Duracao: ' + segundos , 200, height - 35);
  textAlign(RIGHT,CENTER);
  text ('Miguel Lopes - 4049' , width - 120, height - 16);
  textAlign(CENTER,CENTER);
  image(ecgmLogo, width - 60, height - 16);


  // -- Desenha rectangulo que mostra nivel de audio e threshold
  var x = map(som, 0, 1, 0, 100);
  var xLimite = map(threshold, 0, 1, 0, 100);

  noStroke();
  fill(175);
  rect(20, height - 50, 100, 25);

  // -- De seguida desenha um retângulo, com tamanho baseado no som
  fill(0, 102, 204);
  rect(20, height - 50, x, 25);
  stroke(0, 102, 204);
  line(xLimite + 20, height - 50, xLimite + 20, height - 25);

}

// -- Inicia os objetos inimigos
function initInimigos(){

  for (var i = 0; i < numInimigos; i++){
    var x = random(0,width);
    var y = random(0,height);
    inimigo = new Inimigo(x, y);
    arrayInimigos.push(inimigo);
  }
}

function movimentaInimigos() {
  if ( arrayInimigos.length > 0 ) {
    for (var j = 0; j < arrayInimigos.length; j++) {
        oinimigo = arrayInimigos[j];
        oinimigo.moveInimigo();
    }
  }
}

// -- Funcao para mudar o estado se as teclas estao pressionadas

function keyPressed() {

    switch (keyCode) {
        case UP_ARROW:
            estado_keyUp = true;
            break;

        case DOWN_ARROW:
            estado_keyDown = true;
            break;

        case LEFT_ARROW:
            estado_keyLeft = true;
            break;

        case RIGHT_ARROW:
            estado_keyRight = true;
            break;

    }

// -- Se o jogo terminou a tecla "1" reinicia o Jogo
    if (gameOver && key === '1') {
      initJogo();
  }

}
  // -- Controla que animacao o Knigh deve ter mediante a tecla
  // -- que foi carregada em ultimo, especialmente para que lado
  // -- o knight tem que ficar virado

function keyReleased() {

    switch (keyCode) {
        case UP_ARROW:
            estado_keyUp = false;
            if (gameOver == false){kStatus = 'SR';}
            break;

        case DOWN_ARROW:
            estado_keyDown = false;
            if (gameOver == false){kStatus = 'SL';}
            break;

        case LEFT_ARROW:
            estado_keyLeft = false;
            if (gameOver == false){kStatus = 'SL';}
            break;

        case RIGHT_ARROW:
            estado_keyRight = false;
            if (gameOver == false){kStatus = 'SR';}
            break;
    }

}

// -- ------------------------------------------------------------------------
// -- detecta Teclas para o Knight caso o jogo nao tenha terminado
// -- -------------------
function detetaTeclasKnight() {

// -- Tem a certeza que o Knight fica no canvas

    if (estado_keyUp) {
      if (gameOver == false && posY > height / 15 + 40){
        posY -= vY;
        kStatus = 'WR';
      }
  }
    if (estado_keyDown) {
      if (gameOver == false && posY < height - 100){
        posY += vY;
        kStatus = 'WL';
      }
    }
    if (estado_keyLeft) {
      if (gameOver == false && posX > 0){
        posX -= vX;
        kStatus = 'WL';
      }
    }
    if (estado_keyRight) {
      if (gameOver == false && posX < width){
        posX += vX;
        kStatus = 'WR';
      }
    }
}



// -- Deteta Colisoes com Inimigos

function detetaColisaoInimigos() {

  for (i = 0; i < arrayInimigos.length; i++){
    // -- Carrega os objetos numa variavel
    oInimigo = arrayInimigos[i];
    // -- Carrega os atributos da imagem do knight
    eval('w1 = knight' + kStatus + '.width;');
    eval('h1 = knight' + kStatus + '.height;');
    // Testa Colisoes caso o Inimigo nao tenha morrido
    if (oInimigo.iStatus != 'DL' && oInimigo.iStatus != 'DR'){
      if (posX + w1 / 3 >= oInimigo.x - oInimigo.w2 / 3 && posX - w1 / 3 <= oInimigo.x + oInimigo.w2 / 3 && posY + h1 / 3 >= oInimigo.y - oInimigo.h2 / 3 && posY - h1 / 3 <= oInimigo.y + oInimigo.h2 / 3) {
        if (oInimigo.x > posX){
          // -- Detetar se o inimigo esta a lutar do lado direito ou esquerdo
          kStatus = 'AR';
          oInimigo.iStatus = 'AL';
        }else{
          kStatus = 'AL';
          oInimigo.iStatus = 'AR';
        }
        // -- Inicia a funcao batalha para calcular dano e envia o Inimigo
        batalha(oInimigo);
      }
    }
  }
}

// -- Deteta colisoes do Knight com os PowerUps

function detetaColisaoPowerUpsKnight(){

  if (arrayPowerUps.length > 0){
    // -- Loop para verificar se o Knight colide com um Powerup
    for (i = 0; i < arrayPowerUps.length; i++){
      // -- Carrega os objetos numa variavel
      oPW = arrayPowerUps[i];
      // -- Carrega os atributos da imagem do knight
      eval('w1 = knight' + kStatus + '.width;');
      eval('h1 = knight' + kStatus + '.height;');

      if (posX + w1 / 3 >= oPW.x - oPW.w2 / 3 && posX - w1 / 3 <= oPW.x + oPW.w2 / 3 && posY + h1 / 3 >= oPW.y - oPW.h2 / 3 && posY - h1 / 3 <= oPW.y + oPW.h2 / 3) {

        // -- Inicia a funcao que adiciona o bonus ao Knight
        pontuacao = pontuacao + 5;
        who = 'k';
        adicionaPWBonus(oPW.aescola, who, null);
        pwsound.play();
        pwAtivo = true;
        segundos = 10;
        pwCounter++;
        var index = arrayPowerUps.indexOf(oPW);
        arrayPowerUps.splice(index,1);
      }
    }
  }
}

// -- Temporizador para o bonus

function tempoRestante(){

  if (pwAtivo && segundos > 0) {
      segundos--;
  } else {
          pwAtivo = false;
          pwCounter = 0;
          }
}

// -- Deteta colisoes dos Inimigos com os PowerUps

function detetaColisaoPowerUpsInimigos(){

  if (arrayPowerUps.length > 0){

    for (j = 0; j < arrayInimigos.length; j++){

      lutador = arrayInimigos[j];
      // -- verifica se o inimigo morreu, neese caso nao testa colisao
      if (lutador.iStatus != 'DL' && lutador.iStatus != 'DR'){

        for (m = 0; m < arrayPowerUps.length; m++){
          // -- Carrega os objetos numa variavel
          oPW = arrayPowerUps[m];

          if (lutador.x + lutador.w2 / 3 >= oPW.x - oPW.w2 / 3 && lutador.x - lutador.w2 / 3 <= oPW.x + oPW.w2 / 3 && lutador.y + lutador.h2 / 3 >= oPW.y - oPW.h2 / 3 && lutador.y - lutador.h2 / 3 <= oPW.y + oPW.h2 / 3) {

            // -- Inicia a funcao que adiciona o bonus ao Inimigo
            who = 'i';
            adicionaPWBonus(oPW.aescola, who, arrayInimigos[j]);
            var index = arrayPowerUps.indexOf(oPW);
            arrayPowerUps.splice(index,1);
          }
        }
      }
    }
  }
}

function adicionaPWBonus(pw, quem, inimigo){
  // -- Adiciona o bonus dependendo da escola, bonus fazem
  // -- stacking e resetam o temporizador
  switch (pw) {
      case 'esa':
          if(quem == 'k' && pwAtivo){kDefense = kDefense * 1.3;}
          if(quem == 'i'){inimigo.iDefense = inimigo.iDefense * 1.3;}
          break;

      case 'esce':
          if(quem == 'k'){
            kDamage = kDamage * 1.15;
            kDefense = kDefense * 1.15;
          }
          if(quem == 'i'){
            inimigo.iDamage = inimigo.iDamage * 1.15;
            inimigo.iDefense = inimigo.iDefense * 1.15;
          }
          break;

      case 'esdl':
          if(quem == 'k'){kDefense = kDefense * 1.25;}
          if(quem == 'i'){inimigo.iDefense = inimigo.iDefense * 1.25;}
          break;

      case 'ese':
          if(quem == 'k'){kDamage = kDamage * 1.25;}
          if(quem == 'i'){inimigo.iDamage = inimigo.iDamage * 1.25;}
          break;

      case 'ess':
          if(quem == 'k'){kHealth = 50;}
          if(quem == 'i'){inimigo.iHealth = 50;}
          break;

      case 'estg':
        if(quem == 'k'){
          kDamage = kDamage * 1.40;
          kDefense = kDefense * 1.40;
        }
        if(quem == 'i'){
          inimigo.iDamage = inimigo.iDamage * 1.40;
          inimigo.iDefense = inimigo.iDefense * 1.40;
        }
          break;
  }
}

// -- Funcao que calcula as batalhas

function batalha(lutador){

  // -- Se o som ja esta a tocar nao faz overlap
  if (fighting.isPlaying() == false){
    fighting.play();
  }

  // -- Calcula dano infligido pelo Knight e pelo Inimigo e aplica
  // -- Acrescenta alguma aleatoridade no dano em forma de %

  kCritical = random(1,2);
  iCritical = random(1,2);
  danoKCalc = kDamage * kCritical - lutador.iDefense;
  danoICalc = lutador.iDamage * iCritical - kDefense;

  // -- Se a defesa e maior que o ataque entao o dano e zero
  if (danoKCalc < 0){danoKCalc = 0;}
  if (danoICalc < 0){danoICalc = 0;}

  // -- Atualiza os Hit Points
  kHealth = kHealth - danoICalc;
  lutador.iHealth = lutador.iHealth - danoKCalc;

  // -- Verifica se deu Dano Critico

  if (kCritical > 1.9 || iCritical > 1.9){
    danoCritico(lutador);
  }

  // -- Atualiza Barra de Energia
  lutador.iBarraEnergia();


  // -- Verifica se alguem ficou com 0 Health e que lado estava
  // -- o inimigo quando Morreu
  if (lutador.iHealth < 1){
    // -- Reduz o counter inimigos e toca um de dois sons em que o
    // -- inimigo morre, aumenta a pontuacao
    numInimigos--;
    eval('idying'+ Math.round(random(1,2)) + '.play();');
    pontuacao = pontuacao + 10;
    // -- Verifica se o knight ou o inimigo morreram
    if (lutador.iStatus == 'AL'){
        lutador.iStatus = 'DL';
        kStatus = 'SR';
      }else{
        lutador.iStatus = 'DR';
        kStatus = 'SL';
      }
    if (numInimigos == 0){
      gameOver = true;
      resultado = 'Ganhou';
      }
    }
    if (kHealth < 1){
      if (kStatus == 'AL' || kStatus == 'SL'){
          kStatus = 'DL';
        }else{
          kStatus = 'DR';
        }
        gameOver = true;
        resultado = 'Perdeu';
        if (kdying.isPlaying() == false){
          kdying.play();
        }
    }
}

function terminaJogo(){
  // -- Termina o Jogo e Publica o resultado, apaga os objetos inimigos e PowerUp
  background(50, 200, 125);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text(resultado + ' o Jogo - Teve ' + pontuacao + ' pontos', width / 2, height / 2 - 100);
  text('Prima 1 para Reiniciar' ,width / 2, height / 2 - 50);
  mic.stop();
  arrayInimigos.splice(0,arrayInimigos.length);
  if (arrayPowerUps.length > 0){
    arrayPowerUps.splice(0,arrayPowerUps.length);
  }
  kMorreu1 = arrayKnightM[0];
  kMorreu1.mostraAnimacao(kStatus);
}

// -- Funcao usada para criar um objeto que mostra a mostra a anumacao
// -- da morte do Knight. Foi necessario para poder reiniciar o GIF
function initKmorreu(){
  kMorreu = new Knight(width / 2, height / 2 + 50);
  arrayKnightM.push(kMorreu);
}


function danoCritico(personagem){
  // -- Se o Random para o Knight for acima de 1.98 (quase duplica dano)
  // -- e considerado um Critical Hit e mostra no jogo

  if (kCritical > 1.9){
    fill(255, 255, 0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text('Critical Hit', posX, posY -90);
  }

  if (iCritical > 1.9){
    fill(255, 255, 0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text('Critical Hit', personagem.x, personagem.y -90);
  }
}

// -- Cria o Objeto PowerUp
function initPowerUps(){
  // -- Estabelece um limite the PowerUps
  if( arrayPowerUps.length < limPowerUps){
    esc = Math.round(random(0,arrayEscolas.length - 1));
    var x = random(0,width - 200);
    var y = random(200,height - 200);
    oPowerUp = new PowerUp( x, y, arrayEscolas[esc]);
    arrayPowerUps.push(oPowerUp);
  }
}

// -- Mostra os PowerUps

function mostraPowerUp(){
  for (i = 0; i < arrayPowerUps.length; i++){
    pUp = arrayPowerUps[i];
    pUp.desenhaPowerUp();
  }
}

 // -- Verifica se ouve som alto o suficiente para criar um PowerUp
function eventoAudio(){

som = mic.getLevel();

// -- Verifica se o input tem mais de 10%
  if (som > threshold){
    initPowerUps();
  }
}

// -- Muda Flag do ecran inicial

function mousePressed(){
  if (eInicial == false){
    eInicial = true;
    loop();
  }
}

//-- ------------------------------------------------------------------------
//-- necessário para ativar o áudio após click no canvas
//-- ---------------------------------------------------
function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}
