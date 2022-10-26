// -- --------------
// -- Classe PowerUp
// -- --------------
class PowerUp {

    constructor(px, py, escola1) {
        // -- posição
        this.x;
        this.y;

        // -- Armazena a escola
        this.aescola = escola1;


        // -- Imagem do logo da Escola usando a variavel escola

        this.logo = loadImage('media/logos/' + this.aescola + '.png');

        // -- -------------------

        // -- Inicia variaveis para armazenar o tamanho das imagens

        this.w2;
        this.h2;

        // -- posiciona o PowerUp
        this.x = px;
        this.y = py;

        // // -- Define que bonus o PowerUp atribui

        this.hBonus;
        this.aBonus;
        this.dBonus;
    }

    // -- Mostra os powerups e recolhe os valores para testar as colisoes
    desenhaPowerUp(){
      fill(255, 255, 255);
      noStroke();
      rectMode(CENTER);
      rect(this.x, this.y, 100, 50, 5);
      image(this.logo, this.x, this.y);
      rectMode(CORNER);
      // -- Get image size for collision detection
      this.w2 = this.logo.width;
      this.h2 = this.logo.height;
    }

}
