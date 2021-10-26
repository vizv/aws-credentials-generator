import { generateAwsFlavourCredentials } from './lib'

const { accountId, accessKeyId, secretAccessKey } =
  generateAwsFlavourCredentials()

console.log('accountId:', accountId)
console.log('accessKeyId:', accessKeyId)
console.log('secretAccessKey:', secretAccessKey)
