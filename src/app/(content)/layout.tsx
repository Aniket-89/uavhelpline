import Header from "@/components/content/header";
import Footer from "@/components/content/footer";
import { LayoutWrapper } from "@/components/content/layout-wrapper";
import { QueryProvider } from "@/providers/query-provider";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <Header />
      <LayoutWrapper>

          {children}

      </LayoutWrapper>
      <Footer />
    </QueryProvider>
  );
}
