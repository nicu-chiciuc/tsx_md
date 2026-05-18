import { setupTypeAcquisition, ATABootstrapConfig } from '@typescript/ata'
import ts from 'typescript'

const delegateListener = createDelegate()

const ata = setupTypeAcquisition({
  projectName: 'monaco-ts',
  typescript: ts,
  logger: console,
  fetcher(input, init) {
    return fetch(input, init)
  },
  delegate: {
    receivedFile: (code, path) => {
      delegateListener.receivedFile.forEach(fn => fn(code, path))
    },
    progress: (downloaded, total) => {
      delegateListener.progress.forEach(fn => fn(downloaded, total))
    },
    started: () => {
      delegateListener.started.forEach(fn => fn())
    },
    finished: _f => {
      delegateListener.finished.forEach(fn => fn(_f))
    },
  },
})

type DelegateListener = Required<{
  [k in keyof ATABootstrapConfig['delegate']]: Set<NonNullable<ATABootstrapConfig['delegate'][k]>>
}>

type ReceivedFileListener = NonNullable<ATABootstrapConfig['delegate']['receivedFile']>

function createDelegate() {
  const delegate: DelegateListener = {
    receivedFile: new Set(),
    progress: new Set(),
    errorMessage: new Set(),
    finished: new Set(),
    started: new Set(),
  }

  return delegate
}

export function createATA() {
  const acquireType = (code: string) => ata(code)

  const addReceivedFileListener = (handler: ReceivedFileListener) => {
    delegateListener.receivedFile.add(handler)
  }

  const removeReceivedFileListener = (handler: ReceivedFileListener) => {
    delegateListener.receivedFile.delete(handler)
  }

  return {
    acquireType,
    addReceivedFileListener,
    removeReceivedFileListener,
    dispose: () => {
      for (const key in delegateListener) {
        delegateListener[key as keyof DelegateListener].clear()
      }
    },
  }
}
