// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'gbsa962hg7'
const region = 'eu-west-3'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-ei58tyvf.eu.auth0.com',            // Auth0 domain
  clientId: 'PVi7resQf2HQfy5XuTJwtE4nq9C9e2Sa',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
