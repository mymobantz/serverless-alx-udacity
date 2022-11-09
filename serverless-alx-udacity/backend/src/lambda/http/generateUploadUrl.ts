import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getUploadUrl } from '../../helpers/BusinessLogic/todos'
import { createLogger } from '../../utils/logger';
import { parseUserId } from '../../auth/utils'
import { getToken } from '../../auth/utils'

const logger = createLogger('GenerateUploadUrl');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Processing GenerateUploadUrl event...');
  const todoId = event.pathParameters.todoId;
  const jwtToken: string = getToken(event);
  const userId = parseUserId(jwtToken);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    const signedUrl: string = await getUploadUrl(userId, todoId)
    logger.info('Successfully created signed url.');
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ uploadUrl: signedUrl })
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