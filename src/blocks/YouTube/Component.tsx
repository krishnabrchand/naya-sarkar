import React from 'react'

export type YouTubeBlockProps = {
  url: string
  blockType: 'youtube'
}

type Props = YouTubeBlockProps & {
  className?: string
  inRichText?: boolean
}

const extractYouTubeId = (value: string): string | null => {
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id || null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        return url.searchParams.get('v')
      }

      if (url.pathname.startsWith('/embed/')) {
        const id = url.pathname.split('/')[2]
        return id || null
      }

      if (url.pathname.startsWith('/shorts/')) {
        const id = url.pathname.split('/')[2]
        return id || null
      }
    }
  } catch {
    return null
  }

  return null
}

export const YouTubeBlock: React.FC<Props> = ({ className, inRichText = false, url }) => {
  const videoId = extractYouTubeId(url)

  if (!videoId) return null

  return (
    <div className={[inRichText ? '' : 'container', className].filter(Boolean).join(' ')}>
      <div className="relative w-full overflow-hidden rounded border border-border pb-[56.25%]">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          className="absolute left-0 top-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  )
}
