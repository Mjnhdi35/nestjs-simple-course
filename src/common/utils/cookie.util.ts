import { Response } from 'express'
import { ConfigService } from '@nestjs/config'

export class CookieUtil {
  constructor(private config: ConfigService) {}

  addRefreshToken(res: Response, token: string) {
    const expires = new Date()
    expires.setDate(
      expires.getDate() +
        this.config.getOrThrow<number>('cookie.refreshTokenDays'),
    )

    res.cookie(
      this.config.getOrThrow<string>('cookie.refreshTokenName'),
      token,
      {
        httpOnly: true,
        expires,
        domain: this.config.get<string>('cookie.domain'),
        sameSite: 'none',
        secure: this.config.get<string>('NODE_ENV') === 'production',
      },
    )
  }

  clearRefreshToken(res: Response) {
    res.cookie(this.config.getOrThrow<string>('cookie.refreshTokenName'), '', {
      httpOnly: true,
      expires: new Date(0),
      domain: this.config.get<string>('cookie.domain'),
      sameSite: 'none',
      secure: this.config.get<string>('NODE_ENV') === 'production',
    })
  }
}
