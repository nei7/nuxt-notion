<script setup lang="ts">
import type { EquationBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import MathFormula from './MathFormula.vue'

defineProps<{
  block: EquationBlockObjectResponse
}>()
</script>

<template>
  <MathFormula
    :expression="block.equation.expression"
    :display-mode="true"
  />
</template>
