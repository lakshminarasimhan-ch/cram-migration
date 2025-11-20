'use client'

import { useState } from 'react'
import { Comment } from '@/hooks/useComments'
import CommentItem from './CommentItem'

interface CommentsSidebarProps {
  comments: Comment[]
  visible: boolean
  onToggle: () => void
}

export default function CommentsSidebar({ comments, visible, onToggle }: CommentsSidebarProps) {
  const [editingComment, setEditingComment] = useState<string | null>(null)

  return (
    <div className={`comments-sidebar ${visible ? 'visible' : ''}`}>
      <div className="comments-sidebar-header">
        <h3>
          Comments <span className="comment-count">({comments.length})</span>
        </h3>
        <button className="comments-toggle" onClick={onToggle} title="Hide comments">
          ✕
        </button>
      </div>
      <div className="comments-sidebar-content">
        <div className="comments-list">
          {comments.length > 0 && comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isEditing={editingComment === comment.id}
              onStartEdit={() => setEditingComment(comment.id)}
              onStopEdit={() => setEditingComment(null)}
            />
          ))}
        </div>
        {comments.length === 0 && (
          <div className="no-comments-footer">
            <p className="no-comments">
              No comments yet.<br />
              Hover over text to add comments!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
