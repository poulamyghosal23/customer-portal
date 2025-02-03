import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

// Remove this if not used elsewhere
// interface BreadcrumbProps {
//   items: BreadcrumbItem[]
// }

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return null
}

