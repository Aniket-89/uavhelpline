import Header from "@/components/content/header";
import Footer from "@/components/content/footer";
import { LayoutWrapper } from "@/components/content/layout-wrapper";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <LayoutWrapper>

          {children}

      </LayoutWrapper>
      <Footer />
    </>
  );
}
