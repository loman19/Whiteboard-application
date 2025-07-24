'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Session = {
  id: string
  name: string
  createdAt: string
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [roomId, setRoomId] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Fetch sessions created by the logged-in user
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/sessions/my-sessions', {
          credentials: 'include',
        })
        const data = await res.json()
        setSessions(data.sessions)
      } catch (err) {
        console.error('Failed to fetch sessions', err)
      }
    }

    fetchSessions()
  }, [])

  const createNewSession = async () => {
    try {
      const res = await fetch('/api/sessions/create', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      router.push(`/whiteboard/${data.roomId}`)
    } catch (err) {
      console.error('Failed to create session', err)
    }
  }

  const joinSession = () => {
    if (roomId.trim()) {
      router.push(`/whiteboard/${roomId.trim()}`)
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    router.push('/login')
  }

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Whiteboard Sessions</h1>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        <Button onClick={createNewSession}>+ New Whiteboard</Button>
        <Input
          placeholder="Enter Room ID to Join"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Button onClick={joinSession}>Join</Button>
      </div>

      <ul className="mt-6 space-y-2">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <li
              key={session.id}
              className="border rounded-xl px-4 py-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
              onClick={() => router.push(`/whiteboard/${session.id}`)}
            >
              <span className="font-medium">{session.name || session.id}</span>
              <span className="text-sm text-gray-500">
                {new Date(session.createdAt).toLocaleString()}
              </span>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No sessions found.</li>
        )}
      </ul>
    </main>
  )
}
