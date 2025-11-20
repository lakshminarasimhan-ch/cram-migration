import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Comment {
  id: string
  user_id: string
  page_url: string
  xpath_selector: string
  text_content: string
  comment_text: string
  parent_id?: string
  position_data?: any
  created_at: string
  updated_at: string
  is_deleted: boolean
  author_name?: string
  users: {
    name: string
  }
  replies?: Comment[]
}

export interface CommentPosition {
  top: number
  left: number
  width: number
  height: number
  xpath: string
  textContent: string
  timestamp: number
}

export function useComments(pageUrl: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load comments for the current page
  const loadComments = useCallback(async () => {
    try {
      setLoading(true)

      // Check if Supabase is properly configured
      if (!supabase || typeof supabase.from !== 'function') {
        setComments([])
        return
      }

      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          user_id,
          page_url,
          xpath_selector,
          text_content,
          comment_text,
          parent_id,
          position_data,
          created_at,
          updated_at,
          is_deleted,
          author_name,
          users(name)
        `)
        .eq('page_url', pageUrl)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })

      if (error) {
        // Silently fail if Supabase is not configured
        setComments([])
        return
      }

      // Organize comments into threads
      const threadedComments = organizeComments((data || []) as unknown as Comment[])
      setComments(threadedComments)
    } catch (err) {
      // Silent failure - no console errors for missing Supabase config
      setComments([])
    } finally {
      setLoading(false)
    }
  }, [pageUrl])

  // Add a new comment
  const addComment = useCallback(async (
    xpathSelector: string,
    textContent: string,
    commentText: string,
    positionData?: CommentPosition,
    parentId?: string,
    authorName?: string
  ): Promise<Comment | null> => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          page_url: pageUrl,
          xpath_selector: xpathSelector,
          text_content: textContent,
          comment_text: commentText,
          position_data: positionData,
          parent_id: parentId,
          author_name: authorName || 'Anonymous'
        })
        .select(`
          id,
          user_id,
          page_url,
          xpath_selector,
          text_content,
          comment_text,
          parent_id,
          position_data,
          created_at,
          updated_at,
          is_deleted,
          author_name
        `)
        .single()

      if (error) throw error

      // Reload comments to get the updated threaded structure
      await loadComments()
      return data as unknown as Comment
    } catch (err) {
      console.error('Error adding comment:', err)
      // Log the full error object for debugging
      if (typeof err === 'object' && err !== null) {
        console.error('Full error details:', JSON.stringify(err, null, 2))
      }
      setError(err instanceof Error ? err.message : 'Failed to add comment')
      return null
    }
  }, [pageUrl, loadComments])

  // Update a comment
  const updateComment = useCallback(async (commentId: string, newText: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({
          comment_text: newText,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)

      if (error) throw error

      await loadComments()
      return true
    } catch (err) {
      console.error('Error updating comment:', err)
      setError(err instanceof Error ? err.message : 'Failed to update comment')
      return false
    }
  }, [loadComments])

  // Delete a comment
  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_deleted: true })
        .eq('id', commentId)

      if (error) throw error

      await loadComments()
      return true
    } catch (err) {
      console.error('Error deleting comment:', err)
      if (typeof err === 'object' && err !== null) {
        console.error('Full error details:', JSON.stringify(err, null, 2))
      }
      setError(err instanceof Error ? err.message : 'Failed to delete comment')
      return false
    }
  }, [loadComments])

  // Organize comments into threaded structure
  const organizeComments = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>()
    const rootComments: Comment[] = []

    // First pass: create map and initialize replies
    flatComments.forEach(comment => {
      comment.replies = []
      commentMap.set(comment.id, comment)
    })

    // Second pass: organize into threads
    flatComments.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id)
        if (parent) {
          parent.replies!.push(comment)
        } else {
          // Orphaned reply, treat as root
          rootComments.push(comment)
        }
      } else {
        rootComments.push(comment)
      }
    })

    return rootComments
  }

  // Load comments on mount and when pageUrl changes
  useEffect(() => {
    loadComments()
  }, [loadComments])

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    reloadComments: loadComments
  }
}
