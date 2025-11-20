'use client'

import { useState, useRef, KeyboardEvent, useEffect } from 'react'

interface CommentFormProps {
  onSubmit: (text: string, authorName?: string) => void
  onCancel?: () => void
  placeholder?: string
  submitLabel?: string
  autoFocus?: boolean
  initialText?: string
}

const AUTHOR_NAME_KEY = 'comment_author_name'

export default function CommentForm({
  onSubmit,
  onCancel,
  placeholder = 'Add a comment...',
  submitLabel = 'Comment',
  autoFocus = true,
  initialText = ''
}: CommentFormProps) {
  const [text, setText] = useState(initialText)
  const [authorName, setAuthorName] = useState('')
  const [mounted, setMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load saved author name from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedName = localStorage.getItem(AUTHOR_NAME_KEY)
    if (savedName && savedName !== 'Anonymous') {
      setAuthorName(savedName)
    }
  }, [])

  const handleSubmit = () => {
    if (!text.trim()) return

    // Save author name to localStorage if provided
    if (authorName && authorName.trim() && authorName !== 'Anonymous') {
      localStorage.setItem(AUTHOR_NAME_KEY, authorName.trim())
    }

    onSubmit(text, authorName || undefined)
    setText('')
    // Don't clear authorName - keep it for next comment
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape' && onCancel) {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <div className="comment-form-container">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="comment-textarea"
        autoFocus={autoFocus}
        rows={3}
      />
      <input
        type="text"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="Your name (optional)"
        className="comment-author-input"
      />
      <div className="comment-form-actions">
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="comment-submit-btn"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="comment-cancel-btn">
            Cancel
          </button>
        )}
      </div>
      <style jsx>{`
        .comment-form-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .comment-textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          min-height: 60px;
          transition: border-color 0.2s;
        }
        
        .comment-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .comment-author-input {
          width: 100%;
          padding: 6px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
          transition: border-color 0.2s;
        }
        
        .comment-author-input:focus {
          outline: none;
          border-color: #3b82f6;
        }
        
        .comment-form-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        
        .comment-submit-btn {
          padding: 6px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .comment-submit-btn:hover:not(:disabled) {
          background: #2563eb;
        }
        
        .comment-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .comment-cancel-btn {
          padding: 6px 16px;
          background: transparent;
          color: #64748b;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .comment-cancel-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
      `}</style>
    </div>
  )
}
