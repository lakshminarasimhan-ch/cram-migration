'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  { href: '/', label: 'Mongo Mapping', id: 'mongo-mapping-tab' },
  { href: '/docs/mongo-to-postgres-queries', label: 'PostgreSQL Queries (Mongo)', id: 'mongo-queries-tab' },
  { href: '/docs/mysql-to-postgres-schema-mapping', label: 'MySQL Schema Mapping', id: 'mysql-mapping-tab' },
  { href: '/docs/mysql-to-postgres-migration', label: 'MySQL Migration Guide', id: 'mysql-migration-tab' },
]

export default function Navigation() {
  const pathname = usePathname()

  const getActiveTabId = () => {
    if (pathname === '/') return 'mongo-mapping-tab'
    if (pathname === '/docs/mongo-to-postgres-queries') return 'mongo-queries-tab'
    if (pathname === '/docs/mysql-to-postgres-schema-mapping') return 'mysql-mapping-tab'
    if (pathname === '/docs/mysql-to-postgres-migration') return 'mysql-migration-tab'
    return ''
  }

  const activeTabId = getActiveTabId()

  return (
    <div className="nav-tabs">
      {navigationItems.map((item) => {
        const isActive = activeTabId === item.id
        return isActive ? (
          <span key={item.id} className="nav-tab active" id={item.id}>
            {item.label}
          </span>
        ) : (
          <Link key={item.id} href={item.href} className="nav-tab" id={item.id}>
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
