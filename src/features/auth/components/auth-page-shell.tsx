import Link from 'next/link';

interface AuthPageShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: {
    text: string;
    linkText: string;
    linkHref: string;
  };
}

/**
 * AuthPageShell — shared wrapper for all auth pages.
 * Provides the brand heading, subtitle, form content, and optional footer link.
 */
export function AuthPageShell({ title, subtitle, children, footer }: AuthPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight text-gray-900 transition hover:text-primary"
          >
            Nobab Lungi
          </Link>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>

        {/* Form content */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-lg font-semibold text-gray-900">{title}</h1>
          {children}
        </div>

        {/* Footer link */}
        {footer && (
          <p className="text-center text-sm text-gray-500">
            {footer.text}{' '}
            <Link
              href={footer.linkHref}
              className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
            >
              {footer.linkText}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
