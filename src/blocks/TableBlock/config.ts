import type { Block, Field } from 'payload'

const maxColumns = 6

const columnField = (index: number): Field => {
  const n = index + 1
  return {
    name: `col${n}`,
    type: 'text',
    label: `Column ${n}`,
    admin: {
      condition: (_data, _sibling, { blockData }) => {
        const raw = blockData?.columnCount
        const nCols = raw != null && raw !== '' ? Number(raw) : 3
        return Number.isFinite(nCols) && nCols >= n
      },
    },
  }
}

export const TableBlock: Block = {
  slug: 'tableBlock',
  interfaceName: 'TableBlock',
  labels: {
    singular: 'Table',
    plural: 'Tables',
  },
  fields: [
    {
      name: 'columnCount',
      type: 'select',
      required: true,
      defaultValue: '3',
      label: 'Columns',
      options: Array.from({ length: maxColumns - 1 }, (_, i) => {
        const value = String(i + 2)
        return { label: `${value} columns`, value }
      }),
    },
    {
      name: 'firstRowIsHeader',
      type: 'checkbox',
      label: 'First row is header',
      defaultValue: false,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption (optional)',
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Rows',
      minRows: 1,
      admin: {
        initCollapsed: true,
      },
      labels: {
        singular: 'Row',
        plural: 'Rows',
      },
      fields: Array.from({ length: maxColumns }, (_, i) => columnField(i)),
    },
  ],
}
