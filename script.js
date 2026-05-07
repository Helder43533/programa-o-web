// Etapa 2: Uso do BOM
window.addEventListener("load", () => {
  console.log("Altura da janela do usuário:", window.innerHeight);
});

// Seleção dos elementos do DOM
const formFeedback = document.getElementById("formFeedback");
const titulo = document.getElementById("titulo");
const nota = document.getElementById("nota");
const mensagem = document.getElementById("mensagem");

// URL verdadeira para simular envio de feedback
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Evento de envio do formulário
formFeedback.addEventListener("submit", async (event) => {
  event.preventDefault();

  const notaSelecionada = nota.value;

  if (!notaSelecionada) {
    mensagem.textContent = "Por favor, selecione uma nota antes de enviar.";
    mensagem.style.color = "red";
    return;
  }

  // Dinamismo: altera o texto do H1 após o clique/envio
  titulo.textContent = "Obrigado pelo seu feedback!";

  const feedback = {
    nota: notaSelecionada,
    data_envio: new Date().toISOString()
  };

  try {
    // Etapa 3: tentativa de envio via Fetch com método POST
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(feedback)
    });

    if (!resposta.ok) {
      throw new Error("Erro ao enviar feedback para o servidor.");
    }

    mensagem.textContent = "Avaliação enviada com sucesso!";
    mensagem.style.color = "green";

  } catch (erro) {
    console.error("Falha na rede:", erro);

    // Fallback offline
    salvarFeedbackOffline(feedback);

    mensagem.textContent = "Sem conexão. A avaliação foi guardada localmente.";
    mensagem.style.color = "orange";
  }

  formFeedback.reset();
});

// Função para simular salvamento local em caso de falha na rede
function salvarFeedbackOffline(feedback) {
  let feedbacksPendentes = JSON.parse(localStorage.getItem("feedbacks_pendentes")) || [];

  feedbacksPendentes.push({
    id: Date.now(),
    nota: feedback.nota,
    data_envio: feedback.data_envio
  });

  localStorage.setItem("feedbacks_pendentes", JSON.stringify(feedbacksPendentes));

  console.log("Feedback guardado localmente:", feedbacksPendentes);
}
