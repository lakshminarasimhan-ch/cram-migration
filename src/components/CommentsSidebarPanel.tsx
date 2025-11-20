'use client'

import { useState, useEffect } from 'react'
import { Comment } from '@/hooks/useComments'
import CommentThread from './CommentThread'
import CommentForm from './CommentForm'

interface CommentsSidebarPanelProps {
  comments: Comment[]
  isOpen: boolean
  onToggle: () => void
  onAddComment: (text: string, authorName?: string) => void
  onReply: (parentId: string, text: string, authorName?: string) => void
  onEdit: (commentId: string, newText: string) => void
  onDelete: (commentId: string) => void
  onHoverComment: (commentId: string | null) => void
  onCommentClick: (commentId: string) => void
  activeCommentId: string | null
  showNewCommentForm: boolean
  selectedText?: string
}

export default function CommentsSidebarPanel({
  comments,
  isOpen,
  onToggle,
  onAddComment,
  onReply,
  onEdit,
  onDelete,
  onHoverComment,
  onCommentClick,
  activeCommentId,
  showNewCommentForm,
  selectedText
}: CommentsSidebarPanelProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    }
  }, [isOpen])

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="sidebar-toggle-btn"
        title={isOpen ? 'Hide comments' : 'Show comments'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="icon"
        >
          <path
            fillRule="evenodd"
            d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 001.28.53l3.58-3.579a.78.78 0 01.527-.224 41.202 41.202 0 005.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zm0 7a1 1 0 100-2 1 1 0 000 2zM8 8a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        {comments.length > 0 && (
          <span className="comment-count">{comments.length}</span>
        )}
      </button>

      {/* Sidebar Panel */}
      <div className={`sidebar-panel ${isOpen ? 'open' : ''} ${isAnimating ? 'animating' : ''}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h3>
          <button onClick={onToggle} className="close-btn" title="Close">
            ×
          </button>
        </div>

        <div className="sidebar-content">
          {showNewCommentForm && (
            <div className="new-comment-section">
              <h4 className="section-title">New Comment</h4>
              {selectedText && (
                <div className="selected-text-preview">
                  <div className="quote-bar"></div>
                  <p>{selectedText}</p>
                </div>
              )}
              <CommentForm
                onSubmit={onAddComment}
                placeholder="Add a comment on the selected text..."
                submitLabel="Comment"
              />
            </div>
          )}

          {comments.length > 0 ? (
            <div className="comments-list">
              {comments.map((comment) => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onHover={onHoverComment}
                  onClick={onCommentClick}
                  isActive={activeCommentId === comment.id}
                />
              ))}
            </div>
          ) : (
            !showNewCommentForm && (
              <div className="empty-state">
                <p>No comments yet.</p>
                <p className="hint">Select text to add a comment.</p>
              </div>
            )
          )}
        </div>
      </div>

      <style jsx>{`
        .sidebar-toggle-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }
        
        .sidebar-toggle-btn:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: scale(1.05);
        }
        
        .sidebar-toggle-btn .icon {
          width: 24px;
          height: 24px;
          color: #3b82f6;
        }
        
        .comment-count {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
        }
        
        .sidebar-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 380px;
          background: white;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
          z-index: 1002;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .sidebar-panel.open {
          transform: translateX(0);
        }
        
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .sidebar-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 28px;
          color: #94a3b8;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .close-btn:hover {
          background: #f1f5f9;
          color: #64748b;
        }
        
        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }
        
        .new-comment-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .selected-text-preview {
          margin-bottom: 12px;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 4px;
          display: flex;
          gap: 8px;
        }

        .quote-bar {
          width: 3px;
          background: #cbd5e1;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .selected-text-preview p {
          margin: 0;
          font-size: 13px;
          color: #64748b;
          font-style: italic;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #94a3b8;
        }
        
        .empty-state p {
          margin: 0 0 8px 0;
          font-size: 14px;
        }
        
        .empty-state .hint {
          font-size: 13px;
          color: #cbd5e1;
        }
      `}</style>
    </>
  )
}
