import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

/**
 fetch('http://127.0.0.1:3000/todo/1', {
    method: 'PUT',
    body: JSON.stringify({ title: 'Play Dogs', completed: true }),
    headers: {
      'content-type': 'application/json'
    }
  })
 */

const dbFilePath = __dirname + '/../../db/todo.json';

function writeTodosToDb(todos) {
  fs.writeFileSync(dbFilePath, JSON.stringify(todos), 'utf-8');
}

function readTodosFromDb() {
  const todos = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
  return todos;
}

function readFromDb(id: string) {
  const todos = readTodosFromDb();
  return todos.filter((item) => item.id === id)[0];
}

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('')
  async create(@Body('title') title: string) {
    const todos = readTodosFromDb();
    const newId = String(Number(todos[todos.length - 1].id) + 1);
    const newTodos = [
      ...todos,
      {
        id: newId,
        title,
      },
    ];
    writeTodosToDb(newTodos);
  }

  @Get('/list')
  async getList(): Promise<any> {
    return {
      success: true,
      data: readTodosFromDb(),
    };
  }

  @Get('/:todoId')
  async getDetail(@Param('todoId') todoId: string): Promise<any> {
    return {
      success: true,
      data: readFromDb(todoId),
    };
  }

  @Put('/:todoId')
  async update(
    @Param('todoId') todoId,
    @Body('title') title,
    @Body('completed') completed,
  ): Promise<any> {
    const todos = readTodosFromDb();

    todos.forEach((todo) => {
      if (todo.id === todoId) {
        todo.title = title;
        todo.completed = completed;
      }
    });

    // const newTodos = todos.map((todo) => {
    //   if (todo.id === todoId) {
    //     return {
    //       ...todo,
    //       title,
    //       completed,
    //     };
    //   }
    //   return todo;
    // });

    writeTodosToDb(todos);

    return {
      success: true,
    };
  }

  @Delete('/:todoId')
  async delete(@Param('todoId') todoId) {
    const todos = readTodosFromDb();

    todos.forEach((todo, index) => {
      if (todo.id === todoId) {
        todos.splice(index, 1);
      }
    });

    writeTodosToDb(todos);

    return {
      success: true,
    };
  }
}
