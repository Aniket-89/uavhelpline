import Link from "next/link";

export default function DividerLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 max-w-7xl mx-auto h-full px-2">
      <Link href={href} className="text-base font-medium font-sans text-primary">{children}</Link>
      <div className="flex-1 h-[5px] border border-primary" />
    </div>
  );
}