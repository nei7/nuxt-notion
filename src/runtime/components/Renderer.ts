import { defineComponent, h, type PropType } from 'vue'
import type { AnyNotionBlock } from '../types/notion'
import Block from './Block.vue'

export default defineComponent({
  name: 'NotionRenderer',
  props: {
    blocks: {
      type: Array as PropType<AnyNotionBlock[]>,
      required: true,
      default: () => [],
    },
  },
  setup(props) {
    return () => h(
      'div',
      { class: 'notion-content' },
      props.blocks.map(block =>
        h(Block, {
          key: block.id,
          block: block,
        }),
      ),
    )
  },
})
