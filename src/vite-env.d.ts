/// <reference types="vite/client" />

declare module '*.PNG' {
  const src: string
  export default src
}
declare module '*.PNG?url' {
  const src: string
  export default src
}