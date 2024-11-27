import Link from "next/link"

const Unauthorized = () => {
  return (
    <div>
      <h2>Unauthorized</h2>
      <p>
        go to <Link href="/projects">my projects</Link>
      </p>
    </div>
  )
}

export default Unauthorized
