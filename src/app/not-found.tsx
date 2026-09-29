import Link from "next/link";

export default function NotFound() {
  return (
    <div className="error-page">
      <p>404 · MARRO GRAPHIX</p>
      <h1>Page not found.</h1>
      <Link href="/">Back home ↗</Link>
    </div>
  );
}
