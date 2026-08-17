/** Durable attachment vocabulary. @module @deepseek-ai/dsh-attachment/types */

import type { AttachmentId } from './brand.ts'

export type { AttachmentId } from './brand.ts'

/** Raster image formats accepted by the version-one attachment path. */
export type ImageMediaType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif'

/** Durable, serializable metadata for one immutable image object. */
export interface ImageAttachmentRef {
  /** Opaque storage identifier; never a filesystem path or bearer URL. */
  attachmentId: AttachmentId
  /** Media type verified from the stored bytes. */
  mediaType: ImageMediaType
  /** Exact encoded byte length. */
  bytes: number
  /** Intrinsic encoded width in pixels. */
  width: number
  /** Intrinsic encoded height in pixels. */
  height: number
  /** Optional display name stripped of local path information. */
  name?: string
}

/** Deployment-resolved limits used by upload admission and request buffering. */
export interface ImageAttachmentLimits {
  maxImageBytes: number
  maxImagesPerMessage: number
  maxMessageImageBytes: number
  maxImagePixels: number
  mediaTypes: readonly ImageMediaType[]
}

/** Request to validate and durably commit one image. */
export interface SaveImageAttachment {
  data: Uint8Array
  /** Caller-declared media type, checked against fully decoded bytes. */
  mediaType: ImageMediaType
  /** Optional browser/provider display name; it is never interpreted as a path. */
  name?: string
}

/** Stored image bytes returned after reference and digest verification. */
export interface StoredImageAttachment {
  ref: ImageAttachmentRef
  data: Uint8Array
}

/** Durable, serializable metadata for one immutable generic file object. */
export interface FileAttachmentRef {
  /** Opaque storage identifier; never a bearer URL. */
  attachmentId: AttachmentId
  /** Browser-declared media type, or `application/octet-stream` when unknown. */
  mediaType: string
  /** Exact encoded byte length. */
  bytes: number
  /** Display name stripped of local path information. */
  name: string
  /**
   * Absolute durable path of the stored bytes. Unlike image refs — which stay
   * behind `readImage` because the MODEL consumes them — a file ref exists so
   * the AGENT can open the bytes with its own tools, so the path is the point.
   */
  path: string
}

/** Deployment-resolved limits for generic file intake. */
export interface FileAttachmentLimits {
  maxFileBytes: number
  maxFilesPerMessage: number
  maxMessageFileBytes: number
}

/** Request to validate and durably commit one generic file. */
export interface SaveFileAttachment {
  data: Uint8Array
  /** Browser-declared media type, or `application/octet-stream` when unknown. */
  mediaType: string
  /** Browser file name; never interpreted as a path. */
  name: string
}
