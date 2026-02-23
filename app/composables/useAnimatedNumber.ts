import { ref, watch, type Ref } from 'vue'

export function useAnimatedNumber(source: Ref<number>, duration = 400) {
  const displayed = ref(source.value)
  let raf: number | null = null

  watch(source, (to) => {
    if (raf) cancelAnimationFrame(raf)
    const from = displayed.value
    const start = performance.now()

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      // ease-out cubic
      const ease = 1 - Math.pow(1 - t, 3)
      displayed.value = from + (to - from) * ease
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
  })

  return displayed
}
