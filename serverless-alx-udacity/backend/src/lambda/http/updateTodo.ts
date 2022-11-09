import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { updateToDoItem } from '../../helpers/BusinessLogic/todos'
import { UpdateTodoRequest } from '../../models/TodoItem'
import { createLogger } from '../../utils/logger';
import { parseUserId } from '../../auth/utils'
import { getToken } from '../../auth/utils'

const logger = createLogger('updateTodo');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Processing UpdateTodo event...');
  const jwtToken: string = getToken(event);
  const userId = parseUserId(jwtToken)
  const todoId = event.pathParameters.todoId;
  const updateData: UpdateTodoRequest = JSON.parse(event.body);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    const updated_TodoItem = await updateToDoItem(updateData, todoId, userId);
    logger.info(`Successfully updated the todo item: ${todoId}`);
    return {
      statusCode: 204,
      headers,
      body: JSON.stringify({ item: updated_TodoItem })
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