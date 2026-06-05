import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '在线图片格式转换 - JPG PNG WebP互转 | 图缩缩',
  description: '图缩缩提供免费在线图片格式转换，支持JPG、PNG、WebP格式互相转换，一键完成，纯浏览器端处理。',
  keywords: '图片格式转换,JPG转PNG,PNG转WebP,WebP转JPG,在线转换',
}

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
