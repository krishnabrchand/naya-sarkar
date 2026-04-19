import React from 'react'

import RichText from '@/components/RichText'
import type { MainContentBlock as MainContentBlockProps } from '@/payload-types'

export const MainContentBlock: React.FC<MainContentBlockProps> = ({ main, sidebar }) => {
  return (
    <div className="container my-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">{main ? <RichText data={main} enableGutter={false} /> : null}</div>
        <aside className="lg:col-span-4">
          {sidebar ? <RichText data={sidebar} enableGutter={false} /> : null}
        </aside>
      </div>
    </div>
  )
}
