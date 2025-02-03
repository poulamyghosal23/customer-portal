import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full py-4 mt-auto border-t border-gray-200">
      <div className="container flex justify-center items-center text-sm text-gray-500">
        <Link
          href="https://drop-desk.com/termsandconditions"
          target="_blank"
          rel="dofollow noopener noreferrer"
          className="hover:text-gray-700"
        >
          Terms of Service
        </Link>
        <span className="mx-2">|</span>
        <Link
          href="https://drop-desk.com/privacypolicy"
          target="_blank"
          rel="dofollow noopener noreferrer"
          className="hover:text-gray-700"
        >
          Privacy Policy
        </Link>
        <span className="mx-2">|</span>
        <Link
          href="https://drop-desk.com/cookie-policy"
          target="_blank"
          rel="dofollow noopener noreferrer"
          className="hover:text-gray-700"
        >
          Cookie Policy
        </Link>
      </div>
    </footer>
  )
}

