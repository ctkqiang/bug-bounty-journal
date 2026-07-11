/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module 'prismjs' {
  const Prism: {
    highlightAll: () => void
    highlightElement: (element: Element) => void
    languages: Record<string, object>
  }
  export default Prism
}

declare module 'prismjs/components/prism-bash' {
  const _empty: void
  export default _empty
}

declare module 'prismjs/components/prism-go' {
  const _empty: void
  export default _empty
}

declare module 'prismjs/components/prism-sql' {
  const _empty: void
  export default _empty
}

declare module 'prismjs/components/prism-python' {
  const _empty: void
  export default _empty
}

declare module 'prismjs/components/prism-json' {
  const _empty: void
  export default _empty
}

declare module 'prismjs/components/prism-yaml' {
  const _empty: void
  export default _empty
}

declare module 'prismjs/components/prism-markdown' {
  const _empty: void
  export default _empty
}
