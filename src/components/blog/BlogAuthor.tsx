import styles from './BlogAuthor.module.css'

interface BlogAuthorProps {
  author: {
    name: string
    bio: string
    avatar?: string
  }
}

export function BlogAuthor({ author }: BlogAuthorProps) {
  return (
    <div className={styles.author}>
      <div className={styles.authorHeader}>
        <h4 className={styles.authorTitle}>About the Author</h4>
      </div>
      
      <div className={styles.authorContent}>
        {author.avatar && (
          <img 
            src={author.avatar} 
            alt={author.name}
            className={styles.authorAvatar}
          />
        )}
        
        <div className={styles.authorInfo}>
          <h5 className={styles.authorName}>{author.name}</h5>
          <p className={styles.authorBio}>{author.bio}</p>
        </div>
      </div>
    </div>
  )
}
