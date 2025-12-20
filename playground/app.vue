<template>
  <div>
    <NotionRenderer :blocks="blocks" />
  </div>
</template>

<script setup>
const blocks = [
  {
    object: 'block',
    id: '568594b1-a50e-44c3-8746-b1e825b56d3e',
    parent: {
      type: 'page_id',
      page_id: '77c36c79-5d5c-463b-abbe-890071acca79',
    },
    created_time: '2023-07-22T15:49:00.000Z',
    last_edited_time: '2023-07-22T20:47:00.000Z',
    created_by: {
      object: 'user',
      id: '0ca0017d-9197-4cc2-a0e8-64f3f8d9690a',
    },
    last_edited_by: {
      object: 'user',
      id: '0ca0017d-9197-4cc2-a0e8-64f3f8d9690a',
    },
    has_children: false,
    archived: false,
    in_trash: false,
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'As part of trying to learn more about Kubernetes, I figured it would be fun to create my own hosting, expose it to the internet and in the process gain some knowledge and experience.',
            link: null,
          },
          annotations: {
            bold: true,
            italic: true,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'purple',
          },
          plain_text: 'As part of trying to learn more about Kubernetes, I figured it would be fun to create my own hosting, expose it to the internet and in the process gain some knowledge and experience.',
          href: null,
        },
      ],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '78ae3f45-de7e-432a-b576-bbc4d6bdbccf',
    parent: {
      type: 'page_id',
      page_id: '77c36c79-5d5c-463b-abbe-890071acca79',
    },
    created_time: '2023-07-22T16:34:00.000Z',
    last_edited_time: '2023-07-22T16:34:00.000Z',
    created_by: {
      object: 'user',
      id: '0ca0017d-9197-4cc2-a0e8-64f3f8d9690a',
    },
    last_edited_by: {
      object: 'user',
      id: '0ca0017d-9197-4cc2-a0e8-64f3f8d9690a',
    },
    has_children: false,
    archived: false,
    in_trash: false,
    type: 'paragraph',
    paragraph: {
      rich_text: [],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: 'b9f78e3a-261d-4258-a562-1b7eb5ef63a5',
    parent: {
      type: 'page_id',
      page_id: '77c36c79-5d5c-463b-abbe-890071acca79',
    },
    created_time: '2024-02-17T17:31:00.000Z',
    last_edited_time: '2024-02-17T17:31:00.000Z',
    created_by: {
      object: 'user',
      id: '0ca0017d-9197-4cc2-a0e8-64f3f8d9690a',
    },
    last_edited_by: {
      object: 'user',
      id: '0ca0017d-9197-4cc2-a0e8-64f3f8d9690a',
    },
    has_children: false,
    archived: false,
    in_trash: false,
    type: 'heading_1',
    heading_1: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'Ansible',
            link: null,
          },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Ansible',
          href: null,
        },
      ],
      is_toggleable: false,
      color: 'default',
    },
  },
  {
    object: 'block',
    id: 'af8c2c5f-e052-4b68-a653-b0b76ee324ff',
    parent: {
      type: 'page_id',
      page_id: '77c36c79-5d5c-463b-abbe-890071acca79',
    },
    created_time: '2024-02-17T18:00:00.000Z',
    last_edited_time: '2024-02-17T18:04:00.000Z',
    created_by: {
      object: 'user',
      id: '0ca0017d-9197-4cc2-a0e8-64f3f8d9690a',
    },
    last_edited_by: {
      object: 'user',
      id: '0ca0017d-9197-4cc2-a0e8-64f3f8d9690a',
    },
    has_children: false,
    archived: false,
    in_trash: false,
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'remote_user = pi',
            link: null,
          },
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: false,
            code: true,
            color: 'default',
          },
          plain_text: 'remote_user = pi',
          href: null,
        },
        {
          type: 'text',
          text: {
            content: ': Enables privilege escalation. By default, Ansible will attempt to use the sudo option to execute commands with administrator privileges on remote hosts.',
            link: null,
          },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: ': Enables privilege escalation. By default, Ansible will attempt to use the sudo option to execute commands with administrator privileges on remote hosts.',
          href: null,
        },
      ],
      color: 'default',
    },
  },
]
</script>
