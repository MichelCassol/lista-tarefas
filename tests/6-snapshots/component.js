// Simulação de um componente para testes de snapshot

/**
 * Gera HTML para um cartão de usuário
 * @param {Object} user - Objeto com dados do usuário
 * @returns {string} HTML do cartão de usuário
 */
function renderUserCard(user) {
  if (!user || typeof user !== 'object') {
    return '<div class="error">Dados de usuário inválidos</div>';
  }
  
  const { name, email, avatar, role = 'Usuário', isActive = true } = user;
  
  return `
    <div class="user-card ${isActive ? 'active' : 'inactive'}">
      <div class="user-card__avatar">
        <img src="${avatar || '/images/default-avatar.png'}" alt="${name}">
      </div>
      <div class="user-card__info">
        <h3 class="user-card__name">${name}</h3>
        <p class="user-card__email">${email}</p>
        <span class="user-card__role">${role}</span>
      </div>
      <div class="user-card__status">
        ${isActive ? '<span class="status-badge status-badge--active">Ativo</span>' : 
                    '<span class="status-badge status-badge--inactive">Inativo</span>'}
      </div>
    </div>
  `;
}

/**
 * Gera HTML para uma lista de notificações
 * @param {Array} notifications - Array de objetos de notificação
 * @returns {string} HTML da lista de notificações
 */
function renderNotificationsList(notifications) {
  if (!Array.isArray(notifications)) {
    return '<div class="error">Formato de notificações inválido</div>';
  }
  
  if (notifications.length === 0) {
    return '<div class="empty-list">Não há notificações</div>';
  }
  
  const notificationItems = notifications.map(notification => {
    const { id, message, type = 'info', read = false } = notification;
    
    return `
      <li class="notification-item ${read ? 'read' : 'unread'}" data-id="${id}">
        <div class="notification-item__icon notification-item__icon--${type}">
          ${getNotificationIcon(type)}
        </div>
        <div class="notification-item__content">
          <p>${message}</p>
        </div>
        <div class="notification-item__actions">
          <button class="btn btn--small">${read ? 'Marcar como não lida' : 'Marcar como lida'}</button>
        </div>
      </li>
    `;
  }).join('');
  
  return `
    <ul class="notifications-list">
      ${notificationItems}
    </ul>
  `;
}

// Função auxiliar para gerar ícones
function getNotificationIcon(type) {
  const icons = {
    info: '<svg><!-- Ícone de Info --></svg>',
    success: '<svg><!-- Ícone de Sucesso --></svg>',
    warning: '<svg><!-- Ícone de Aviso --></svg>',
    error: '<svg><!-- Ícone de Erro --></svg>'
  };
  
  return icons[type] || icons.info;
}

module.exports = {
  renderUserCard,
  renderNotificationsList
}; 