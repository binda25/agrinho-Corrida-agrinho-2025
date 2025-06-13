let tela = "inicio";
let personagem = "";
let imgInicio;
let jogador;
let itens = [];
let campo = ["🍎", "🥕", "🥚", "🌽"];
let cidade = ["🍔", "📱", "🥤", "🍟"];
let pontos = 0;
let tempo = 30; // duração do jogo
let tempoInicial;

function preload() {
  // Substituindo por uma URL de imagem pública válida
  imgInicio = loadImage("https://www.w3schools.com/w3images/lights.jpg"); // Imagem pública válida
}

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  tempoInicial = millis();
}

function draw() {
  background(200);

  if (tela === "inicio") {
    image(imgInicio, 0, 0, width, height);
  } else if (tela === "jogo") {
    jogo();
  } else if (tela === "fim") {
    fim();
  }
}

function mousePressed() {
  if (tela === "inicio") {
    if (mouseX < width / 2) {
      personagem = "menina";
    } else {
      personagem = "menino";
    }

    jogador = new Jogador();
    tempoInicial = millis();
    tela = "jogo";
  } else if (tela === "fim") {
    pontos = 0;
    itens = [];
    tela = "inicio";
  }
}

function jogo() {
  let tempoRestante = tempo - int((millis() - tempoInicial) / 1000);

  if (tempoRestante <= 0) {
    tela = "fim";
    return;
  }

  fill(255);
  textSize(18);
  textAlign(LEFT);
  text("Pontos: " + pontos, 10, 10);
  text("Tempo: " + tempoRestante + "s", 10, 30);

  jogador.mostrar();
  jogador.mover();

  if (random(1) < 0.03) {
    let tipo = random(["campo", "cidade"]);
    let lista = tipo === "campo" ? campo : cidade;
    let emoji = random(lista);
    itens.push(new Item(emoji, tipo));
  }

  for (let i = itens.length - 1; i >= 0; i--) {
    itens[i].descer();
    itens[i].mostrar();

    if (itens[i].pego(jogador)) {
      if (itens[i].tipo === "campo") {
        pontos++;
      } else {
        pontos--;
      }
      itens.splice(i, 1);
    } else if (itens[i].y > height) {
      itens.splice(i, 1);
    }
  }
}

function fim() {
  background(0);
  fill(255);
  textSize(32);
  text("Fim de Jogo", width / 2, height / 2 - 30);
  textSize(18);
  text("Pontos: " + pontos, width / 2, height / 2 + 30);
  text("Clique para jogar novamente", width / 2, height / 2 + 60);
}

// Classe Jogador
class Jogador {
  constructor() {
    this.x = width / 2;
    this.y = height - 40;
    this.velocidade = 5;
  }

  mostrar() {
    fill(0);
    ellipse(this.x, this.y, 30, 30); // Representação simples do jogador
  }

  mover() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.velocidade;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.velocidade;
    }

    this.x = constrain(this.x, 0, width); // Garante que o jogador não saia da tela
  }
}

// Classe Item
class Item {
  constructor(emoji, tipo) {
    this.emoji = emoji;
    this.tipo = tipo;
    this.x = random(width);
    this.y = -30;
    this.velocidade = random(2, 5); // Velocidade de queda dos itens
  }

  mostrar() {
    textSize(32);
    text(this.emoji, this.x, this.y);
  }

  descer() {
    this.y += this.velocidade;
  }

  pego(jogador) {
    let distancia = dist(this.x, this.y, jogador.x, jogador.y);
    return distancia < 20; // Detecção de colisão simples
  }
}