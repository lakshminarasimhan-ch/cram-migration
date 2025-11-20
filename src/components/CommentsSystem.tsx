'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useComments, type Comment, type CommentPosition } from '@/hooks/useComments'
import CommentSelectionHandler from './CommentSelectionHandler'
import CommentsSidebarPanel from './CommentsSidebarPanel'
import CommentHighlights from './CommentHighlights'

export default function CommentsSystem() {
  const pathname = usePathname()
  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const { comments, loading, addComment, updateComment, deleteComment } = useComments(pageUrl)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNewCommentForm, setShowNewCommentForm] = useState(false)
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null)
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null)
  const [pendingSelection, setPendingSelection] = useState<{
    range: Range
    rect: DOMRect
    selectedText: string
  } | null>(null)

  // Handle text selection
  const handleSelection = (range: Range, rect: DOMRect) => {
    const selectedText = range.toString()
    setPendingSelection({ range, rect, selectedText })
    setShowNewCommentForm(true)
    setSidebarOpen(true)
  }

  // Handle adding a new comment
  const handleAddComment = async (text: string, authorName?: string) => {
    if (!pendingSelection) return

    const range = pendingSelection.range
    const container = range.commonAncestorContainer
    const element = container.nodeType === Node.ELEMENT_NODE
      ? (container as Element)
      : container.parentElement

    if (!element) return

    // Generate XPath
    const generateXPath = (elm: Element): string => {
      if (elm.id) return `//*[@id="${elm.id}"]`
      if (elm === document.body) return '/html/body'

      let ix = 0
      const siblings = elm.parentNode ? elm.parentNode.childNodes : []
      for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i]
        if (sibling === elm) {
          return generateXPath(elm.parentNode as Element) + '/' + elm.tagName.toLowerCase() + '[' + (ix + 1) + ']'
        }
        if (sibling.nodeType === 1 && (sibling as Element).tagName === elm.tagName) {
          ix++
        }
      }
      return ''
    }

    const xpath = generateXPath(element)
    const textContent = pendingSelection.selectedText

    await addComment(
      xpath,
      textContent,
      text,
      {
        top: 0, left: 0, width: 0, height: 0,
        xpath,
        textContent,
        timestamp: Date.now()
      },
      undefined, // parentId
      authorName
    )

    setPendingSelection(null)
    setShowNewCommentForm(false)
  }

  // Handle replying to a comment
  const handleReply = async (parentId: string, text: string, authorName?: string) => {
    // Find the parent comment to get its xpath
    const findComment = (comments: Comment[], id: string): Comment | null => {
      for (const comment of comments) {
        if (comment.id === id) return comment
        if (comment.replies) {
          const found = findComment(comment.replies, id)
          if (found) return found
        }
      }
      return null
    }

    const parentComment = findComment(comments, parentId)
    if (!parentComment) return

    await addComment(
      parentComment.xpath_selector,
      parentComment.text_content,
      text,
      parentComment.position_data,
      parentId,
      authorName
    )
  }

  // Handle editing a comment
  const handleEdit = async (commentId: string, newText: string) => {
    await updateComment(commentId, newText)
  }

  // Handle deleting a comment
  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId)
  }

  // Handle hovering over a comment
  const handleHoverComment = (commentId: string | null) => {
    setHoveredCommentId(commentId)
  }

  // Handle clicking a comment highlight
  const handleCommentClick = (comment: Comment, rect: DOMRect) => {
    setActiveCommentId(comment.id)
    setSidebarOpen(true)
    setShowNewCommentForm(false)
  }

  // Handle clicking a comment in the sidebar
  const handleSidebarCommentClick = (commentId: string) => {
    setActiveCommentId(commentId)
    setShowNewCommentForm(false) // Hide the new comment form when navigating to existing comments
  }

  return (
    <>
      <CommentSelectionHandler onSelect={handleSelection} />

      <CommentHighlights
        comments={comments}
        onCommentClick={handleCommentClick}
        hoveredCommentId={hoveredCommentId}
        pendingSelection={pendingSelection?.range}
        activeCommentId={activeCommentId}
      />

      <CommentsSidebarPanel
        comments={comments}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAddComment={handleAddComment}
        onReply={handleReply}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onHoverComment={handleHoverComment}
        onCommentClick={handleSidebarCommentClick}
        activeCommentId={activeCommentId}
        showNewCommentForm={showNewCommentForm}
        selectedText={pendingSelection?.range.toString()}
      />
    </>
  )
}
