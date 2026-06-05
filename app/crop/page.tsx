'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import ImageUploader from '@/components/ImageUploader'

type AspectRatio = 'free' | '1:1' | '4:3' | '16:9' | '3:2'

const aspectRatios: { label: string; value: AspectRatio; ratio?: number }[] = [
  { label: '自由裁剪', value: 'free' },
  { label: '1:1', value: '1:1', ratio: 1 },
  { label: '4:3', value: '4:3', ratio: 4 / 3 },
  { label: '16:9', value: '16:9', ratio: 16 / 9 },
  { label: '3:2', value: '3:2', ratio: 3 / 2 },
]

export default function CropPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalPreview, setOriginalPreview] = useState<string>('')
  const [croppedPreview, setCroppedPreview] = useState<string>('')
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('free')
  const [cropWidth, setCropWidth] = useState(0)
  const [cropHeight, setCropHeight] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, w: 0, h: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleImageSelect = useCallback((file: File) => {
    setOriginalFile(file)
    const url = URL.createObjectURL(file)
    setOriginalPreview(url)
    setCroppedPreview('')
    setCroppedBlob(null)

    const img = new Image()
    img.onload = () => {
      setImgDimensions({ width: img.width, height: img.height })
      setCropWidth(img.width)
      setCropHeight(img.height)
      // 默认裁剪区域为图片中心50%
      const w = Math.round(img.width * 0.5)
      const h = Math.round(img.height * 0.5)
      setCropArea({
        x: Math.round((img.width - w) / 2),
        y: Math.round((img.height - h) / 2),
        w,
        h,
      })
    }
    img.src = url
  }, [])

  // Draw crop overlay on canvas
  useEffect(() => {
    if (!originalPreview || !canvasRef.current || !imgDimensions.width) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      const containerWidth = containerRef.current?.clientWidth || 600
      const scale = Math.min(containerWidth / img.width, 500 / img.height, 1)
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Draw dark overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Clear crop area (show original)
      const sx = cropArea.x * scale
      const sy = cropArea.y * scale
      const sw = cropArea.w * scale
      const sh = cropArea.h * scale

      ctx.save()
      ctx.beginPath()
      ctx.rect(sx, sy, sw, sh)
      ctx.clip()
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      ctx.restore()

      // Draw crop border
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.strokeRect(sx, sy, sw, sh)

      // Draw corner handles
      const handleSize = 8
      ctx.fillStyle = '#3b82f6'
      const corners = [
        [sx, sy],
        [sx + sw, sy],
        [sx, sy + sh],
        [sx + sw, sy + sh],
      ]
      corners.forEach(([cx, cy]) => {
        ctx.fillRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize)
      })
    }
    img.src = originalPreview
  }, [originalPreview, cropArea, imgDimensions])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsDragging(true)
      const canvas = canvasRef.current!
      const rect = canvas.getBoundingClientRect()
      const scale = imgDimensions.width / canvas.width

      const startX = (e.clientX - rect.left) * scale
      const startY = (e.clientY - rect.top) * scale

      setCropArea((prev) => {
        let newW = prev.w
        let newH = prev.h
        const ratio = aspectRatios.find((r) => r.value === aspectRatio)?.ratio
        if (ratio) {
          newH = Math.round(newW / ratio)
        }
        return {
          x: Math.max(0, Math.min(startX - newW / 2, imgDimensions.width - newW)),
          y: Math.max(0, Math.min(startY - newH / 2, imgDimensions.height - newH)),
          w: newW,
          h: newH,
        }
      })
    },
    [imgDimensions, aspectRatio]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging) return
      const canvas = canvasRef.current!
      const rect = canvas.getBoundingClientRect()
      const scale = imgDimensions.width / canvas.width

      const mouseX = (e.clientX - rect.left) * scale
      const mouseY = (e.clientY - rect.top) * scale

      setCropArea((prev) => {
        const newX = Math.max(0, Math.min(mouseX - prev.w / 2, imgDimensions.width - prev.w))
        const newY = Math.max(0, Math.min(mouseY - prev.h / 2, imgDimensions.height - prev.h))
        return { ...prev, x: newX, y: newY }
      })
    },
    [isDragging, imgDimensions]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleAspectRatioChange = useCallback(
    (value: AspectRatio) => {
      setAspectRatio(value)
      const ratio = aspectRatios.find((r) => r.value === value)?.ratio
      if (ratio && imgDimensions.width) {
        setCropArea((prev) => {
          let newW = prev.w
          let newH = Math.round(newW / ratio)
          if (newH > imgDimensions.height) {
            newH = imgDimensions.height
            newW = Math.round(newH * ratio)
          }
          if (newW > imgDimensions.width) {
            newW = imgDimensions.width
            newH = Math.round(newW / ratio)
          }
          return {
            x: Math.min(prev.x, imgDimensions.width - newW),
            y: Math.min(prev.y, imgDimensions.height - newH),
            w: newW,
            h: newH,
          }
        })
      }
      setCroppedPreview('')
      setCroppedBlob(null)
    },
    [imgDimensions]
  )

  const handleWidthChange = useCallback(
    (val: number) => {
      setCropWidth(val)
      const ratio = aspectRatios.find((r) => r.value === aspectRatio)?.ratio
      if (ratio) {
        setCropHeight(Math.round(val / ratio))
      }
      setCropArea((prev) => ({
        ...prev,
        w: Math.min(val, imgDimensions.width),
        h: ratio ? Math.round(Math.min(val, imgDimensions.width) / ratio) : prev.h,
      }))
    },
    [aspectRatio, imgDimensions]
  )

  const handleHeightChange = useCallback(
    (val: number) => {
      setCropHeight(val)
      const ratio = aspectRatios.find((r) => r.value === aspectRatio)?.ratio
      if (ratio) {
        setCropWidth(Math.round(val * ratio))
      }
      setCropArea((prev) => ({
        ...prev,
        h: Math.min(val, imgDimensions.height),
        w: ratio ? Math.round(Math.min(val, imgDimensions.height) * ratio) : prev.w,
      }))
    },
    [aspectRatio, imgDimensions]
  )

  const handleCrop = useCallback(async () => {
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
      canvas.width = cropArea.w
      canvas.height = cropArea.h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.w,
        cropArea.h,
        0,
        0,
        cropArea.w,
        cropArea.h
      )

      URL.revokeObjectURL(url)

      const format = originalFile.type === 'image/png' ? 'image/png' : 'image/jpeg'
      const quality = format === 'image/png' ? undefined : 0.92
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b)
            else reject(new Error('裁剪失败'))
          },
          format,
          quality
        )
      })

      setCroppedBlob(blob)
      setCroppedPreview(URL.createObjectURL(blob))
    } catch (error) {
      console.error('裁剪失败:', error)
      alert('图片裁剪失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }, [originalFile, cropArea])

  const handleDownload = useCallback(() => {
    if (!croppedBlob || !originalFile) return
    const ext = originalFile.type === 'image/png' ? 'png' : 'jpg'
    const name = originalFile.name.replace(/\.[^/.]+$/, '') + '_cropped.' + ext
    const url = URL.createObjectURL(croppedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }, [croppedBlob, originalFile])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">在线图片裁剪</h1>
          <p className="text-gray-600">自定义尺寸裁剪，支持预设比例</p>
        </div>

        {!originalFile ? (
          <ImageUploader
            onImageSelect={handleImageSelect}
            accept={{ 'image/jpeg': [], 'image/png': [], 'image/webp': [] }}
          />
        ) : (
          <div className="space-y-6">
            {/* 裁剪控制 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* 比例选择 */}
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">裁剪比例</label>
                <div className="flex flex-wrap gap-2">
                  {aspectRatios.map((ar) => (
                    <button
                      key={ar.value}
                      onClick={() => handleAspectRatioChange(ar.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        aspectRatio === ar.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {ar.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 尺寸输入 */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">宽度 (px)</label>
                  <input
                    type="number"
                    value={cropArea.w}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={1}
                    max={imgDimensions.width}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">高度 (px)</label>
                  <input
                    type="number"
                    value={cropArea.h}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={1}
                    max={imgDimensions.height}
                  />
                </div>
                <div className="flex items-end">
                  <span className="text-sm text-gray-500 pb-2">
                    原图：{imgDimensions.width} × {imgDimensions.height}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCrop}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? '裁剪中...' : '裁剪图片'}
                </button>
                <button
                  onClick={() => {
                    setOriginalFile(null)
                    setOriginalPreview('')
                    setCroppedPreview('')
                    setCroppedBlob(null)
                  }}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  重新选择
                </button>
                {croppedBlob && (
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    下载裁剪图片
                  </button>
                )}
              </div>
            </div>

            {/* 裁剪预览 */}
            <div ref={containerRef} className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500 mb-3">拖动鼠标调整裁剪区域</p>
              <canvas
                ref={canvasRef}
                className="w-full cursor-move rounded-lg"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>

            {/* 裁剪结果 */}
            {croppedPreview && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-green-800 font-medium">✅ 裁剪完成！</p>
                <p className="text-green-600 text-sm mt-1">
                  裁剪尺寸：{cropArea.w} × {cropArea.h} 像素
                </p>
              </div>
            )}

            {/* 裁剪结果预览 */}
            {croppedPreview && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-medium text-gray-700 mb-3">裁剪结果</h3>
                <img
                  src={croppedPreview}
                  alt="裁剪结果"
                  className="max-w-full max-h-96 mx-auto rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
