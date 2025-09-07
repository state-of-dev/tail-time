import { useParams } from 'react-router-dom'

export default function BusinessTest() {
  const { businessSlug } = useParams<{ businessSlug: string }>()
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Business Test Page</h1>
        <p className="text-lg">Business Slug: {businessSlug}</p>
        <p className="text-sm text-muted-foreground mt-2">
          If you see this, routing is working!
        </p>
      </div>
    </div>
  )
}