const questions = [
    {
        question: "Qual é o principal objetivo da plataforma Study Plaza?",
        options: [
            "Oferecer videoaulas para concursos",
            "Criar uma rede social para professores",
            "Promover o aprendizado colaborativo entre estudantes",
            "Fornecer apenas cursos pagos"
        ],
        answer: "Promover o aprendizado colaborativo entre estudantes"
    },
    {
        question: "Como a IA é usada na Study Plaza?",
        options: [
            "Para corrigir provas escritas automaticamente",
            "Para sugerir temas de redação",
            "Para gerar quizzes personalizados com base no conteúdo compartilhado",
            "Para gravar vídeos explicativos com avatares"
        ],
        answer: "Para gerar quizzes personalizados com base no conteúdo compartilhado"
    },
    {
        question: "Por que a Study Plaza é considerada acessível para diferentes perfis de estudantes?",
        options: [
            "Porque só funciona em escolas conveniadas",
            "Porque exige dedicação em horário fixo",
            "Porque oferece recursos acessíveis e flexíveis em diferentes dispositivos",
            "Porque obriga o uso de computador avançado"
        ],
        answer: "Porque oferece recursos acessíveis e flexíveis em diferentes dispositivos"
    }
];

let current = 0;
let correctCount = 0;
let wrongCount = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const progressBar = document.getElementById("progress-bar");

function showQuestion() {
    const q = questions[current];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = "";
    resultEl.textContent = "";

    q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option);
        optionsEl.appendChild(btn);
    });

    progressBar.style.width = `${(current / questions.length) * 100}%`;

}

function checkAnswer(selected) {
    const correct = questions[current].answer;
    if (selected === correct) {
        correctCount++;
        resultEl.textContent = "✅ Resposta correta!";
        resultEl.style.color = "#45b94bff";
    } else {
        wrongCount++;
        resultEl.textContent = `❌ Resposta incorreta. Resposta correta: ${correct}`;
        resultEl.style.color = "#720000ff";
    }

    setTimeout(() => {
        current++;
        if (current < questions.length) {
            showQuestion();
        } else {
            showFinalResult();
        }
    }, 2000);
}

function showFinalResult() {
    questionEl.textContent = "Parabéns, você completou o quiz!";
    optionsEl.innerHTML = "";
    resultEl.innerHTML = `
        <p>✅ Acertos: <strong>${correctCount}</strong></p>
        <p>❌ Erros: <strong>${wrongCount}</strong></p>
        <p>🚀 Quer desafios personalizados? <a href="cadastro.html" style="color: var(--roxo-principal); font-weight: bold;">Cadastre-se agora</a> e explore quizzes completos!</p>
    `;

    progressBar.style.width = "100%";
}

showQuestion();