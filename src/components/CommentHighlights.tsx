'use client'

import { useEffect } from 'react'
import { Comment } from '@/hooks/useComments'

interface CommentHighlightsProps {
    comments: Comment[]
    onCommentClick: (comment: Comment, rect: DOMRect) => void
    hoveredCommentId?: string | null
    pendingSelection?: Range | null
    activeCommentId?: string | null
}

export default function CommentHighlights({ comments, onCommentClick, hoveredCommentId, pendingSelection, activeCommentId }: CommentHighlightsProps) {
    // Handle pending selection highlight
    useEffect(() => {
        if (!pendingSelection) return

        const range = pendingSelection
        const span = document.createElement('span')
        span.className = 'pending-comment-highlight'
        span.style.backgroundColor = 'rgba(59, 130, 246, 0.2)' // Blue tint for draft
        span.style.borderBottom = '2px dashed #3b82f6'

        try {
            // We need to clone the range to avoid modifying the original selection range
            // which might be needed for the actual comment submission
            const safeRange = range.cloneRange()
            safeRange.surroundContents(span)

            // Cleanup function to unwrap the span
            return () => {
                const parent = span.parentNode
                if (parent) {
                    while (span.firstChild) {
                        parent.insertBefore(span.firstChild, span)
                    }
                    parent.removeChild(span)
                    parent.normalize()
                }
            }
        } catch (e) {
            console.warn('Failed to highlight pending selection:', e)
            return undefined
        }
    }, [pendingSelection])

    // Apply highlights when comments change
    useEffect(() => {
        // Clean up existing highlights
        document.querySelectorAll('.has-comment').forEach(el => {
            if ((el as any)._commentCleanup) {
                (el as any)._commentCleanup()
            }
        })

        // Apply new highlights
        comments.forEach(comment => {
            try {
                if (!comment.xpath_selector || !comment.text_content) return

                const result = document.evaluate(
                    comment.xpath_selector,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                )

                const node = result.singleNodeValue
                if (!node) return

                // Find the actual text node containing the comment text
                const findTextNode = (node: Node, searchText: string): Text | null => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const content = node.textContent || ''
                        // Normalize whitespace for comparison
                        const normalizedContent = content.replace(/\s+/g, ' ')
                        const normalizedSearch = searchText.replace(/\s+/g, ' ')

                        if (normalizedContent.includes(normalizedSearch) || content.includes(searchText)) {
                            return node as Text
                        }
                        return null
                    }

                    // Check children
                    for (let i = 0; i < node.childNodes.length; i++) {
                        const found = findTextNode(node.childNodes[i], searchText)
                        if (found) return found
                    }
                    return null
                }
                const textNode = findTextNode(node, comment.text_content)
                if (!textNode || !textNode.parentElement) return

                // Create a highlight span only for the specific text
                const parent = textNode.parentElement
                const text = textNode.textContent || ''
                const index = text.indexOf(comment.text_content)

                if (index === -1) return

                // Split the text node and wrap the comment text in a span
                const range = document.createRange()
                range.setStart(textNode, index)
                range.setEnd(textNode, index + comment.text_content.length)

                const highlightSpan = document.createElement('span')
                highlightSpan.className = 'has-comment'
                highlightSpan.setAttribute('data-comment-id', comment.id)
                highlightSpan.style.backgroundColor = 'rgba(255, 215, 0, 0.3)'
                highlightSpan.style.borderBottom = '2px solid #fbbf24'
                highlightSpan.style.cursor = 'pointer'
                highlightSpan.style.transition = 'background-color 0.2s, border-color 0.2s'
                highlightSpan.style.paddingBottom = '2px'

                // Add click listener
                const handleClick = (e: Event) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const rect = highlightSpan.getBoundingClientRect()
                    onCommentClick(comment, rect)
                }

                highlightSpan.addEventListener('click', handleClick)

                // Wrap the range with the highlight span
                try {
                    range.surroundContents(highlightSpan)
                } catch (e) {
                    // If surroundContents fails (e.g., range spans multiple elements),
                    // fall back to simple element highlighting
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as HTMLElement
                        element.classList.add('has-comment')
                        element.setAttribute('data-comment-id', comment.id)
                        element.style.backgroundColor = 'rgba(255, 215, 0, 0.2)'
                        element.style.borderBottom = '2px solid #fbbf24'
                        element.style.cursor = 'pointer'
                        element.style.transition = 'background-color 0.2s, border-color 0.2s'
                        element.style.paddingBottom = '2px'
                        element.addEventListener('click', handleClick)
                    }
                }

                // Store cleanup
                ; (highlightSpan as any)._commentCleanup = () => {
                    const parent = highlightSpan.parentNode
                    if (parent) {
                        while (highlightSpan.firstChild) {
                            parent.insertBefore(highlightSpan.firstChild, highlightSpan)
                        }
                        parent.removeChild(highlightSpan)
                        parent.normalize()
                    }
                    highlightSpan.removeEventListener('click', handleClick)
                }
            } catch (e) {
                console.warn('Failed to highlight comment:', comment.id, e)
            }
        })

        return () => {
            // Cleanup all highlights
            document.querySelectorAll('.has-comment').forEach(el => {
                if ((el as any)._commentCleanup) {
                    (el as any)._commentCleanup()
                }
            })
        }
    }, [comments, onCommentClick])

    // Update highlight intensity based on hover state
    useEffect(() => {
        document.querySelectorAll('.has-comment').forEach(el => {
            const element = el as HTMLElement
            const commentId = element.getAttribute('data-comment-id')
            if (commentId === hoveredCommentId) {
                element.style.backgroundColor = 'rgba(255, 215, 0, 0.4)'
                element.style.borderBottom = '2px solid #f59e0b'
            } else if (hoveredCommentId) {
                element.style.backgroundColor = 'rgba(255, 215, 0, 0.1)'
                element.style.borderBottom = '2px solid #fde047'
            } else {
                element.style.backgroundColor = 'rgba(255, 215, 0, 0.2)'
                element.style.borderBottom = '2px solid #fbbf24'
            }
        })
    }, [hoveredCommentId])

    // Handle scroll and glow for active comment
    useEffect(() => {
        if (!activeCommentId) return

        // Find the element with the active comment ID
        const element = document.querySelector(`[data-comment-id="${activeCommentId}"]`) as HTMLElement
        if (!element) return

        // Scroll to the element
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })

        // Apply glow effect
        const originalBoxShadow = element.style.boxShadow || ''
        const originalTransition = element.style.transition || ''

        element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)'
        element.style.transition = 'box-shadow 0.3s ease-in-out'

        // Remove glow effect after 3 seconds
        const timeoutId = setTimeout(() => {
            element.style.boxShadow = originalBoxShadow
            element.style.transition = originalTransition
        }, 3000)

        // Cleanup function
        return () => {
            clearTimeout(timeoutId)
            element.style.boxShadow = originalBoxShadow
            element.style.transition = originalTransition
        }
    }, [activeCommentId])

    return null // No visual component, just side effects
}
