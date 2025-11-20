'use client'

import { useState, useEffect, useRef } from 'react'
import { Comment } from '@/hooks/useComments'

interface CommentPopoverProps {
    isOpen: boolean
    position: { top: number; left: number } | null
    mode: 'create' | 'view'
    onClose: () => void
    onSubmit: (text: string) => void
    comment?: Comment // For view mode
    user?: { name: string } | null
    onLogin: (name: string) => void
}

export default function CommentPopover({
    isOpen,
    position,
    mode,
    onClose,
    onSubmit,
    comment,
    user,
    onLogin
}: CommentPopoverProps) {
    const [text, setText] = useState('')
    const [userName, setUserName] = useState('')
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const nameInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen && mode === 'create' && user) {
            setTimeout(() => inputRef.current?.focus(), 100)
        } else if (isOpen && !user) {
            setTimeout(() => nameInputRef.current?.focus(), 100)
        }
    }, [isOpen, mode, user])

    if (!isOpen || !position) return null

    const handleSubmit = () => {
        if (!text.trim()) return
        onSubmit(text)
        setText('')
    }

    const handleLogin = () => {
        if (!userName.trim()) return
        onLogin(userName)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit()
        } else if (e.key === 'Escape') {
            onClose()
        }
    }

    return (
        <div
            className="comment-popover"
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                transform: 'translateY(10px)',
                zIndex: 1000,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                border: '1px solid #e2e8f0',
                width: '320px',
                padding: '16px',
                animation: 'fadeIn 0.2s ease-out'
            }}
        >
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(0); }
          to { opacity: 1; transform: translateY(10px); }
        }
        .comment-popover::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 20px;
          width: 12px;
          height: 12px;
          background: white;
          transform: rotate(45deg);
          border-top: 1px solid #e2e8f0;
          border-left: 1px solid #e2e8f0;
        }
      `}</style>

            {!user ? (
                <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Welcome!</h3>
                    <p className="text-sm text-gray-600">Please enter your name to start commenting.</p>
                    <input
                        ref={nameInputRef}
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogin}
                            disabled={!userName.trim()}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            ) : mode === 'create' ? (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Add Comment</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                    </div>
                    <textarea
                        ref={inputRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a comment..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] text-sm"
                    />
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Cmd+Enter to submit</span>
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!text.trim()}
                                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                {comment?.users?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                                <span className="font-semibold text-sm text-gray-900">{comment?.users?.name}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                    {new Date(comment?.created_at || '').toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                    </div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{comment?.comment_text}</p>
                    {/* Future: Add Reply button here */}
                </div>
            )}
        </div>
    )
}
