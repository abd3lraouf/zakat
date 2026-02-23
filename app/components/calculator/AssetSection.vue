<script setup lang="ts">
import type { AssetDef, AssetKey, DeductionKey } from '~~/shared/types'
import { useCalculatorStore } from '~~/stores/calculator'

const props = defineProps<{
  title: string
  defs: AssetDef[]
  stateGroup: 'assets' | 'deductions'
}>()

const store = useCalculatorStore()

function getValue(def: AssetDef): number {
  if (props.stateGroup === 'assets') {
    return store.assets[def.stateKey as AssetKey] ?? 0
  }
  return store.deductions[def.stateKey as DeductionKey] ?? 0
}

function setValue(def: AssetDef, value: number) {
  if (props.stateGroup === 'assets') {
    store.assets[def.stateKey as AssetKey] = value
  } else {
    store.deductions[def.stateKey as DeductionKey] = value
  }
}
</script>

<template>
  <div class="mb-5">
    <div class="section-title">{{ title }}</div>
    <CalculatorAssetRow
      v-for="def in defs"
      :key="def.id"
      :def="def"
      :model-value="getValue(def)"
      @update:model-value="setValue(def, $event)"
    />
  </div>
</template>

<style scoped>
.section-title {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--color-stone-400);
  padding: 12px 0 8px;
  border-bottom: 1px solid var(--color-stone-200);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-stone-200);
}
</style>
