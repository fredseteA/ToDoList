// Recupera as tarefas salvas no localStorage
const getTasksFromLocalStorage = () => {
    //pega as tarefas salvas no localStorage
    const localTasks = window.localStorage.getItem('tasks');
    
    // Se não houver tarefas salvas, inicializa um array vazio no localStorage
    if (!localTasks) {
        window.localStorage.setItem('tasks', JSON.stringify([]));
        return [];
    }
    
    try {
        return JSON.parse(localTasks); // Converte JSON para array
    } catch (error) {
        console.error("Erro ao fazer parse do localStorage:", error);
        window.localStorage.setItem('tasks', JSON.stringify([])); // Corrige erro
        return [];
    }
};

// Salva as tarefas no localStorage
const setTasksOnLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove uma tarefa específica pelo ID
const removeTask = (taskId) => {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(({id}) => parseInt(id) !== parseInt(taskId)); // Filtra a tarefa removida
    setTasksOnLocalStorage(updatedTasks);
    
    // Remove o elemento do DOM
    document.getElementById('todo-list').removeChild(document.getElementById(taskId));
    updatedTasksCounter(); //atualiza o contador de tarefas concluidas
}

// Remove todas as tarefas marcadas como concluídas
const removeDoneTasks = () => {
    const tasks = getTasksFromLocalStorage();
    
    // Identifica as tarefas concluídas e armazena os IDs
    const tasksToRemove = tasks
        .filter(({checked}) => checked)
        .map(({id}) => id);

    // Mantém apenas as tarefas não concluídas
    const updatedTasks = tasks.filter(({checked}) => !checked);
    setTasksOnLocalStorage(updatedTasks);

    // Remove cada tarefa concluída do DOM
    tasksToRemove.forEach((taskToRemove) => {
        document.getElementById('todo-list').removeChild(document.getElementById(taskToRemove));
    })
    updatedTasksCounter(); //atualiza o contador de tarefas concluidas
}

const updatedTasksCounter = () => {
    const tasks = getTasksFromLocalStorage();
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(tasks => tasks.checked).length;

    document.getElementById('done-tasks-counter').textContent=`Tarefas concluídas: ${doneTasks}/${totalTasks}`;
}

// Cria um item da lista de tarefas no HTML
const createTaskListItem = (task, checkbox) => {
    const list = document.getElementById('todo-list');
    const toDo = document.createElement('li');
    
    const removeTaskButton = document.createElement('button');
    removeTaskButton.textContent = 'X'; // Botão de remoção
    removeTaskButton.ariaLabel = 'Remover tarefa';
    removeTaskButton.onclick = () => removeTask(task.id);
    
    toDo.id = task.id;
    toDo.appendChild(checkbox);
    toDo.appendChild(removeTaskButton);
    list.appendChild(toDo);

    return toDo;
}

// Evento acionado ao clicar em um checkbox
const onCheckboxClick = (event) => {
    const [id] = event.target.id.split('-'); // Extrai o ID do checkbox
    const tasks = getTasksFromLocalStorage();

    // Atualiza o estado da tarefa
    const updatedTasks = tasks.map((task) => {
        return parseInt(task.id) === parseInt(id) 
            ? {...task, checked: event.target.checked} // Marca como concluída
            : task;
    });
    
    setTasksOnLocalStorage(updatedTasks);
    updatedTasksCounter(); //atualiza o contador de tarefas concluidas
}

// Cria um checkbox para a tarefa
const getCheckboxInput = ({id, description, checked}) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `${id}-checkbox`;
    
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked || false; // Se estiver concluída, marca como true
    checkbox.addEventListener('change', onCheckboxClick);

    label.textContent = description;
    label.htmlFor = checkboxId;

    wrapper.className = 'checkbox-label-container';
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    return wrapper;
}

// Gera um novo ID para a tarefa
const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage();
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? parseInt(lastId) + 1 : 1;
}

// Obtém os dados da nova tarefa criada pelo usuário
const getNewTaskData = (event) => {
    const description = event.target.elements.description.value;
    const id = getNewTaskId();
    return {description, id};
}

// Cria uma nova tarefa
const createTask = (event) => {
    event.preventDefault(); // Evita recarregar a página
    const newTaskData = getNewTaskData(event);
    
    const checkbox = getCheckboxInput(newTaskData);
    createTaskListItem(newTaskData, checkbox);
    
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = [
        ...tasks,
        {id: newTaskData.id, description: newTaskData.description, checked: false}
    ];

    setTasksOnLocalStorage(updatedTasks);
    
    document.getElementById('description').value = ''; // Limpa o campo de entrada
    updatedTasksCounter(); //atualiza o contador de tarefas concluidas
}

// Quando a página carrega, inicializa as tarefas
window.onload = function() {
    if (!window.localStorage.getItem('tasks')) {
        window.localStorage.setItem('tasks', JSON.stringify([]));
    }
    
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTask);
    
    const tasks = getTasksFromLocalStorage();

    // Adiciona as tarefas salvas ao carregar a página
    tasks.forEach((task) => {
        const checkbox = getCheckboxInput(task);
        createTaskListItem(task, checkbox);
    })

    updatedTasksCounter(); //atualiza o contador de tarefas concluidas

}