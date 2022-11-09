import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { createTodo } from '../../helpers/BusinessLogic/todos'
import { createLogger } from '../../utils/logger';
import { CreateTodoRequest, TodoItem } from '../../models/TodoItem'
import { parseUserId } from '../../auth/utils'
import { getToken } from '../../auth/utils'

const logger = createLogger('createTodo');
    
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Processing CreateTodo event...');
  const jwtToken: string = getToken(event);
  const userId = parseUserId(jwtToken)

  const newTodoData: CreateTodoRequest = JSON.parse(event.body);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    const newTodo: TodoItem = await createTodo(userId, newTodoData)
    logger.info('Successfully created a new todo item.');
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ item: newTodo })
    };
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error })
    };
  }
};
