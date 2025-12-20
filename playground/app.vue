<template>
  <div class="max-w-4xl mx-auto">
    <NotionRenderer :blocks="blocks" />
  </div>
</template>

<script setup>
const blocks = [
  {
    object: 'block',
    id: '19917292-7d72-8006-93db-d958030e73bf',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-13T16:29:00.000Z',
    last_edited_time: '2025-02-15T13:12:00.000Z',
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
    type: 'code',
    code: {
      caption: [],
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'const user = {  firstName: "Angela",  lastName: "Davis",  role: "Professor"} \n\nconsole.log(user.name)',
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
          plain_text: 'const user = {  firstName: "Angela",  lastName: "Davis",  role: "Professor"} \n\nconsole.log(user.name)',
          href: null,
        },
      ],
      language: 'typescript',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-80ed-9294-cf4ef80f3e4d',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:26:00.000Z',
    last_edited_time: '2025-02-19T20:26:00.000Z',
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
    id: '19f17292-7d72-8072-b728-c7cee257e5fd',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:26:00.000Z',
    last_edited_time: '2025-02-19T20:26:00.000Z',
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
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
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
          plain_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          href: null,
        },
      ],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-80f4-975b-cc52c8e20b87',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:26:00.000Z',
    last_edited_time: '2025-02-19T20:26:00.000Z',
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
            content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
          plain_text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          href: null,
        },
      ],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-806d-9cdf-f63570b638b4',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
    id: '19f17292-7d72-8022-9286-e12a60503600',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
            content: 'Heading 1',
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
          plain_text: 'Heading 1',
          href: null,
        },
      ],
      is_toggleable: false,
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-80f7-bbda-ce27dc312ed3',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
    type: 'heading_2',
    heading_2: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'Heading 2',
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
          plain_text: 'Heading 2',
          href: null,
        },
      ],
      is_toggleable: false,
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-808f-9180-f6d0cc179ad5',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
    type: 'heading_3',
    heading_3: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'heading 3',
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
          plain_text: 'heading 3',
          href: null,
        },
      ],
      is_toggleable: false,
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-805b-9a93-e6a7e1681c8d',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
    id: '19f17292-7d72-8055-9e45-d2de8db58bdd',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
            content: 'list',
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
          plain_text: 'list',
          href: null,
        },
      ],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-8042-a9e2-cea6831535e4',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
            content: 'list',
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
          plain_text: 'list',
          href: null,
        },
      ],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-8089-887a-e073b9f30fcb',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
            content: 'list',
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
          plain_text: 'list',
          href: null,
        },
      ],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-80ed-b39e-c455b3d015dd',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
    id: '19f17292-7d72-8018-88d1-ffef5dc970fd',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-20T16:05:00.000Z',
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
    type: 'to_do',
    to_do: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'todo ',
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
          plain_text: 'todo ',
          href: null,
        },
      ],
      checked: false,
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-80c1-a36c-ff1909756777',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-20T16:06:00.000Z',
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
    type: 'to_do',
    to_do: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'todo',
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
          plain_text: 'todo',
          href: null,
        },
      ],
      checked: true,
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-806c-8647-cdb2dd030f87',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
    type: 'to_do',
    to_do: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'todo',
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
          plain_text: 'todo',
          href: null,
        },
      ],
      checked: false,
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-8069-b099-c84e22113d84',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
    id: '19f17292-7d72-803c-af09-c5bd1245a6a0',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
    type: 'numbered_list_item',
    numbered_list_item: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'number',
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
          plain_text: 'number',
          href: null,
        },
      ],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-80cc-a7af-f4dae973a0d6',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
    type: 'numbered_list_item',
    numbered_list_item: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'number',
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
          plain_text: 'number',
          href: null,
        },
      ],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-803b-90ac-cdfd235ecde8',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
    type: 'numbered_list_item',
    numbered_list_item: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'number',
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
          plain_text: 'number',
          href: null,
        },
      ],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-8019-9327-de86b412799d',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:27:00.000Z',
    last_edited_time: '2025-02-19T20:27:00.000Z',
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
    id: '19f17292-7d72-8000-b89e-e33cc22c9ded',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:28:00.000Z',
    last_edited_time: '2025-02-19T20:28:00.000Z',
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
    type: 'callout',
    callout: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'callout text',
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
          plain_text: 'callout text',
          href: null,
        },
      ],
      icon: null,
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-80ff-8b91-d1c83b7b7582',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:28:00.000Z',
    last_edited_time: '2025-02-19T20:28:00.000Z',
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
    id: '19f17292-7d72-8051-823c-d4b73f07f7f8',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:28:00.000Z',
    last_edited_time: '2025-02-19T20:28:00.000Z',
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
    type: 'quote',
    quote: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'quote',
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
          plain_text: 'quote',
          href: null,
        },
      ],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-8086-b47a-c20ab0589cb9',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:28:00.000Z',
    last_edited_time: '2025-02-19T20:28:00.000Z',
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
    id: '19f17292-7d72-804a-92f5-d3122b08206e',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:28:00.000Z',
    last_edited_time: '2025-02-19T20:28:00.000Z',
    created_by: {
      object: 'user',
      id: '0ca0017d-9197-4cc2-a0e8-64f3f8d9690a',
    },
    last_edited_by: {
      object: 'user',
      id: '0ca0017d-9197-4cc2-a0e8-64f3f8d9690a',
    },
    has_children: true,
    archived: false,
    in_trash: false,
    type: 'table',
    table: {
      table_width: 2,
      has_column_header: false,
      has_row_header: false,
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-80de-bb9b-f796cc6e52b0',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:28:00.000Z',
    last_edited_time: '2025-02-19T20:29:00.000Z',
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
            content: 'sx',
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
          plain_text: 'sx',
          href: null,
        },
      ],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-80d6-ba18-c3f427c89c2b',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:29:00.000Z',
    last_edited_time: '2025-02-19T20:29:00.000Z',
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
    type: 'divider',
    divider: {},
  },
  {
    object: 'block',
    id: '19f17292-7d72-8084-82da-fa515bbd6407',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:29:00.000Z',
    last_edited_time: '2025-02-19T20:29:00.000Z',
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
            content: 'xs',
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
          plain_text: 'xs',
          href: null,
        },
      ],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-80b5-89e0-f631696f2145',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:29:00.000Z',
    last_edited_time: '2025-02-19T20:29:00.000Z',
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
    type: 'image',
    image: {
      caption: [],
      type: 'external',
      external: {
        url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb',
      },
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-80cb-a269-e460ad5ccc84',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:29:00.000Z',
    last_edited_time: '2025-02-19T20:29:00.000Z',
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
    id: '19f17292-7d72-808f-bf80-c515503a30bb',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:29:00.000Z',
    last_edited_time: '2025-02-19T20:29:00.000Z',
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
    type: 'table_of_contents',
    table_of_contents: {
      color: 'gray',
    },
  },
  {
    object: 'block',
    id: '19f17292-7d72-8097-ac1d-f56ab459c34d',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:29:00.000Z',
    last_edited_time: '2025-02-19T20:29:00.000Z',
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
    id: '19f17292-7d72-8065-9767-ecb7d021b688',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:29:00.000Z',
    last_edited_time: '2025-02-19T20:29:00.000Z',
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
    type: 'breadcrumb',
    breadcrumb: {},
  },
  {
    object: 'block',
    id: '19f17292-7d72-800c-8a51-fa73e896b453',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:30:00.000Z',
    last_edited_time: '2025-02-19T20:30:00.000Z',
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
    id: '19f17292-7d72-80ac-8a3e-d707e92b5b2f',
    parent: {
      type: 'page_id',
      page_id: '19617292-7d72-801f-bb26-dec69caa7f71',
    },
    created_time: '2025-02-19T20:30:00.000Z',
    last_edited_time: '2025-02-19T20:30:00.000Z',
    created_by: {
      object: 'user',
      id: '0ca0017d-9197-4cc2-a0e8-64f3f8d9690a',
    },
    last_edited_by: {
      object: 'user',
      id: '0ca0017d-9197-4cc2-a0e8-64f3f8d9690a',
    },
    has_children: true,
    archived: false,
    in_trash: false,
    type: 'column_list',
    column_list: {},
  },
]
</script>
