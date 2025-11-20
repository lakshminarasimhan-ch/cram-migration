'use client'

import { useState } from 'react'
import { Comment } from '@/hooks/useComments'
import { useComments } from '@/hooks/useComments'
import { useUserManager } from '@/hooks/useUserManager'

interface CommentItemProps {
  comment: Comment
  isEditing: boolean
  onStartEdit: () => void
  onStopEdit: () => void
}

export default function CommentItem({ comment, isEditing, onStartEdit, onStopEdit }: CommentItemProps) {
  const { updateComment, deleteComment } = useComments(window.location.href)
  const { user } = useUserManager()
  const [editText, setEditText] = useState(comment.comment_text)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')

  const isOwnComment = user?.name === comment.users.name

  const handleEdit = async () => {
    if (editText.trim() && editText !== comment.comment_text) {
      const success = await updateComment(comment.id, editText.trim())
      if (success) {
        onStopEdit()
      }
    } else {
      onStopEdit()
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(comment.id)
    }
  }

  const handleReply = async () => {
    if (replyText.trim()) {
      // Add reply as child comment
      // This would need to be implemented in the useComments hook
      setReplyText('')
      setShowReplyForm(false)
    }
  }

  const scrollToComment = () => {
    const element = document.querySelector(`[data-xpath="${comment.xpath_selector}"]`) as HTMLElement
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      element.style.outline = '2px solid #007bff'
      setTimeout(() => {
        element.style.outline = ''
      }, 2000)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      return diffMins <= 1 ? 'just now' : `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className={`comment ${comment.parent_id ? 'comment-reply' : 'comment-root'}`}>
      <div className="comment-header">
        <strong className="comment-author">{comment.users.name}</strong>
        <span className="comment-date">{formatDate(comment.created_at)}</span>
        {isOwnComment && (
          <div className="comment-actions">
            <button
              className="comment-edit"
              onClick={onStartEdit}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="comment-delete"
              onClick={handleDelete}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="comment-content">
        {isEditing ? (
          <div>
            <textarea
              className="comment-edit-textarea"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              autoFocus
            />
            <div className="comment-edit-actions">
              <button className="comment-save-btn" onClick={handleEdit}>
                Save
              </button>
              <button className="comment-cancel-btn" onClick={onStopEdit}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.comment_text}</p>
        )}
      </div>

      <div className="comment-meta">
        <button className="inline-comment-link" onClick={scrollToComment}>
          📍 View in page
        </button>
        <button
          className="comment-reply-btn"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          💬 Reply
        </button>
      </div>

      {showReplyForm && (
        <div className="comment-reply-form">
          <textarea
            placeholder="Write a reply..."
            rows={2}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="comment-reply-actions">
            <button className="comment-reply-submit" onClick={handleReply}>
              Reply
            </button>
            <button
              className="comment-reply-cancel"
              onClick={() => setShowReplyForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isEditing={false}
              onStartEdit={() => {}}
              onStopEdit={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}
