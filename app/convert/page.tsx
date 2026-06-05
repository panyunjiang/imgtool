'use client'

import { useState, useCallback } from 'react'
import ImageUploader from '@/components/ImageUploader'
import ImagePreview from '@/components/ImagePreview'

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp'

const formatOptions: { label: string; value: OutputFormat; ext: string }[] = [
  { label: 'JPG', value: 'image/jpeg', ext: 'jpg' },
  { label: 'PNG', value: 'image/png', ext: 'png' },
  { label: 'WebP', value: 'image/webp', ext: 'webp' },
]

export default function ConvertPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalPreview, setOriginalPreview] = useState<string>('')
  const [convertedPreview, setConvertedPreview] = useState<string>('')
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null)
  const [targetFormat, setTargetFormat] = useState<OutputFormat>('image/png')
  const [isProcessing, setIsProcessing] = useState(false)
  const [originalFormat, setOriginalFormat] = useState('')

  const handleImageSelect = useCallback((file: File) => {
    setOriginalFile(file)
    setOriginalPreview(URL.createObjectURL(file))
    setOriginalFormat(file.type.split('/')[1]?.toUpperCase() || '未知')
    setConvertedPreview('')
    setConvertedBlob(null)
  }, [])

  const handleConvert = useCallback(async () => {
    if (!originalFile) return
    setIsProcessing(true)

    try {
      const img = new Image()
      const url = URL.createObjectURL(originalFile)

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = reject
        img.src = url
      })

      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)

      URL.revokeObjectURL(url)

      const quality = targetFormat === 'image/png' ? undefined : 0.92
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b)
            else reject(new Error('转换失败'))
          },
          targetFormat,
          quality
        )
      })

      setConvertedBlob(blob)
      setConvertedPreview(URL.createObjectURL(blob))
    } catch (error) {
      console.error('转换失败:', error)
      alert('图片格式转换失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }, [originalFile, targetFormat])

  const handleDownload = useCallback(() => {
    if (!convertedBlob || !originalFile) return
    const ext = formatOptions.find((f) => f.value === targetFormat)?.ext || 'png'
    const name = originalFile.name.replace(/\.[^/.]+$/, '') + '.' + ext
    const url = URL.createObjectURL(convertedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }, [convertedBlob, originalFile, targetFormat])

  const targetExt = formatOptions.find((f) => f.value === targetFormat)?.ext?.toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">在线图片格式转换</h1>
          <p className="text-gray-600">JPG、PNG、WebP格式互相转换，一键完成</p>
        </div>

        {!originalFile ? (
          <ImageUploader
            onImageSelect={handleImageSelect}
            accept={{ 'image/jpeg': [], 'image/png': [], 'image/webp': [] }}
          />
        ) : (
          <div className="space-y-6">
            {/* 格式选择 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <span className="text-gray-700">
                  原始格式：<strong>{originalFormat}</strong>
                </span>
                <span className="text-gray-400">→</span>
                <span className="text-gray-700">转换为：</span>
                <div className="flex gap-2">
                  {formatOptions.map((fmt) => (
                    <button
                      key={fmt.value}
                      onClick={() => {
                        setTargetFormat(fmt.value)
                        setConvertedPreview('')
                        setConvertedBlob(null)
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        targetFormat === fmt.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? '转换中...' : '开始转换'}
                </button>
                <button
                  onClick={() => {
                    setOriginalFile(null)
                    setOriginalPreview('')
                    setConvertedPreview('')
                    setConvertedBlob(null)
                  }}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  重新选择
                </button>
                {convertedBlob && (
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    下载 {targetExt} 图片
                  </button>
                )}
              </div>
            </div>

            {/* 转换结果 */}
            {convertedBlob && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-green-800 font-medium">
                  ✅ 格式转换完成！已转换为 {targetExt} 格式
                </p>
              </div>
            )}

            {/* 预览 */}
            {originalPreview && (
              <ImagePreview
                originalSrc={originalPreview}
                processedSrc={convertedPreview || undefined}
                originalLabel={`原图 (${originalFormat})`}
                processedLabel={convertedPreview ? `转换后 (${targetExt})` : ''}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
