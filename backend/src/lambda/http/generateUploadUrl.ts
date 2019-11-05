import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as uuid from 'uuid';
import * as AWS from 'aws-sdk';
const docClient = new AWS.DynamoDB.DocumentClient();

import { createLogger } from '../../utils/logger'
const logger = createLogger('generateUploadUrl')

const bucketName = process.env.TODOITEM_S3_BUCKET_NAME;
const todoItemTable = process.env.TODOITEM_TABLE;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const attachmentId = uuid.v4();

  logger.info("Generating upload URL:", {
    todoId: todoId,
    attachmentId: attachmentId
  })

  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: urlExpiration
  });

  await docClient.update({
    TableName: todoItemTable,
    Key: {
      "todoId": todoId
    },
    UpdateExpression: "set attachmentUrl = :attachmentUrl",
    ExpressionAttributeValues: {
      ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${attachmentId}`
    }
  }).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
};
