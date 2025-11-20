'use client'

import { useEffect, useCallback } from 'react'

interface CommentSelectionHandlerProps {
    onSelect: (range: Range, rect: DOMRect) => void
}

export default function CommentSelectionHandler({ onSelect }: CommentSelectionHandlerProps) {
    const handleSelection = useCallback(() => {
        // Use setTimeout to allow the selection to stabilize
        setTimeout(() => {
            const selection = window.getSelection()

            if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
                return
            }

            const range = selection.getRangeAt(0)
            const text = range.toString().trim()

            if (!text) {
                return
            }

            // Get the bounding rectangle of the selection
            const rect = range.getBoundingClientRect()

            // Call onSelect directly - no button needed
            onSelect(range, rect)
        }, 10) // Small delay to let selection stabilize
    }, [onSelect])

    useEffect(() => {
        document.addEventListener('mouseup', handleSelection)

        return () => {
            document.removeEventListener('mouseup', handleSelection)
        }
    }, [handleSelection])

    return null // No visual component
}
