'use client'

import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'
import { YouTubeBlock, YouTubeBlockProps } from '@/blocks/YouTube/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { defaultLocale, locales } from '@/i18n/config'
import { cn } from '@/utilities/ui'
import { usePathname } from 'next/navigation'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps | YouTubeBlockProps
    >

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    youtube: ({ node }) => (
      <YouTubeBlock className="col-start-1 col-span-3" inRichText={true} {...node.fields} />
    ),
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  locale?: string
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, locale, ...rest } = props
  const pathname = usePathname() || '/'
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  const pathLocale =
    firstSegment && (locales as readonly string[]).includes(firstSegment) ? firstSegment : undefined
  const currentLocale = locale ?? pathLocale ?? defaultLocale
  const isDefaultLocale = currentLocale === defaultLocale

  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'ns-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose dark:prose-invert': enableProse,
          'md:prose-md': enableProse,
          'md:prose-lg': enableProse,
          'text-xl md:text-[1.375rem] leading-relaxed md:leading-relaxed': isDefaultLocale,
          'text-lg md:text-xl leading-relaxed md:leading-relaxed': !isDefaultLocale,
        },
        className,
      )}
      {...rest}
    />
  )
}
