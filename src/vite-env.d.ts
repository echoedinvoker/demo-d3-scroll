/// <reference types="vite/client" />
//
// 為 .vue 檔案宣告模組
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
