'use client'

import { useState } from 'react'
import { Comment } from '@/hooks/useComments'
import CommentForm from './CommentForm'

interface CommentThreadProps {
    comment: Comment
    onReply: (parentId: string, text: string, authorName?: string) => void
    onEdit: (commentId: string, newText: string) => void
    onDelete: (commentId: string) => void
    onHover: (commentId: string | null) => void
    onClick?: (commentId: string) => void
    isActive: boolean
    level?: number
}

export default function CommentThread({
    comment,
    onReply,
    onEdit,
    onDelete,
    onHover,
    onClick,
    isActive,
    level = 0
}: CommentThreadProps) {
    const [isReplying, setIsReplying] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [editText, setEditText] = useState(comment.comment_text)

    const handleReply = (text: string, authorName?: string) => {
        onReply(comment.id, text, authorName)
        setIsReplying(false)
    }

    const handleEdit = (text: string) => {
        onEdit(comment.id, text)
        setIsEditing(false)
    }

    const handleDeleteClick = () => {
        setIsDeleting(true)
    }

    const confirmDelete = () => {
        onDelete(comment.id)
        setIsDeleting(false)
    }

    const cancelDelete = () => {
        setIsDeleting(false)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
        return date.toLocaleDateString()
    }

    return (
        <div
            className={`comment-thread ${isActive ? 'active' : ''}`}
            style={{ marginLeft: `${level * 16}px` }}
            onMouseEnter={() => onHover(comment.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick?.(comment.id)}
        >
            <div className="comment-content">
                <div className="comment-header">
                    <span className="comment-author">
                        {comment.author_name || comment.users?.name || 'Anonymous'}
                    </span>
                    <span className="comment-time">{formatDate(comment.created_at)}</span>
                </div>

                {comment.text_content && !comment.parent_id && (
                    <div className="comment-context">
                        <div className="context-bar"></div>
                        <p>{comment.text_content}</p>
                    </div>
                )}

                {isEditing ? (
                    <CommentForm
                        onSubmit={handleEdit}
                        onCancel={() => setIsEditing(false)}
                        placeholder="Edit comment..."
                        submitLabel="Save"
                        initialText={editText}
                    />
                ) : (
                    <>
                        <p className="comment-text">{comment.comment_text}</p>
                        <div className="comment-actions">
                            {isDeleting ? (
                                <div className="delete-confirmation">
                                    <span>Delete?</span>
                                    <button onClick={confirmDelete} className="confirm-btn">Yes</button>
                                    <button onClick={cancelDelete} className="cancel-btn">No</button>
                                </div>
                            ) : (
                                <>
                                    <button onClick={() => setIsReplying(!isReplying)} className="action-btn">
                                        Reply
                                    </button>
                                    <button onClick={() => setIsEditing(true)} className="action-btn">
                                        Edit
                                    </button>
                                    <button onClick={handleDeleteClick} className="action-btn delete">
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>

            {isReplying && (
                <div className="reply-form">
                    <CommentForm
                        onSubmit={handleReply}
                        onCancel={() => setIsReplying(false)}
                        placeholder="Write a reply..."
                        submitLabel="Reply"
                    />
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="replies">
                    {comment.replies.map((reply) => (
                        <CommentThread
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onHover={onHover}
                            isActive={isActive}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}

            <style jsx>{`
        .comment-thread {
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
          transition: background-color 0.2s;
        }
        
        .comment-thread.active {
          background-color: #eff6ff;
          margin-left: -12px;
          margin-right: -12px;
          padding-left: calc(12px + ${level * 16}px);
          padding-right: 12px;
          border-radius: 6px;
        }
        
        .comment-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .comment-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .comment-author {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }
        
        .comment-time {
          font-size: 12px;
          color: #94a3b8;
        }

        .comment-context {
          margin: 4px 0 8px 0;
          padding: 4px 8px;
          background: #f8fafc;
          border-radius: 4px;
          display: flex;
          gap: 8px;
        }

        .context-bar {
          width: 2px;
          background: #cbd5e1;
          border-radius: 1px;
          flex-shrink: 0;
        }

        .comment-context p {
          margin: 0;
          font-size: 12px;
          color: #64748b;
          font-style: italic;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .comment-text {
          font-size: 14px;
          color: #334155;
          margin: 0;
          line-height: 1.5;
          white-space: pre-wrap;
        }
        
        .comment-actions {
          display: flex;
          gap: 12px;
          margin-top: 4px;
        }
        
        .action-btn {
          background: none;
          border: none;
          color: #64748b;
          font-size: 12px;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }
        
        .action-btn:hover {
          color: #3b82f6;
        }
        
        .action-btn.delete:hover {
          color: #ef4444;
        }
        
        .reply-form {
          margin-top: 12px;
          padding-left: 16px;
          border-left: 2px solid #e2e8f0;
        }
        
        .delete-confirmation {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          animation: fadeIn 0.2s;
        }

        .confirm-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 2px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
        }

        .confirm-btn:hover {
          background: #dc2626;
        }

        .cancel-btn {
          background: #e2e8f0;
          color: #64748b;
          border: none;
          padding: 2px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
        }

        .cancel-btn:hover {
          background: #cbd5e1;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .replies {
          margin-top: 8px;
        }
      `}</style>
        </div>
    )
}
