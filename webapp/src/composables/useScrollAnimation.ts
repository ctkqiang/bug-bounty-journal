import { ref, onMounted, onUnmounted } from 'vue'

const callbackMap = new WeakMap<Element, () => void>()

export function useScrollAnimation() {
  const observer = ref<IntersectionObserver | null>(null)

  const pendingElements: { el: Element; cb: () => void }[] = []

  const createObserver = () => {
    if (observer.value) return
    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible')
            const cb = callbackMap.get(entry.target)
            if (cb) cb()
            observer.value?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    )
    for (const { el, cb } of pendingElements) {
      observer.value.observe(el)
      callbackMap.set(el, cb)
    }
    pendingElements.length = 0
  }

  const observeElement = (el: Element, callback: () => void) => {
    if (observer.value) {
      observer.value.observe(el)
      callbackMap.set(el, callback)
    } else {
      pendingElements.push({ el, cb: callback })
    }
  }

  onMounted(createObserver)

  onUnmounted(() => {
    observer.value?.disconnect()
  })

  return { observeElement }
}
