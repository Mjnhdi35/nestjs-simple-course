export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  cookie: {
    refreshTokenName: process.env.JWT_REFRESH_COOKIE_NAME,
    refreshTokenDays: parseInt(process.env.JWT_REFRESH_COOKIE_DAYS!, 10),
    domain: process.env.SERVER_DOMAIN,
  },
})
