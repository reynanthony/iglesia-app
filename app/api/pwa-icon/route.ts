import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'
import React from 'react'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const s = Math.min(512, Math.max(16, parseInt(req.nextUrl.searchParams.get('size') ?? '192')))
  const cross = Math.round(s * 0.46)

  return new ImageResponse(
    React.createElement(
      'div',
      {
        style: {
          width: s,
          height: s,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#093C5D',
        },
      },
      React.createElement(
        'svg',
        { width: cross, height: cross, viewBox: '0 0 48 48', fill: 'none' },
        React.createElement('rect', { x: '21.5', y: '9', width: '5', height: '30', rx: '2.5', fill: '#F6F3EB' }),
        React.createElement('rect', { x: '9', y: '18', width: '30', height: '5', rx: '2.5', fill: '#F6F3EB' })
      )
    ),
    { width: s, height: s }
  )
}
