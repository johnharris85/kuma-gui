import { setupWorker, MockedRequest, rest } from 'msw'

import CookiedEnv from '@/services/env/CookiedEnv'
import Logger from '@/services/logger/DatadogLogger'
import { disabledLogger } from '@/services/logger/DisabledLogger'
import { token, get } from '@/services/utils'
import type { ServiceConfigurator, ReturnDecorated, Decorator, Alias, Token, TokenType } from '@/services/utils'
import type { FS } from '@/test-support'
import { fakeApi } from '@/test-support'
import { fs } from '@/test-support/mocks/fs'

export { constant, get, container, createInjections, build, merge } from './utils'

type Msw = {
  listen: () => void
  resetHandlers: () => void
  close: () => void
} & ReturnType<typeof setupWorker>

const $ = {
  msw: token<Msw>('msw'),
  fakeFS: token<FS>('fake.fs'),
  kumaFS: token<FS>('fake.fs.kuma'),
}
type SupportedTokens = {
  Env: Token
  EnvVars: Token
  logger: Token
  msw: Token
  bootstrap: Token
  env: Token<Alias<CookiedEnv['var']>>
}

export const services: ServiceConfigurator<SupportedTokens> = (app) => [

  [token<Decorator<typeof app.bootstrap>>('bootstrap.with.mockServer'), {
    service: (bootstrap: ReturnDecorated<typeof app.bootstrap>) => {
      const env = get(app.env)
      if (env('KUMA_MOCK_API_ENABLED', 'true') === 'true') {
        get($.msw)
      }
      return bootstrap()
    },
    decorates: app.bootstrap,
  }],

  [app.Env, {
    service: CookiedEnv,
    arguments: [
      app.EnvVars,
    ],
  }],

  [app.logger, {
    service: disabledLogger(Logger),
    arguments: [
      app.Env,
    ],
  }],

  // Mock Service Worker
  [$.msw, {
    service: (env: TokenType<typeof app.env>, fs: FS) => {
      const handlers = fakeApi(env, fs)
      const worker = setupWorker(...handlers('*'))

      console.warn(
        '%c ✨You are mocking api requests.',
        'background: gray; color: white; display: block; padding: 0.25rem;',
      )

      worker.start({
        quiet: true,
        onUnhandledRequest(req: MockedRequest) {
          // Ignores warnings about unhandled requests.
          if (
            req.url.pathname.startsWith('/@fs') ||
            req.url.pathname.startsWith('/node_modules') ||
            req.url.pathname.startsWith('/src/assets') ||
            req.url.href.match(/\.(vue|ts|js|json)(\?.*)?$/)
          ) {
            return
          }

          console.warn('Found an unhandled %s request to %s', req.method, req.url.href)
        },
      })
      return rest
    },
    arguments: [
      app.env,
      $.fakeFS,
    ],
  }],

  [$.kumaFS, {
    constant: fs,
    labels: [
      $.fakeFS,
    ],
  }],
]
export const TOKENS = $
