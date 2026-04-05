import { cn } from '@/utilities/ui'
import React from 'react'

import type { TableBlock as TableBlockProps } from '@/payload-types'

const COL_KEYS = ['col1', 'col2', 'col3', 'col4', 'col5', 'col6'] as const

type Props = TableBlockProps & {
  disableInnerContainer?: boolean
}

export const TableBlock: React.FC<Props> = ({
  caption,
  columnCount,
  disableInnerContainer,
  firstRowIsHeader,
  rows,
}) => {
  const cols = Math.min(Math.max(Number(columnCount) || 2, 2), COL_KEYS.length)
  const rowList = rows ?? []
  if (rowList.length === 0) {
    return null
  }

  const cellText = (row: (typeof rowList)[number], key: (typeof COL_KEYS)[number]) => {
    const v = row[key]
    return typeof v === 'string' ? v : ''
  }

  const [headRows, bodyRows] = firstRowIsHeader
    ? [rowList.slice(0, 1), rowList.slice(1)]
    : [[], rowList]

  return (
    <div
      className={cn('container', {
        container: !disableInnerContainer,
      })}
    >
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full min-w-200 border-collapse text-sm">
          {caption ? (
            <caption className="border-b border-border px-4 py-2 text-left text-muted-foreground">
              {caption}
            </caption>
          ) : null}
          {headRows.length > 0 ? (
            <thead>
              {headRows.map((row, i) => (
                <tr key={row.id ?? `h-${i}`} className="bg-muted/80">
                  {COL_KEYS.slice(0, cols).map((key) => (
                    <th
                      key={key}
                      scope="col"
                      className="border-b border-border px-3 py-2 text-left font-semibold text-foreground text-lg"
                    >
                      {cellText(row, key)}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          ) : null}
          <tbody>
            {bodyRows.map((row, i) => (
              <tr key={row.id ?? `r-${i}`} className={cn(i % 2 === 1 && 'bg-muted/40')}>
                {COL_KEYS.slice(0, cols).map((key) => (
                  <td
                    key={key}
                    className="border-b border-border px-3 py-2 align-top text-foreground text-lg"
                  >
                    {cellText(row, key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
