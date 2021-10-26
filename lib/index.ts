// Reference: https://awsteele.com/blog/2020/09/26/aws-access-key-format.html

const ACCOUNT_OFFSET = 549755813888 // QAAAAAAA
const ACCOUNT_ID_MAX = 10 ** 12
const AWS_BASE32_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const AWS_BASE32_CHARSET_FULL_LEN = AWS_BASE32_CHARSET.length
const AWS_BASE32_CHARSET_HALF_LEN = AWS_BASE32_CHARSET_FULL_LEN / 2
const BYTE_MAX = 2 ** 8
const SECRET_BYTES = 30

const toAwsBase32 = (number: number) => {
  let result = ''

  while (number > 0) {
    result = AWS_BASE32_CHARSET[number % 32] + result
    number = Math.floor(number / 32)
  }

  return result
}

const randomBase32 = (digits: number) => {
  let result = ''

  for (let i = 0; i < digits; i++) {
    result +=
      AWS_BASE32_CHARSET[
        Math.floor(Math.random() * AWS_BASE32_CHARSET_FULL_LEN)
      ]
  }

  return result
}

export const generateAccountId = () =>
  Math.floor(Math.random() * ACCOUNT_ID_MAX)

export const generateAccessKeyId = (accountId: number) => {
  const oddEvenRandomChar =
    AWS_BASE32_CHARSET[
      Math.floor(Math.random() * AWS_BASE32_CHARSET_HALF_LEN) +
        AWS_BASE32_CHARSET_HALF_LEN * (accountId & 1)
    ]

  return (
    'AKIA' +
    toAwsBase32(Math.floor(accountId / 2) + ACCOUNT_OFFSET) +
    oddEvenRandomChar +
    randomBase32(7)
  )
}

export const generateSecretAccessKey = () => {
  let result = new Uint8Array(SECRET_BYTES).map(() =>
    Math.floor(Math.random() * BYTE_MAX),
  )

  return Buffer.from(result).toString('base64')
}

export const generateAwsFlavourCredentials = (
  accountNumber: number = generateAccountId(),
) => {
  const accountId = String(accountNumber).padStart(12, '0')
  const accessKeyId = generateAccessKeyId(accountNumber)
  const secretAccessKey = generateSecretAccessKey()

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
  }
}
