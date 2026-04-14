import type { Block } from 'payload'

const isValidYouTubeUrl = (value?: string | null): true | string => {
  if (!value) return 'YouTube URL is required'

  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')
    const allowedHosts = ['youtube.com', 'youtu.be', 'm.youtube.com']

    if (allowedHosts.includes(host)) return true
    return 'Please enter a valid YouTube URL'
  } catch {
    return 'Please enter a valid YouTube URL'
  }
}

export const YouTube: Block = {
  slug: 'youtube',
  interfaceName: 'YouTubeBlock',
  fields: [
    {
      name: 'url',
      type: 'text',
      label: 'YouTube URL',
      required: true,
      validate: isValidYouTubeUrl,
    },
  ],
}
