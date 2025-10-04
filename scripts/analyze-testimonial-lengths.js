#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function analyzeTestimonialLengths() {
  try {
    // Read the content file
    const contentPath = path.join(__dirname, '..', 'src', 'content', 'en.json')
    const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'))
    
    if (!contentData.testimonials || !Array.isArray(contentData.testimonials)) {
      console.error('❌ No testimonials found in content data')
      return
    }

    console.log(`📊 Analyzing ${contentData.testimonials.length} testimonials...\n`)

    // Extract text lengths
    const textLengths = contentData.testimonials
      .map(testimonial => ({
        id: testimonial.id,
        author: testimonial.author?.name || 'Unknown',
        text: testimonial.text || '',
        length: (testimonial.text || '').length,
        featured: testimonial.featured || false
      }))
      .sort((a, b) => a.length - b.length)

    // Calculate statistics
    const lengths = textLengths.map(t => t.length)
    const totalLength = lengths.reduce((sum, len) => sum + len, 0)
    const averageLength = Math.round(totalLength / lengths.length)
    const medianLength = lengths.length % 2 === 0 
      ? Math.round((lengths[Math.floor(lengths.length / 2) - 1] + lengths[Math.floor(lengths.length / 2)]) / 2)
      : lengths[Math.floor(lengths.length / 2)]
    const minLength = Math.min(...lengths)
    const maxLength = Math.max(...lengths)

    // Calculate quartiles
    const q1Index = Math.floor(lengths.length * 0.25)
    const q3Index = Math.floor(lengths.length * 0.75)
    const q1Length = lengths[q1Index]
    const q3Length = lengths[q3Index]

    console.log('📈 STATISTICS:')
    console.log(`   Total testimonials: ${lengths.length}`)
    console.log(`   Average length: ${averageLength} characters`)
    console.log(`   Median length: ${medianLength} characters`)
    console.log(`   Min length: ${minLength} characters`)
    console.log(`   Max length: ${maxLength} characters`)
    console.log(`   Q1 (25th percentile): ${q1Length} characters`)
    console.log(`   Q3 (75th percentile): ${q3Length} characters`)
    console.log(`   Range: ${maxLength - minLength} characters\n`)

    // Show length distribution
    const lengthRanges = [
      { min: 0, max: 100, label: 'Very Short (0-100)' },
      { min: 101, max: 200, label: 'Short (101-200)' },
      { min: 201, max: 300, label: 'Medium (201-300)' },
      { min: 301, max: 500, label: 'Long (301-500)' },
      { min: 501, max: 1000, label: 'Very Long (501-1000)' },
      { min: 1001, max: Infinity, label: 'Extremely Long (1000+)' }
    ]

    console.log('📊 LENGTH DISTRIBUTION:')
    lengthRanges.forEach(range => {
      const count = lengths.filter(len => len >= range.min && len <= range.max).length
      const percentage = Math.round((count / lengths.length) * 100)
      const bar = '█'.repeat(Math.round(percentage / 2))
      console.log(`   ${range.label.padEnd(25)} ${count.toString().padStart(3)} (${percentage.toString().padStart(3)}%) ${bar}`)
    })

    // Show shortest and longest testimonials
    console.log('\n📝 SHORTEST TESTIMONIALS:')
    textLengths.slice(0, 3).forEach((testimonial, index) => {
      console.log(`   ${index + 1}. ${testimonial.author} (${testimonial.length} chars)${testimonial.featured ? ' ⭐' : ''}`)
      console.log(`      "${testimonial.text.substring(0, 100)}${testimonial.text.length > 100 ? '...' : ''}"`)
      console.log('')
    })

    console.log('📝 LONGEST TESTIMONIALS:')
    textLengths.slice(-3).reverse().forEach((testimonial, index) => {
      console.log(`   ${index + 1}. ${testimonial.author} (${testimonial.length} chars)${testimonial.featured ? ' ⭐' : ''}`)
      console.log(`      "${testimonial.text.substring(0, 100)}${testimonial.text.length > 100 ? '...' : ''}"`)
      console.log('')
    })

    // Recommendations
    console.log('💡 RECOMMENDATIONS:')
    console.log(`   • Use ${medianLength} characters as base truncation length`)
    console.log(`   • Show full text up to ${q3Length} characters (75th percentile)`)
    console.log(`   • Truncate longer testimonials with "..." and "Read more"`)
    console.log(`   • Consider modal or expandable view for testimonials over ${q3Length} chars`)

    // Featured testimonials analysis
    const featuredTestimonials = textLengths.filter(t => t.featured)
    if (featuredTestimonials.length > 0) {
      const featuredLengths = featuredTestimonials.map(t => t.length)
      const featuredAvg = Math.round(featuredLengths.reduce((sum, len) => sum + len, 0) / featuredLengths.length)
      const featuredMedian = featuredLengths.length % 2 === 0 
        ? Math.round((featuredLengths[Math.floor(featuredLengths.length / 2) - 1] + featuredLengths[Math.floor(featuredLengths.length / 2)]) / 2)
        : featuredLengths[Math.floor(featuredLengths.length / 2)]
      
      console.log(`\n⭐ FEATURED TESTIMONIALS (${featuredTestimonials.length}):`)
      console.log(`   Average length: ${featuredAvg} characters`)
      console.log(`   Median length: ${featuredMedian} characters`)
    }

  } catch (error) {
    console.error('❌ Error analyzing testimonials:', error)
  }
}

// Run the analysis
analyzeTestimonialLengths()
