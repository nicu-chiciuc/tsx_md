import LogRocket from 'logrocket'

// IMPORTANT: This must be called before any other import.
// The issue was that fetches through `openapi-fetch` were not caught by LogRocket.
// The `isDev` is not imported so that we don't accidentaly load other dev code.
//
// https://docs.logrocket.com/docs/troubleshooting-sessions#due-to-logrocketinit-call-being-placed-incorrectly
if (typeof window !== 'undefined' && process.env['NODE_ENV'] !== 'development') {
  LogRocket.init('sqsqzj/tsx_md')
}
