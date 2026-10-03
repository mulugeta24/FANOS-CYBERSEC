import React from 'react'
import { Box, Typography } from '@mui/material'

export default function FanosLogo({ size = 38, showText = true, textSize = '1.35rem' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, userSelect: 'none', cursor: 'pointer' }}>
      {/* Cyber Geometric Logo Icon (Matches Reference Image) */}
      <Box
        sx={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          filter: 'drop-shadow(0 0 12px rgba(14, 165, 233, 0.7))',
          transition: 'transform 0.25s ease',
          '&:hover': {
            transform: 'scale(1.06)',
          },
        }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <linearGradient id="cyberCyanGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="cyberCyanGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="cyberCyanLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0f9ff" />
              <stop offset="50%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Top Wing / Angular Facet */}
          <path
            d="M6 14 L28 8 L42 15 L22 22 Z"
            fill="url(#cyberCyanGrad1)"
          />
          {/* Middle Angular Blade */}
          <path
            d="M10 24 L24 20 L35 25 L18 30 Z"
            fill="url(#cyberCyanLight)"
          />
          {/* Lower Stem / Left Base */}
          <path
            d="M14 31 L22 29 L27 35 L12 41 Z"
            fill="url(#cyberCyanGrad2)"
          />
        </svg>
      </Box>

      {/* Brand Text */}
      {showText && (
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: textSize,
            letterSpacing: '0.01em',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            lineHeight: 1,
          }}
        >
          <span style={{ color: '#ffffff', fontWeight: 800 }}>Fanos</span>
          <span
            style={{
              color: '#38bdf8',
              fontWeight: 800,
              textShadow: '0 0 16px rgba(56, 189, 248, 0.5)',
            }}
          >
            CyberSec
          </span>
        </Typography>
      )}
    </Box>
  )
}
