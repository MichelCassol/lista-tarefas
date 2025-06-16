const { renderUserCard, renderNotificationsList } = require('./component');

describe('Testes de Snapshot', () => {
  describe('renderUserCard', () => {
    test('deve renderizar corretamente com dados completos', () => {
      const user = {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        avatar: '/images/avatar-1.jpg',
        role: 'Administrador',
        isActive: true
      };
      
      const output = renderUserCard(user);
      
      // Este snapshot será criado na primeira execução e comparado nas execuções seguintes
      expect(output).toMatchSnapshot();
    });
    
    test('deve renderizar com valores padrão quando alguns campos estão ausentes', () => {
      const user = {
        name: 'Maria Santos',
        email: 'maria@exemplo.com'
        // Sem avatar, role e isActive
      };
      
      const output = renderUserCard(user);
      expect(output).toMatchSnapshot();
    });
    
    test('deve renderizar usuário inativo', () => {
      const user = {
        name: 'Carlos Oliveira',
        email: 'carlos@exemplo.com',
        isActive: false
      };
      
      const output = renderUserCard(user);
      expect(output).toMatchSnapshot();
    });
    
    test('deve renderizar mensagem de erro para dados inválidos', () => {
      // Testes para entradas inválidas
      expect(renderUserCard(null)).toMatchSnapshot('usuário nulo');
      expect(renderUserCard(undefined)).toMatchSnapshot('usuário indefinido');
      expect(renderUserCard('string')).toMatchSnapshot('usuário como string');
    });
  });
  
  describe('renderNotificationsList', () => {
    test('deve renderizar uma lista de notificações', () => {
      const notifications = [
        { id: 1, message: 'Nova mensagem recebida', type: 'info', read: false },
        { id: 2, message: 'Pagamento confirmado', type: 'success', read: true },
        { id: 3, message: 'Atualização disponível', type: 'warning', read: false }
      ];
      
      const output = renderNotificationsList(notifications);
      expect(output).toMatchSnapshot();
    });
    
    test('deve renderizar mensagem quando não há notificações', () => {
      const output = renderNotificationsList([]);
      expect(output).toMatchSnapshot();
    });
    
    test('deve renderizar mensagem de erro para dados inválidos', () => {
      expect(renderNotificationsList(null)).toMatchSnapshot('notificações nulas');
      expect(renderNotificationsList('string')).toMatchSnapshot('notificações como string');
    });
    
    // Exemplo de uso de toMatchInlineSnapshot - snapshots são armazenados no próprio código
    test('deve renderizar notificações com valores padrão', () => {
      const notifications = [
        { id: 1, message: 'Notificação sem tipo ou status' }
        // Sem type e read
      ];
      
      const output = renderNotificationsList(notifications);
      
      // Em vez de criar um arquivo separado, o snapshot será inserido aqui na primeira execução
      // e nas próximas execuções será comparado com este snapshot inline
      expect(output).toMatchInlineSnapshot(`
"
    <ul class="notifications-list">
      
      <li class="notification-item unread" data-id="1">
        <div class="notification-item__icon notification-item__icon--info">
          <svg><!-- Ícone de Info --></svg>
        </div>
        <div class="notification-item__content">
          <p>Notificação sem tipo ou status</p>
        </div>
        <div class="notification-item__actions">
          <button class="btn btn--small">Marcar como lida</button>
        </div>
      </li>
    
    </ul>
  "
`);
    });
  });
  
  // Demonstração de snapshot de objeto (não apenas HTML)
  describe('Snapshots para estruturas de dados', () => {
    test('deve corresponder ao snapshot do objeto de usuário transformado', () => {
      const user = {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        role: 'Usuário'
      };
      
      // Transforma os dados para um formato específico
      const transformedUser = {
        displayName: user.name.toUpperCase(),
        contactInfo: {
          email: user.email,
          phoneNumber: 'N/A'
        },
        permissions: ['read', 'write'],
        metadata: {
          role: user.role,
          lastLogin: new Date('2023-01-01').toISOString()
        }
      };
      
      // Podemos fazer snapshot de objetos também, não apenas de strings HTML
      expect(transformedUser).toMatchSnapshot();
    });
  });
}); 