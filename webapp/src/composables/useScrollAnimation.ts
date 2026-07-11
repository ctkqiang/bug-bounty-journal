import { ref, onMounted, onUnmounted } from 'vue'

const callbackMap = new WeakMap<Element, () => void>()

export function useScrollAnimation() {
  const observer = ref<IntersectionObserver | null>(null)

  const observeElement = (el: Element, callback: () => void) => {
    if (!observer.value) return
    observer.value.observe(el)
    callbackMap.set(el, callback)
  }

  onMounted(() => {
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
  })

  onUnmounted(() => {
    observer.value?.disconnect()
  })

  return { observeElement }
}
