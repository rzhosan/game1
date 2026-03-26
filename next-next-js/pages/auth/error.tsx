import { GetServerSideProps } from 'next'

export default function ErrorPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', color: '#ff3333' }}>
      <h1>🔐 Authentication Error</h1>
      <p>There was an error during authentication.</p>
      <a href="/login">Go back to login</a>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { error } = context.query

  return {
    props: {
      error: error || 'Unknown error',
    },
  }
}
