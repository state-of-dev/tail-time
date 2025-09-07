import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function DatabaseSetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const addBusinessHoursColumn = async () => {
    setIsLoading(true)
    setError(null)
    setResults([])

    try {
      // Add business_hours column if it doesn't exist
      const { error: alterError } = await supabase.rpc('exec_sql', {
        query: `
          ALTER TABLE business_profiles 
          ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]';
        `
      })

      if (alterError) {
        // Try alternative approach using direct SQL
        const { error: directError } = await supabase
          .from('business_profiles')
          .select('business_hours')
          .limit(1)
        
        if (directError && directError.message.includes('column "business_hours" does not exist')) {
          setResults(prev => [...prev, '❌ Column business_hours does not exist'])
          setResults(prev => [...prev, '⚠️  You need to run the migration manually in your Supabase dashboard'])
          setResults(prev => [...prev, '📋 Copy and paste this SQL in the SQL Editor:'])
          setResults(prev => [...prev, `
ALTER TABLE business_profiles 
ADD COLUMN business_hours JSONB DEFAULT '{}',
ADD COLUMN services JSONB DEFAULT '[]';

UPDATE business_profiles 
SET business_hours = '{
  "monday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
  "tuesday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
  "wednesday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
  "thursday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
  "friday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
  "saturday": {"isOpen": true, "openTime": "09:00", "closeTime": "14:00"},
  "sunday": {"isOpen": false, "openTime": "09:00", "closeTime": "17:00"}
}'
WHERE business_hours = '{}' OR business_hours IS NULL;
          `])
          return
        } else {
          setResults(prev => [...prev, '✅ Column business_hours already exists'])
        }
      } else {
        setResults(prev => [...prev, '✅ Columns added successfully'])
      }

      // Test the columns
      const { data, error: testError } = await supabase
        .from('business_profiles')
        .select('business_hours, services')
        .limit(1)

      if (testError) {
        setError(testError.message)
        return
      }

      setResults(prev => [...prev, '✅ Schema validation successful'])
      setResults(prev => [...prev, `📊 Sample data: ${JSON.stringify(data?.[0] || 'No records found')}`])

    } catch (error: any) {
      setError(error.message)
      setResults(prev => [...prev, `❌ Error: ${error.message}`])
    } finally {
      setIsLoading(false)
    }
  }

  const testSchema = async () => {
    setIsLoading(true)
    setError(null)
    setResults([])

    try {
      // Test all required tables and columns
      const tests = [
        { table: 'user_profiles', columns: ['id', 'full_name', 'role'] },
        { table: 'business_profiles', columns: ['id', 'business_name', 'slug', 'business_hours', 'services'] }
      ]

      for (const test of tests) {
        try {
          const { data, error } = await supabase
            .from(test.table)
            .select(test.columns.join(', '))
            .limit(1)

          if (error) {
            setResults(prev => [...prev, `❌ ${test.table}: ${error.message}`])
          } else {
            setResults(prev => [...prev, `✅ ${test.table}: OK`])
          }
        } catch (err: any) {
          setResults(prev => [...prev, `❌ ${test.table}: ${err.message}`])
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6" />
              Database Setup & Migration
            </CardTitle>
            <CardDescription>
              Setup required database columns and test schema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Button 
                onClick={addBusinessHoursColumn} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Add Missing Columns
              </Button>
              
              <Button 
                variant="outline"
                onClick={testSchema} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Database className="w-4 h-4" />
                )}
                Test Schema
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="font-medium text-destructive">Error</span>
                </div>
                <p className="text-sm text-destructive mt-1">{error}</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Results:</h3>
                <div className="bg-muted p-4 rounded-md font-mono text-sm space-y-1">
                  {results.map((result, index) => (
                    <div key={index}>{result}</div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}