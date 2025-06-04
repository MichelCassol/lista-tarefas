document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const contactsList = document.getElementById('contactsList');
  const contactCount = document.getElementById('contactCount');
  const contactForm = document.getElementById('contactForm');
  const saveButton = document.getElementById('saveContact');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const confirmDeleteButton = document.getElementById('confirmDelete');
  const alertMessage = document.getElementById('alertMessage');
  const alertText = document.getElementById('alertText');
  
  // Modais Bootstrap
  const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  
  // Estado da aplicação
  let currentContacts = [];
  let contactToDeleteId = null;
  let editMode = false; // Novo estado para controlar o modo de edição
  
  // ----- Funções CRUD e Auxiliares -----
  
  // Carregar contatos
  async function loadContacts(searchTerm = '') {
    try {
      let url = '/api/contacts';
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar contatos');
      }
      
      currentContacts = data.data;
      renderContacts(currentContacts);
      updateContactCount(currentContacts.length);
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }
  
  // Criar ou atualizar contato
  async function saveContact() {
    try {
      const contactId = document.getElementById('contactId').value;
      const isEditing = !!contactId;
      
      const contactData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        notes: document.getElementById('notes').value
      };
      
      // Validar dados obrigatórios
      if (!contactData.name || !contactData.phone) {
        throw new Error('Nome e telefone são obrigatórios');
      }
      
      let url = '/api/contacts';
      let method = 'POST';
      
      if (isEditing) {
        url += `/${contactId}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erro ao ${isEditing ? 'atualizar' : 'criar'} contato`);
      }
      
      // Fechar modal e limpar formulário
      contactModal.hide();
      contactForm.reset();
      
      // Recarregar contatos e mostrar mensagem de sucesso
      await loadContacts();
      showAlert(`Contato ${isEditing ? 'atualizado' : 'criado'} com sucesso!`, 'success');
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }
  
  // Excluir contato
  async function deleteContact(id) {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao excluir contato');
      }
      
      // Fechar modal, recarregar contatos e mostrar mensagem de sucesso
      deleteModal.hide();
      await loadContacts();
      showAlert('Contato excluído com sucesso!', 'success');
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }
  
  // Carregar um contato específico e abrir o modal de edição
  async function loadAndEditContact(id) {
    try {
      editMode = true; // Ativar modo de edição ANTES de abrir o modal
      const response = await fetch(`/api/contacts/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar contato');
      }
      
      // Verificar estrutura da resposta e extrair o contato
      console.log('Resposta da API:', data);
      
      // A API retorna o contato dentro de data.data
      const contact = data.data;
      
      // Verificar se os dados do contato foram recebidos corretamente
      if (!contact) {
        throw new Error('Dados do contato não encontrados na resposta');
      }
      
      // Limpar formulário ANTES de preencher (para evitar resíduos)
      document.getElementById('contactId').value = '';
      
      // Exibir o modal (modal é aberto antes de preencher)
      contactModal.show();
      
      // Pequena pausa para garantir que o modal esteja totalmente aberto
      setTimeout(() => {
        // Preencher formulário com os dados
        document.getElementById('contactId').value = contact._id;
        document.getElementById('name').value = contact.name || '';
        document.getElementById('phone').value = contact.phone || '';
        document.getElementById('email').value = contact.email || '';
        document.getElementById('address').value = contact.address || '';
        document.getElementById('notes').value = contact.notes || '';
        
        // Definir título do modal para modo de edição
        document.getElementById('contactModalLabel').textContent = 'Editar Contato';
        
        console.log('Formulário preenchido com:', {
          id: document.getElementById('contactId').value,
          name: document.getElementById('name').value,
          phone: document.getElementById('phone').value,
          email: document.getElementById('email').value
        });
      }, 100);
      
    } catch (error) {
      console.error('Erro ao editar contato:', error);
      showAlert(error.message, 'danger');
      editMode = false; // Resetar modo de edição em caso de erro
    }
  }
  
  // Renderizar a lista de contatos
  function renderContacts(contacts) {
    if (contacts.length === 0) {
      contactsList.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4">Nenhum contato encontrado</td>
        </tr>
      `;
      return;
    }
    
    contactsList.innerHTML = contacts.map(contact => `
      <tr class="fade-in">
        <td>${contact.name}</td>
        <td>${contact.phone}</td>
        <td>${contact.email || '-'}</td>
        <td>${contact.address || '-'}</td>
        <td class="contact-actions">
          <button class="btn btn-action btn-edit" onclick="editContact('${contact._id}')" aria-label="Editar">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn btn-action btn-delete" data-contact-id="${contact._id}" data-contact-name="${contact.name}" aria-label="Excluir">
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
        contactToDeleteId = button.getAttribute('data-contact-id');
        const contactName = button.getAttribute('data-contact-name');
        document.getElementById('deleteContactName').textContent = contactName;
        deleteModal.show();
      });
    });
  }
  
  // Atualizar contador de contatos
  function updateContactCount(count) {
    contactCount.textContent = `${count} contato${count !== 1 ? 's' : ''}`;
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
    document.getElementById('contactId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('address').value = '';
    document.getElementById('notes').value = '';
    
    // Configurar título do modal para novo contato
    document.getElementById('contactModalLabel').textContent = 'Novo Contato';
  }
  
  // Função global para edição (para ser acessível pelo onclick)
  window.editContact = function(id) {
    console.log('Editando contato com ID:', id);
    loadAndEditContact(id);
  };
  
  // ----- Event Listeners -----
  
  // Evento de salvar contato
  saveButton.addEventListener('click', saveContact);
  
  // Evento de pesquisa
  searchButton.addEventListener('click', () => {
    loadContacts(searchInput.value);
  });
  
  // Pesquisar ao pressionar Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loadContacts(searchInput.value);
    }
  });
  
  // Evento para confirmar exclusão
  confirmDeleteButton.addEventListener('click', () => {
    if (contactToDeleteId) {
      deleteContact(contactToDeleteId);
    }
  });
  
  // Evento para quando o modal é fechado
  document.getElementById('contactModal').addEventListener('hidden.bs.modal', function () {
    // Resetar modo de edição
    editMode = false;
  });
  
  // Eventos para modal de contato
  document.getElementById('contactModal').addEventListener('show.bs.modal', function (event) {
    // Não resetar o formulário se estivermos em modo de edição
    if (!editMode) {
      resetForm();
    }
  });
  
  // Inicialização
  loadContacts();
}); 