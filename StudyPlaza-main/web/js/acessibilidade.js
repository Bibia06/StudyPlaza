/*
  acessibilidade.js
  - Controles de acessibilidade da interface:
    * ajuste de tamanho da fonte (zoom de fonte)
    * ativar/desativar barra de acessibilidade
    * arrastar (drag) e persistir posição da(s) barra(s) de acessibilidade
  - Comentários explicativos adicionados para facilitar manutenção e melhoria.
*/

document.addEventListener('DOMContentLoaded', () => {
    // Referência à barra principal (pode conter botões de contraste, fonte, etc.)
    const barra = document.getElementById('barra-acessibilidade');
  
    // Valores de configuração para zoom de fonte (porcentagem)
    window.fonteAtual = 100; // 100% representa o tamanho padrão
    const maxFonte = 150;    // limite máximo permitido (150%)
    const minFonte = 80;     // limite mínimo permitido (80%)
  
    // Função global para aumentar a fonte em 10% até o máximo
    window.zoommais = function () {
      if (fonteAtual < maxFonte) {
        fonteAtual += 10;
        aplicarZoomFonte();
      }
    };
  
    // Função global para diminuir a fonte em 10% até o mínimo
    window.zoommenos = function () {
      if (fonteAtual > minFonte) {
        fonteAtual -= 10;
        aplicarZoomFonte();
      }
    };
  
    // Aplica o tamanho de fonte atual ao elemento :root (html) usando porcentagem
    // Benefício: herda para toda a página quando estilos usam rem/em relativos a root
    function aplicarZoomFonte() {
      document.documentElement.style.fontSize = `${fonteAtual}%`;
    }
  });
  
  
  
  // Funções para ativar/desativar uma barra de acessibilidade secundária (ex.: versão compacta)
  // Observação: assumem que existem elementos com ids "barra" e "botaobarra" no DOM.
  function ativarbarra(){
      let barra = document.getElementById("barra");
      let botaobarra = document.getElementById("botaobarra");
  
      // Esconde o botão que abre a barra e mostra a própria barra
      botaobarra.style.display = "none";
      barra.style.display = "flex";
  }
  
  function desativarbarra(){
      let barra = document.getElementById("barra");
      let botaobarra = document.getElementById("botaobarra");
  
      // Restaura o estado inicial: mostra o botão e oculta a barra
      botaobarra.style.display = "flex";
      barra.style.display = "none";
  }
