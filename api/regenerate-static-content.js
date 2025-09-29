const { exec } = require('child_process')
const path = require('path')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    console.log('🔄 Regenerating static content...')
    
    // Run the static content generation script
    const scriptPath = path.join(process.cwd(), 'scripts', 'generate-static-content.ts')
    
    exec(`npx tsx ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error regenerating static content:', error)
        return res.status(500).json({ 
          success: false, 
          error: error.message,
          stderr 
        })
      }
      
      console.log('✅ Static content regenerated successfully')
      console.log(stdout)
      
      res.status(200).json({ 
        success: true, 
        message: 'Static content regenerated successfully',
        output: stdout 
      })
    })
    
  } catch (error) {
    console.error('❌ Error in API handler:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}

