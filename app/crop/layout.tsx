import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '在线图片裁剪 - 自定义尺寸裁剪工具 | 图缩缩',
  description: '图缩缩提供免费在线图片裁剪，支持自定义尺寸裁剪，预设比例裁剪，精确控制裁剪区域，纯浏览器端处理。',
  keywords: '图片裁剪,在线裁剪,自定义裁剪,图片剪切,尺寸裁剪',
}

export default function CropLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
