document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const todoList = document.getElementById('todoList');
  const todoCount = document.getElementById('todoCount');
  const todoForm = document.getElementById('todoForm');
  const saveButton = document.getElementById('saveTodo');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const confirmDeleteButton = document.getElementById('confirmDelete');
  const alertMessage = document.getElementById('alertMessage');
  const alertText = document.getElementById('alertText');
  
  // Modais Bootstrap
  const todoModal = new bootstrap.Modal(document.getElementById('todoModal'));
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  
  // Estado da aplicação
  let currentTodos = [];
  let todoToDeleteId = null;
  let editMode = false; // Novo estado para controlar o modo de edição
  
  // ----- Funções CRUD e Auxiliares -----
  
  // Carregar tarefas
  async function loadTodos(searchTerm = '') {
    try {
      let url = '/api/todos';
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar tarefa');
      }
      
      currentTodos = data.data;
      renderTodos(currentTodos);
      updateTodoCount(currentTodos.length);
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }
  
  // Criar ou atualizar tarefa
  async function saveTodo() {
    try {
      const todoId = document.getElementById('todoId').value;
      const isEditing = !!todoId;

      const todoData = {
        tarefa: document.getElementById('tarefa').value,
        start_date: document.getElementById('start_date').value,
        end_date: document.getElementById('end_date').value
      };
      
      // Validar dados obrigatórios
      if (!todoData.tarefa || !todoData.start_date) {
        throw new Error('Tarefa e data de início são obrigatórias');
      }

      let url = '/api/todos';
      let method = 'POST';
      
      if (isEditing) {
        url += `/${todoId}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erro ao ${isEditing ? 'atualizar' : 'criar'} tarefa`);
      }
      
      // Fechar modal e limpar formulário
      todoModal.hide();
      todoForm.reset();

      // Recarregar tarefas e mostrar mensagem de sucesso
      await loadTodos();
      showAlert(`Tarefa ${isEditing ? 'atualizada' : 'criada'} com sucesso!`, 'success');
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }
  
  // Excluir tarefa
  async function deleteTodo(id) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao excluir tarefa');
      }
      
      // Fechar modal, recarregar contatos e mostrar mensagem de sucesso
      deleteModal.hide();
      await loadTodos();
      showAlert('Tarefa excluída com sucesso!', 'success');
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }
  
  // Carregar um todo específico e abrir o modal de edição
  async function loadAndEditTodo(id) {
    try {
      editMode = true; // Ativar modo de edição ANTES de abrir o modal
      const response = await fetch(`/api/todos/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar tarefa');
      }
      
      // Verificar estrutura da resposta e extrair o contato
      console.log('Resposta da API:', data);
      
      // A API retorna o todo dentro de data.data
      const todo = data.data;

      // Verificar se os dados do todo foram recebidos corretamente
      if (!todo) {
        throw new Error('Dados da tarefa não encontrados na resposta');
      }
      
      // Limpar formulário ANTES de preencher (para evitar resíduos)
      document.getElementById('todoId').value = '';

      // Exibir o modal (modal é aberto antes de preencher)
      todoModal.show();

      // Pequena pausa para garantir que o modal esteja totalmente aberto
      setTimeout(() => {
        // Preencher formulário com os dados
        document.getElementById('todoId').value = todo._id;
        document.getElementById('tarefa').value = todo.tarefa || '';
        document.getElementById('start_date').value = (new Date(todo.start_date).toLocaleDateString(new Intl.DateTimeFormat('US')));
        document.getElementById('end_date').value = todo.end_date ? new Date(todo.end_date).toLocaleDateString() : '-';

        // Definir título do modal para modo de edição
        document.getElementById('todoModalLabel').textContent = 'Editar tarefa';
        
        console.log('Formulário preenchido com:', {
          id: document.getElementById('todoId').value,
          tarefa: document.getElementById('tarefa').value,
          start_date: document.getElementById('start_date').value,
          end_date: document.getElementById('end_date').value
        });
      }, 100);
      
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
      showAlert(error.message, 'danger');
      editMode = false; // Resetar modo de edição em caso de erro
    }
  }
  
  // Renderizar a lista de contatos
  function renderTodos(todos) {
    if (todos.length === 0) {
      todoList.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4">Nenhum tarefa encontrada</td>
        </tr>
      `;
      return;
    }
    
    todoList.innerHTML = todos.map(todo => `
      <tr class="fade-in">
        <td>${todo.tarefa}</td>
        <td>${todo.start_date ? new Date(todo.start_date).toLocaleDateString('pt-BR') : '-'}</td>
        <td>${todo.end_date ? new Date(todo.end_date).toLocaleDateString('pt-BR') : '-'}</td>
        <td class="todo-actions">
          <button class="btn btn-action btn-edit" onclick="editTodo('${todo._id}')" aria-label="Editar">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn btn-action btn-delete" data-todo-id="${todo._id}" data-todo-name="${todo.tarefa}" aria-label="Excluir">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      </tr>
    `).join('');
    
    // Adicionar event listeners aos botões de ação
    addActionButtonsListeners();
  }
  
  // Adicionar event listeners aos botões de ação em cada linha
  function addActionButtonsListeners() {
    // Botões de exclusão
    document.querySelectorAll('.btn-delete').forEach(button => {
      button.addEventListener('click', () => {
        todoToDeleteId = button.getAttribute('data-todo-id');
        const todoName = button.getAttribute('data-todo-name');
        document.getElementById('deleteTodoName').textContent = todoName;
        deleteModal.show();
      });
    });
  }
  
  // Atualizar contador de tarefas
  function updateTodoCount(count) {
    todoCount.textContent = `${count} tarefa${count !== 1 ? 's' : ''}`;
  }
  
  // Exibir alerta
  function showAlert(message, type = 'success') {
    alertText.textContent = message;
    alertMessage.className = `alert alert-${type} alert-dismissible fade show`;
    
    // Ocultar alerta automaticamente após 5 segundos
    setTimeout(() => {
      alertMessage.classList.add('d-none');
      alertMessage.classList.remove('show');
    }, 5000);
  }
  
  // Limpar formulário e configurar para novo contato
  function resetForm() {
    // Limpar todos os campos de entrada
    document.getElementById('todoId').value = '';
    document.getElementById('tarefa').value = '';
    document.getElementById('start_date').value = '';
    document.getElementById('end_date').value = '';
    // Configurar título do modal para nova tarefa
    document.getElementById('todoModalLabel').textContent = 'Nova tarefa';
  }
  
  // Função global para edição (para ser acessível pelo onclick)
  window.editTodo = function(id) {
    console.log('Editando a tarefa com ID:', id);
    loadAndEditTodo(id);
  };
  
  // ----- Event Listeners -----
  
  // Evento de salvar tarefa
  saveButton.addEventListener('click', saveTodo);
  
  // Evento de pesquisa
  searchButton.addEventListener('click', () => {
    loadTodos(searchInput.value);
  });
  
  // Pesquisar ao pressionar Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loadTodo(searchInput.value);
    }
  });
  
  // Evento para confirmar exclusão
  confirmDeleteButton.addEventListener('click', () => {
    if (todoToDeleteId) {
      deleteTodo(todoToDeleteId);
    }
  });
  
  // Evento para quando o modal é fechado
  document.getElementById('todoModal').addEventListener('hidden.bs.modal', function () {
    // Resetar modo de edição
    editMode = false;
  });
  
  // Eventos para modal de tarefa
  document.getElementById('todoModal').addEventListener('show.bs.modal', function (event) {
    // Não resetar o formulário se estivermos em modo de edição
    if (!editMode) {
      resetForm();
    }
  });
  
  // Inicialização
  loadTodos();
}); 