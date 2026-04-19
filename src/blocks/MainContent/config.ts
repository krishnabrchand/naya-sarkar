import type { Block } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { TableBlock } from '@/blocks/TableBlock/config'
import { YouTube } from '@/blocks/YouTube/config'

export const MainContent: Block = {
  slug: 'mainContent',
  interfaceName: 'MainContentBlock',
  labels: {
    singular: 'Main Content',
    plural: 'Main Content',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Main',
          fields: [
            {
              name: 'main',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    BlocksFeature({
                      blocks: [CallToAction, Content, MediaBlock, YouTube, TableBlock, Archive, FormBlock],
                    }),
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
              label: false,
            },
          ],
        },
        {
          label: 'Sidebar',
          fields: [
            {
              name: 'sidebar',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
              label: false,
            },
          ],
        },
      ],
    },
  ],
}
