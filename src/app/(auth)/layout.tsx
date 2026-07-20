/**
 * Auth Layout — minimal, centered, no navbar or footer.
 * Used by: /login, /register, /forgot-password
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
