const todoController = require('../../src/controllers/todoController');
const Todo = require('../../src/models/todoModel');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockTodos = [
  {
    _id: '60c72b2f9b1d8b6b1c8e4d1a',
    tarefa: 'Tarefa 1',
    start_date: new Date('2025-06-19'),
    end_date: new Date('2025-06-20'),
  },
  {
    _id: '60c72b2f9b1d8b6b1c8e4d1b',
    tarefa: 'Tarefa 2',
    start_date: new Date('2025-06-21'),
    end_date: new Date('2025-06-22'),
  },
];

jest.mock('../../src/models/todoModel', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

describe('Todo Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve retornar todas as tarefas', async () => {
    const req = { query: {} };
    const res = mockResponse();

    Todo.find.mockImplementation(() => ({
      sort: jest.fn().mockResolvedValue(mockTodos),
    }));

    await todoController.getAllTodos(req, res);

    expect(Todo.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      results: mockTodos.length,
      data: mockTodos,
    });
  });

  test('Deve retornar uma tarefa pelo ID', async () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();

    Todo.findById.mockResolvedValue(mockTodos[0]);

    await todoController.getTodo(req, res);

    expect(Todo.findById).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: {
        _id: '60c72b2f9b1d8b6b1c8e4d1a',
        tarefa: 'Tarefa 1',
        start_date: mockTodos[0].start_date,
        end_date: mockTodos[0].end_date,
      },
    });
  });

  test('Deve retornar 404 se a tarefa não for encontrada', async () => {
    const req = { params: { id: '999' } };
    const res = mockResponse();

    Todo.findById.mockResolvedValue(null);

    await todoController.getTodo(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Tarefa não encontrada',
    });
  });

  test('Deve criar uma nova tarefa', async () => {
    const req = {
      body: {
        tarefa: 'Nova tarefa',
        start_date: new Date('2025-06-25'),
        end_date: new Date('2025-06-26'),
      },
    };
    const res = mockResponse();

    Todo.create.mockResolvedValue({ _id: '3', ...req.body });

    await todoController.createToDoList(req, res);

    expect(Todo.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: { _id: '3', ...req.body },
    });
  });

  test('Deve atualizar uma tarefa existente', async () => {
    const req = {
      params: { id: '1' },
      body: { tarefa: 'Tarefa atualizada' },
    };
    const res = mockResponse();

    Todo.findByIdAndUpdate.mockResolvedValue({
      _id: '1',
      tarefa: 'Tarefa atualizada',
    });

    await todoController.updateTodoList(req, res);

    expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      req.body,
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: {
        _id: '1',
        tarefa: 'Tarefa atualizada',
      },
    });
  });

  test('Deve retornar 404 ao tentar atualizar uma tarefa inexistente', async () => {
    const req = {
      params: { id: '999' },
      body: { tarefa: 'Tarefa atualizada' },
    };
    const res = mockResponse();

    Todo.findByIdAndUpdate.mockResolvedValue(null);

    await todoController.updateTodoList(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Tarefa não encontrada',
    });
  });

  test('Deve excluir uma tarefa existente', async () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();

    Todo.findByIdAndDelete.mockResolvedValue(mockTodos[0]);

    await todoController.deleteTodoList(req, res);

    expect(Todo.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: null,
    });
  });

  test('Deve retornar 404 ao tentar excluir uma tarefa inexistente', async () => {
    const req = { params: { id: '999' } };
    const res = mockResponse();

    Todo.findByIdAndDelete.mockResolvedValue(null);

    await todoController.deleteTodoList(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Tarefa não encontrada',
    });
  });
});
