import { useCallback, useRef, useState } from 'react'
import { useClient, insert, setIfMissing } from 'sanity'
import { Button, Stack, Flex, Text, Spinner, Box } from '@sanity/ui'
import { UploadIcon } from '@sanity/icons'
import type { ArrayOfObjectsInputProps } from 'sanity'

export function MultiImageInput(props: ArrayOfObjectsInputProps) {
  const { onChange, renderDefault } = props
  const client = useClient({ apiVersion: '2025-01-01' })
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')

  const handleFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files)
      if (fileArray.length === 0) return

      setUploading(true)
      const patches: ReturnType<typeof insert>[] = []

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        setProgress(`Đang upload ${i + 1}/${fileArray.length}: ${file.name}`)
        try {
          const asset = await client.assets.upload('image', file, {
            filename: file.name,
            contentType: file.type,
          })
          const newItem = {
            _type: 'image',
            _key: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
            asset: { _type: 'reference', _ref: asset._id },
          }
          patches.push(insert([newItem], 'after', [-1]))
        } catch (err) {
          console.error(`Upload thất bại: ${file.name}`, err)
        }
      }

      if (patches.length > 0) {
        onChange([setIfMissing([]), ...patches])
      }

      setUploading(false)
      setProgress('')
    },
    [client, onChange]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files)
        e.target.value = ''
      }
    },
    [handleFiles]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  return (
    <Stack space={4}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      <Box
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        padding={4}
        style={{
          border: '2px dashed #ccc',
          borderRadius: 8,
          background: '#fafafa',
          cursor: uploading ? 'not-allowed' : 'pointer',
        }}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <Flex direction="column" align="center" gap={3}>
          {uploading ? (
            <>
              <Spinner muted />
              <Text size={1} muted>
                {progress}
              </Text>
            </>
          ) : (
            <>
              <Button
                icon={UploadIcon}
                text="Chọn nhiều ảnh (Ctrl+Click)"
                tone="primary"
                mode="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  inputRef.current?.click()
                }}
              />
              <Text size={1} muted>
                hoặc kéo thả nhiều ảnh vào đây
              </Text>
            </>
          )}
        </Flex>
      </Box>

      {renderDefault(props)}
    </Stack>
  )
}
