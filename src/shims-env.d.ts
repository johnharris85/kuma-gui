interface ImportMetaEnv {
  readonly VITE_INSTALL_URL: string
  readonly VITE_VERSION_URL: string
  readonly VITE_NAMESPACE: string
  readonly VITE_KUMA_API_SERVER_URL: string
  readonly VITE_KUMA_DP_SERVER_URL: string
  readonly VITE_DOCS_BASE_URL: string
  readonly VITE_FEEDBACK_URL: string
  readonly VITE_CHAT_URL: string
  readonly VITE_UTM: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
