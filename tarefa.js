// script.js

// Inicializar array de tarefas com o conteúdo do localStorage (ou vazio se não existir)
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isEditing = false; // Flag para identificar se estamos editando uma tarefa
let currentTaskIndex = null; // Índice da tarefa atual sendo editada

// Elementos do DOM
const taskForm = document.getElementById("taskForm");
const taskTableBody = document.querySelector("#taskTable tbody");
const nextTaskDiv = document.getElementById("nextTask");
const submitBtn = document.getElementById("submitBtn");

// Função para salvar tarefas no localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Função para adicionar uma nova tarefa
function addTask(task) {
  tasks.push(task);
  saveTasks();
  displayTasks(); // Exibir todas as tarefas
  displayNextTask(); // Exibir a próxima tarefa
}

// Função para exibir todas as tarefas
function displayTasks() {
  taskTableBody.innerHTML = ""; // Limpa a tabela antes de adicionar novas tarefas
  tasks.forEach((task, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.dueDate ? task.dueDate : "Sem data"}</td>
            <td>${task.insertDate}</td>
            <td>
            <button onclick="editTask(${index})">Editar</button>
            </td>
            <td>
                <button onclick="deleteTask(${index})">Excluir</button>
            </td>
        `;
    taskTableBody.appendChild(row);
  });
}

// Função para exibir a próxima tarefa (a mais urgente)
function displayNextTask() {
  const tasksWithDates = tasks.filter((task) => task.dueDate); // Filtra tarefas com data de entrega
  if (tasksWithDates.length > 0) {
    const sortedTasks = tasksWithDates.sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    ); // Ordena pela data mais próxima
    const nextTask = sortedTasks[0];
    nextTaskDiv.innerHTML = `
            <strong>Tarefa:</strong> ${nextTask.name} <br>
            <strong>Data de Entrega:</strong> ${nextTask.dueDate}
        `;
  } else {
    nextTaskDiv.innerHTML = "Nenhuma tarefa com data de entrega!";
  }
}

// Função para excluir uma tarefa
function deleteTask(index) {
  tasks.splice(index, 1); // Remove a tarefa do array
  saveTasks();
  displayTasks(); // Atualiza a exibição após excluir
  displayNextTask(); // Atualiza a próxima tarefa
}

// Função para editar uma tarefa
function editTask(index) {
  const task = tasks[index];
  document.getElementById("taskName").value = task.name;
  document.getElementById("dueDate").value = task.dueDate ? task.dueDate : "";

  isEditing = true; // Ativar modo de edição
  currentTaskIndex = index; // Armazenar o índice da tarefa atual
  submitBtn.textContent = "Atualizar Tarefa"; // Alterar o texto do botão
}

// Função para atualizar uma tarefa
function updateTask(task) {
  tasks[currentTaskIndex] = task;
  saveTasks();
  displayTasks(); // Exibir todas as tarefas
  displayNextTask(); // Exibir a próxima tarefa
  isEditing = false; // Resetar o modo de edição
  currentTaskIndex = null;
  submitBtn.textContent = "Adicionar Tarefa"; // Voltar o texto do botão ao normal
}

// Função para pegar a data e hora atual do sistema
function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("pt-BR"); // Formato de data BR (dd/mm/yyyy)
  const time = now.toLocaleTimeString("pt-BR"); // Formato de hora BR (hh:mm:ss)
  return `${date} às ${time}`;
}

// Manipulação do formulário
taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Previne o envio padrão do formulário
  const taskName = document.getElementById("taskName").value; // Nome da tarefa
  const dueDate = document.getElementById("dueDate").value; // Data de entrega opcional

  const task = {
    name: taskName, // Nome da tarefa
    insertDate: getCurrentDateTime(), // Data e hora atuais do sistema
    dueDate: dueDate ? dueDate : null, // Data de entrega (opcional)
  };

  if (isEditing) {
    updateTask(task); // Atualizar a tarefa em vez de adicionar uma nova
  } else {
    addTask(task); // Adicionar a nova tarefa ao array e salvar
  }

  taskForm.reset(); // Limpa o formulário após o envio
});

// Exibir tarefas ao carregar a página
window.onload = function () {
  displayTasks(); // Exibe as tarefas salvas ao carregar a página
  displayNextTask(); // Exibe a próxima tarefa
};
// Selecionar os inputs de cor e o container que tem o gradiente
const color1Input = document.getElementById("color1");
const color2Input = document.getElementById("color2");
const container = document.querySelector(".container");

// Função para atualizar o gradiente de fundo e salvar as cores no localStorage
function updateGradient() {
  const color1 = color1Input.value;
  const color2 = color2Input.value;
  container.style.background = `linear-gradient(45deg, ${color1}, ${color2})`;

  // Salvar as cores no localStorage
  localStorage.setItem("color1", color1);
  localStorage.setItem("color2", color2);
}

// Carregar cores do localStorage ao carregar a página
window.onload = function () {
  // Verificar se há cores salvas
  const savedColor1 = localStorage.getItem("color1");
  const savedColor2 = localStorage.getItem("color2");

  if (savedColor1 && savedColor2) {
    // Aplicar as cores salvas ao gradiente de fundo
    container.style.background = `linear-gradient(45deg, ${savedColor1}, ${savedColor2})`;

    // Atualizar os valores dos inputs de cor
    color1Input.value = savedColor1;
    color2Input.value = savedColor2;
  }

  // Exibir tarefas ao carregar a página
  displayTasks();
  displayNextTask();
};

// Adicionar event listeners para detectar mudanças nos inputs de cor
color1Input.addEventListener("input", updateGradient);
color2Input.addEventListener("input", updateGradient);
