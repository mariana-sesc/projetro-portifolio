/* =========================================================
   PORTFÓLIO DE MARIANA ARRUDA — JAVASCRIPT
   Interações: tema, menu mobile, texto animado, entradas e topo.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Seleciona os elementos que serão controlados por este arquivo.
  const corpoPagina = document.body;
  const botaoTema = document.getElementById("botao-tema");
  const botaoMenu = document.getElementById("botao-menu");
  const listaMenu = document.getElementById("lista-menu");
  const botaoTopo = document.getElementById("botao-topo");
  const textoDigitando = document.getElementById("texto-digitando");
  const anoAtual = document.getElementById("ano-atual");
  const prefereMovimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Atualiza o ano automaticamente para não precisar editar o rodapé todo ano.
  if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
  }

  // Recupera a preferência de tema, se o navegador permitir o uso do armazenamento.
  let temaSalvo = null;
  try {
    temaSalvo = localStorage.getItem("tema-portfolio-mariana");
  } catch (erro) {
    // O site continua funcionando mesmo quando o armazenamento está bloqueado.
  }

  if (temaSalvo === "claro") {
    corpoPagina.classList.add("tema-claro");
  }

  // Atualiza ícone, descrição acessível e cor da barra do navegador.
  function atualizarBotaoTema() {
    const temaClaroAtivo = corpoPagina.classList.contains("tema-claro");

    if (temaClaroAtivo) {
      botaoTema.innerHTML = '<i class="bi bi-moon-stars-fill" aria-hidden="true"></i>';
      botaoTema.setAttribute("aria-label", "Ativar tema escuro");
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#fff8fd");
    } else {
      botaoTema.innerHTML = '<i class="bi bi-sun-fill" aria-hidden="true"></i>';
      botaoTema.setAttribute("aria-label", "Ativar tema claro");
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#190d25");
    }
  }

  atualizarBotaoTema();

  botaoTema.addEventListener("click", function () {
    corpoPagina.classList.toggle("tema-claro");
    const novoTema = corpoPagina.classList.contains("tema-claro") ? "claro" : "escuro";

    try {
      localStorage.setItem("tema-portfolio-mariana", novoTema);
    } catch (erro) {
      // A troca de tema continua ativa durante esta visita.
    }

    atualizarBotaoTema();
  });

  // Menu hambúrguer: abre e fecha a navegação em telas menores.
  function fecharMenu() {
    listaMenu.classList.remove("menu-aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");
    botaoMenu.innerHTML = '<i class="bi bi-list" aria-hidden="true"></i>';
  }

  botaoMenu.addEventListener("click", function () {
    const menuEstaAberto = listaMenu.classList.toggle("menu-aberto");

    botaoMenu.setAttribute("aria-expanded", String(menuEstaAberto));
    botaoMenu.setAttribute("aria-label", menuEstaAberto ? "Fechar menu" : "Abrir menu");
    botaoMenu.innerHTML = menuEstaAberto
      ? '<i class="bi bi-x-lg" aria-hidden="true"></i>'
      : '<i class="bi bi-list" aria-hidden="true"></i>';
  });

  // Fecha o menu depois que a pessoa escolhe uma seção.
  listaMenu.querySelectorAll("a").forEach(function (linkMenu) {
    linkMenu.addEventListener("click", fecharMenu);
  });

  // Se a janela voltar para o tamanho desktop, garante que o menu não fique preso aberto.
  window.addEventListener("resize", function () {
    if (window.innerWidth > 720) {
      fecharMenu();
    }
  });

  // Efeito máquina de escrever com frases relacionadas à jornada da Mariana.
  if (textoDigitando && !prefereMovimentoReduzido) {
    const frases = [
      "Aprendendo e criando com tecnologia",
      "Estudante de Informática",
      "Transformando ideias em projetos"
    ];

    let indiceFrase = 0;
    let indiceLetra = 0;
    let apagando = false;

    function animarTexto() {
      const fraseAtual = frases[indiceFrase];

      indiceLetra += apagando ? -1 : 1;
      textoDigitando.textContent = fraseAtual.substring(0, indiceLetra);

      let intervalo = apagando ? 32 : 58;

      if (!apagando && indiceLetra === fraseAtual.length) {
        apagando = true;
        intervalo = 1450; // Pausa para permitir a leitura da frase completa.
      } else if (apagando && indiceLetra === 0) {
        apagando = false;
        indiceFrase = (indiceFrase + 1) % frases.length;
        intervalo = 300;
      }

      window.setTimeout(animarTexto, intervalo);
    }

    textoDigitando.textContent = "";
    animarTexto();
  }

  // Anima os blocos quando eles entram na área visível da tela.
  const elementosAnimados = document.querySelectorAll(".animar-entrada");

  if ("IntersectionObserver" in window && !prefereMovimentoReduzido) {
    const observador = new IntersectionObserver(function (entradas, observadorAtual) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observadorAtual.unobserve(entrada.target); // Anima só na primeira aparição.
        }
      });
    }, { threshold: 0.12 });

    elementosAnimados.forEach(function (elemento) {
      observador.observe(elemento);
    });
  } else {
    // Alternativa para navegadores antigos ou pessoas que preferem menos animações.
    elementosAnimados.forEach(function (elemento) {
      elemento.classList.add("visivel");
    });
  }

  // Exibe o botão de voltar ao topo depois de rolar a página.
  function verificarRolagem() {
    botaoTopo.classList.toggle("visivel", window.scrollY > 350);
  }

  window.addEventListener("scroll", verificarRolagem, { passive: true });
  verificarRolagem();

  botaoTopo.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: prefereMovimentoReduzido ? "auto" : "smooth"
    });
  });
});
