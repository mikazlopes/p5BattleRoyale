// -- --------------
// -- Classe Inimigo
// -- --------------
class Inimigo {

    constructor(px, py) {
        // -- posição
        this.x;
        this.y;

        // -- Componentes (x,y) da velocidade, preciso um Array porque
        // -- durante o combate a velocidade devia ser 0
        this.myvx = [];
        this.myvy = [];

        // -- Componentes da velocidade e direção
        this.myvel, this.mydir;

        // -- Imagem do Inimigo e preparar animacao GIF
        this.loadWR = loadImage('media/chars/inimigo/knight_walking_right.gif');
        this.loadWL = loadImage('media/chars/inimigo/knight_walking_left.gif');
        this.loadAL = loadImage('media/chars/inimigo/knight_attacking_left.gif');
        this.loadAR = loadImage('media/chars/inimigo/knight_attacking_right.gif');
        this.loadDL = loadImage('media/chars/inimigo/knight_dying_left.gif');
        this.loadDR = loadImage('media/chars/inimigo/knight_dying_right.gif');
        // -- -------------------

        // -- Inicia variaveis para armazenar o tamanho das imagens

        this.w2;
        this.h2;

        // -- posiciona o inimigo
        this.x = px;
        this.y = py;

        // -- Estado do movimento para carregar a imagem inicial

        this.iStatus = 'WR';

        // -- velocidade aleatória
        this.myvel = random(2, 5);

        // -- direccao aleatoria
        this.mydir = random(0, 1) * 2 * PI;

        this.myvx[0] = this.myvel * cos(this.mydir);
        this.myvy[0] = this.myvel * sin(this.mydir);

        // -- Atributos do inimigo

        this.iHealth = 50;
        this.iDamage = 0.1;
        this.iDefense = 0.02;
    }

    //Funcao a executar quando o inimigo morre
    morreu(){
      eval('image(this.load' + this.iStatus + ', this.x, this.y);');
    }

    // -- Desenha as barras de energia acima dos inimigos

    iBarraEnergia(){
      fill(255, 0, 0);
      noStroke();
      rect(this.x - 25, this.y - 70, 100 / 2, 100 / 10, 20);
      fill(50, 200, 125);
      noStroke();
      rect(this.x - 25, this.y - 70, this.iHealth, 100 / 10, 20);
    }


    // -- Funcao que mostra e faz o inimigo mover-se
    moveInimigo() {
      // -- So executa se o Inimigo nao estiver morto
      if (this.iStatus != 'DL' && this.iStatus != 'DR' ){
        // -- Carrega o GIF correto para o estado do inimigo
        eval('image(this.load' + this.iStatus + ', this.x, this.y);');
        // -- Desenha Barra de Energia do Inimigos
        fill(255, 0, 0);
        noStroke();
        rect(this.x - 25, this.y - 70, 100 / 2, 100 / 10, 20);
        fill(50, 200, 125);
        noStroke();
        rect(this.x - 25, this.y - 70, this.iHealth, 100 / 10, 20);
        // -- necessario saber as medidas das imagens para testar as colisoes
        eval('this.w2 = this.load' + this.iStatus + '.width;');
        eval('this.h2 = this.load' + this.iStatus + '.height;');
        // -- Move o inimigo e verifica que lado o inimigo esta virado
        if (this.iStatus == 'WL' || this.iStatus == 'WR'){
          this.dir1 = this.x;
          this.x += this.myvx[0];
          this.y += this.myvy[0];
          this.dir2 = this.x;
        }else{
          this.myvx[1] = 0;
          this.myvy[1] = 0;
          this.x += this.myvx[1];
          this.y += this.myvy[1];
        }

          // -- Verifica em que direcao o Inimigo se move em x para saber
          // -- que imagem carregar
          if (this.dir1 >= this.dir2){
            this.iStatus = 'WL';
          }

          if (this.dir1 < this.dir2){
            this.iStatus = 'WR';
          }



    // -- Verifica se saiu fora do stage considerando o tamanho da imagem 100 x 100
    if ( this.x > width - 25  ||  this.x < 25  ||  this.y > height - 100  ||  this.y < height / 15 + 70 ){

        // -- reflecte nas paredes
        if (this.x > width - 25 ) {
            this.x = width - 25;
            this.myvx[0] = - this.myvx[0];
            this.iStatus = 'WL';
        }

        if (this.y > height - 100) {
            this.y = height - 100;
            this.myvy[0] = - this.myvy[0];
        }

        if (this.x < 25 ) {
            this.x = 25;
            this.myvx[0] = - this.myvx[0];
            this.iStatus = 'WR';
        }
        // -- Topo leva em consideracao o espaco para a pontuacao e painel de baixo
        if (this.y < height / 15 + 70 ) {
            this.y = height / 15 + 70;
            this.myvy[0] = - this.myvy[0];
        }
      }
    }else{
      // -- Executa a animacao com a morte do inimigo
      this.morreu();
    }
  }
}
