import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '在线图片压缩 - 免费JPG/PNG/WebP压缩工具 | 图缩缩',
  description: '图缩缩提供免费在线图片压缩，支持JPG、PNG、WebP格式，可调节压缩质量，纯浏览器端处理，保护隐私。',
  keywords: '图片压缩,JPG压缩,PNG压缩,WebP压缩,在线压缩,图片瘦身',
}

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
