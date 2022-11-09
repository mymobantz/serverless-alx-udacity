import { TodoAccess } from '../DataLayer/todosAcess'
import { TodoItem, UpdateTodoRequest, CreateTodoRequest } from '../../models/TodoItem'
import { v4 as uuidv4 } from 'uuid'
import * as AWS from 'aws-sdk'

// TODO: Implement businessLogic

const todosAccess = new TodoAccess();

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return todosAccess.getTodos(userId);
}

export async function createTodo( userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  const todoId = uuidv4();
  const createdAt = new Date().toISOString();
  const done = false;
  const newTodo: TodoItem = { todoId, userId, createdAt, done, ...createTodoRequest };
  return todosAccess.createTodo(newTodo);
}

export async function updateToDoItem(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  userId: string
): Promise<void> {
  return todosAccess.updateTodo(userId, todoId, updateTodoRequest);
}

export async function deleteToDoItem(userId: string, todoId: string): Promise<void> {
  return todosAccess.deleteTodo(userId, todoId);
}

export async function getUploadUrl(userId: string, todoId: string): Promise<string> {
  const bucketName = process.env.IMAGES_S3_BUCKET;
  const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10);
  const s3 = new AWS.S3({ signatureVersion: 'v4' });
  const signedUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  });
  await todosAccess.saveImgUrl(userId, todoId, bucketName);
  return signedUrl;
}