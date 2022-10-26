// -- --------------
// -- Classe Knight - Carrega quando o heroi Morreu, foi necessario
// -- usar porque o P5.js tem controlos limitados para gifs, a melhor
// -- solucao foi criar um objeto e destruilo para reiniciar a animacao
// -- --------------
class Knight {

    constructor(px, py) {
        // -- posição
        this.x;
        this.y;

        this.animaDL = loadImage('media/chars/knight/knight_dying_left.gif');
        this.animaDR = loadImage('media/chars/knight/knight_dying_right.gif');
        this.animaSR = loadImage('media/chars/knight/knight_standing_right.gif');
        this.animaSL = loadImage('media/chars/knight/knight_standing_left.gif');

        // -- posiciona o knight
        this.x = px;
        this.y = py;
        this.aStatus;
    }

    // -- Mostra a animacao do knight a morrer
    mostraAnimacao(lado){
      this.aStatus = lado;
      eval('image(this.anima' + this.aStatus + ', this.x, this.y);');
    }

}
