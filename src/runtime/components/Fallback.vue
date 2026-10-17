<script lang="ts">
import { createCommentVNode, defineComponent, type PropType } from 'vue'
import type { NotionBlock } from '../types/collections'
import { useNotionRenderer } from '../utils/renderer-context'

/** Renders the `fallback` slot of `<NotionRenderer>` for unsupported block types. */
export default defineComponent({
  name: 'NotionFallback',
  props: {
    block: { type: Object as PropType<NotionBlock>, required: true },
  },
  setup(props) {
    const context = useNotionRenderer()

    return () => {
      const nodes = context.renderFallback?.(props.block)
      if (nodes && nodes.length > 0) return nodes
      return import.meta.dev ? createCommentVNode(` notion: unsupported block "${props.block.type}" `) : null
    }
  },
})
</script>
