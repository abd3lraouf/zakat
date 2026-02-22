declare namespace google {
  namespace accounts {
    namespace oauth2 {
      function initTokenClient(config: {
        client_id: string
        scope: string
        callback: (response: any) => void
      }): { requestAccessToken: (overrides?: any) => void }
      function revoke(token: string, callback: () => void): void
    }
  }
}
