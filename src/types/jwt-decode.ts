export interface JwtDecodeType {
  token_type: string
  exp: number
  iat: number
  jti: string
  user_id: number
  sub: string
}
