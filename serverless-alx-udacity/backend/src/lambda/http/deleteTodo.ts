import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteToDoItem } from '../../helpers/BusinessLogic/todos'
import { createLogger } from '../../utils/logger';
import { parseUserId } from '../../auth/utils'
import { getToken } from '../../auth/utils'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

const logger = createLogger('deleteTodo');


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing DeleteTodo event...');
    const jwtToken: string = getToken(event);
    const userId = parseUserId(jwtToken);
    const todoId = event.pathParameters.todoId;
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    try {
      const deleteItem = await deleteToDoItem(userId, todoId)
      logger.info(`Successfully deleted todo item: ${todoId}`);
      return {
        statusCode: 204,
        headers,
        body: JSON.stringify(deleteItem)
      };
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error })
      };
    }
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
