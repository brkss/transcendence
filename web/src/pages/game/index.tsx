'use client'

import React from 'react'
import PongSketch from '@/components/Game/PongSketch'
import { Layout } from '@/components'

export default function index() {
    return (
        <Layout disablePadding>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                <PongSketch />
            </div>
        </Layout>
    )
}
