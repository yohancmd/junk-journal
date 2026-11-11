import { useId } from 'react'
import type { CSSProperties, ReactNode } from 'react'

export type TapePattern =
  | 'solid'
  | 'dots'
  | 'stripes'
  | 'gingham'
  | 'grid'
  | 'check'
  | 'florals'
  | 'hearts'
  | 'vintage'
  | 'image'

export type TapeEdge = 'straight' | 'torn' | 'uneven' | 'scalloped'

export interface WashiTapeProps {
  pattern?: TapePattern
  /** CSS colour, ideally a token such as var(--color-yellow). */
  baseColor?: string
  patternColor?: string
  /** Pattern scale multiplier (1 = default). */
  scale?: number
  /** Tape thickness in px. */
  width?: number
  /** Tape length in px. The pattern repeats along it, never stretches (except imageMode="scale"). */
  length?: number
  edge?: TapeEdge
  opacity?: number
  rotation?: number
  texture?: boolean
  imageSrc?: string
  imageMode?: 'repeat' | 'scale'
  className?: string
  style?: CSSProperties
  title?: string
}

function edgePolygon(len: number, w: number, edge: TapeEdge): string {
  if (edge === 'straight') return `0,0 ${len},0 ${len},${w} 0,${w}`
  const n = Math.max(2, Math.ceil(w / 6))
  const left: string[] = []
  const right: string[] = []
  for (let k = 0; k <= n; k++) {
    const y = Math.min(w, (k * w) / n)
    const dx = edge === 'scalloped' ? (k % 2 ? 5 : 0) : edge === 'uneven' ? (k * 7) % 5 : k % 2 ? 6 : 1
    left.push(`${dx},${y.toFixed(1)}`)
    right.unshift(`${len - dx},${y.toFixed(1)}`)
  }
  return [...left, ...right].join(' ')
}

/** Washi tape renderer (components.md §7.5). */
export function WashiTape({
  pattern = 'dots',
  baseColor = 'var(--color-yellow)',
  patternColor = 'var(--color-red)',
  scale = 1,
  width = 40,
  length = 240,
  edge = 'torn',
  opacity = 0.9,
  rotation = 0,
  texture = false,
  imageSrc,
  imageMode = 'repeat',
  className,
  style,
  title,
}: WashiTapeProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const patId = `tape-pat-${uid}`
  const maskId = `tape-mask-${uid}`
  const grainId = `tape-grain-${uid}`
  const t = Math.max(8, width * 0.4) * scale
  const fg: CSSProperties = { fill: patternColor }

  let tile: ReactNode = null
  switch (pattern) {
    case 'dots':
      tile = <circle cx={t / 2} cy={t / 2} r={t * 0.22} style={fg} />
      break
    case 'stripes':
      tile = <rect width={t / 2} height={t} style={fg} />
      break
    case 'gingham':
      tile = (
        <>
          <rect width={t / 2} height={t} style={{ ...fg, fillOpacity: 0.5 }} />
          <rect width={t} height={t / 2} style={{ ...fg, fillOpacity: 0.5 }} />
        </>
      )
      break
    case 'grid':
      tile = (
        <>
          <rect width={1.5} height={t} style={fg} />
          <rect width={t} height={1.5} style={fg} />
        </>
      )
      break
    case 'check':
      tile = (
        <>
          <rect width={t / 2} height={t / 2} style={fg} />
          <rect x={t / 2} y={t / 2} width={t / 2} height={t / 2} style={fg} />
        </>
      )
      break
    case 'florals':
      tile = (
        <g transform={`translate(${t / 2} ${t / 2})`} style={fg}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} rx={t * 0.12} ry={t * 0.22} cy={-t * 0.18} transform={`rotate(${a})`} />
          ))}
          <circle r={t * 0.1} style={{ fill: baseColor }} />
        </g>
      )
      break
    case 'hearts':
      tile = (
        <path
          transform={`translate(${t * 0.2} ${t * 0.25}) scale(${t / 40})`}
          d="M12 21s-7.5-4.6-10-9.2C.4 8.6 2.3 4 6.4 4c2.2 0 3.9 1.3 5.6 3.4C13.7 5.3 15.4 4 17.6 4 21.7 4 23.6 8.6 22 11.8 19.5 16.4 12 21 12 21z"
          style={fg}
        />
      )
      break
    case 'vintage':
      tile = (
        <g style={{ ...fg, fillOpacity: 0.4 }}>
          <rect x={t * 0.1} y={t * 0.2} width={t * 0.3} height={1.5} transform={`rotate(20 ${t * 0.2} ${t * 0.2})`} />
          <rect x={t * 0.6} y={t * 0.7} width={t * 0.25} height={1.5} transform={`rotate(-30 ${t * 0.7} ${t * 0.7})`} />
        </g>
      )
      break
    default:
      tile = null
  }

  const imageTile = pattern === 'image' && imageSrc
  const patW = imageTile ? (imageMode === 'scale' ? length : width * 1.6 * scale) : t

  return (
    <svg
      className={className}
      width={length}
      height={width}
      viewBox={`0 0 ${length} ${width}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ opacity, transform: rotation ? `rotate(${rotation}deg)` : undefined, overflow: 'visible', ...style }}
    >
      <defs>
        <pattern
          id={patId}
          width={patW}
          height={imageTile ? width : t}
          patternUnits="userSpaceOnUse"
          patternTransform={pattern === 'stripes' ? 'rotate(-35)' : undefined}
        >
          {imageTile ? (
            <image
              href={imageSrc}
              width={patW}
              height={width}
              preserveAspectRatio={imageMode === 'scale' ? 'none' : 'xMidYMid slice'}
            />
          ) : (
            tile
          )}
        </pattern>
        <mask id={maskId}>
          <polygon points={edgePolygon(length, width, edge)} fill="white" />
        </mask>
        {texture && (
          <filter id={grainId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0.3  0 0 0 0 0.1  0 0 0 0.12 0" />
          </filter>
        )}
      </defs>
      <g mask={`url(#${maskId})`}>
        <rect width={length} height={width} style={{ fill: baseColor }} />
        {(tile || imageTile) && <rect width={length} height={width} fill={`url(#${patId})`} />}
        {texture && <rect width={length} height={width} filter={`url(#${grainId})`} />}
      </g>
    </svg>
  )
}
