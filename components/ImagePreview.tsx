'use client'

import { useState, useRef, useCallback } from 'react'

interface ImagePreviewProps {
  originalSrc: string
  processedSrc?: string
  originalLabel?: string
  processedLabel?: string
}

export default function ImagePreview({
  originalSrc,
  processedSrc,
  originalLabel = '原图',
  processedLabel = '处理后',
}: ImagePreviewProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setSliderPosition(percent)
    },
    [isDragging]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percent)
  }, [])

  // If no processed image, show single preview
  if (!processedSrc) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-medium text-gray-700 mb-3">{originalLabel}</h3>
        <img
          src={originalSrc}
          alt={originalLabel}
          className="max-w-full max-h-96 mx-auto rounded-lg"
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-700">对比预览</h3>
        <span className="text-sm text-gray-500">拖动滑块对比</span>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg cursor-col-resize select-none"
        style={{ maxHeight: '500px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* After (full width background) */}
        <img
          src={processedSrc}
          alt={processedLabel}
          className="w-full h-auto block"
          style={{ maxHeight: '500px', objectFit: 'contain' }}
        />

        {/* Before (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalSrc}
            alt={originalLabel}
            className="w-full h-auto block"
            style={{
              maxHeight: '500px',
              objectFit: 'contain',
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
            }}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Slider handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-gray-400 text-xs">⬤</span>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {originalLabel}
        </div>
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {processedLabel}
        </div>
      </div>
    </div>
  )
}
