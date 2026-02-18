import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">

        {/* Drone Icon */}
        <div className="relative">
          <div className="text-9xl mb-8 opacity-20">🚁</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-headline font-bold text-secondary">404</div>
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-secondary leading-tight">
            Flight Path Not Found
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Our navigation systems couldn&apos;t locate the page you&apos;re looking for.
            The drone seems to have drifted off course.
          </p>
        </div>

        {/* Navigation Options */}
        <Card className="bg-accent/20 border-accent/30 p-8 max-w-2xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold text-secondary">
              Re-establish Connection
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/">
                <Button
                  className="w-full"
                  size="lg"
                >
                  🏠 Return to Base
                </Button>
              </Link>

              <Link href="/stories">
                <Button
                  variant="secondary"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  📰 Browse Stories
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/about"
                className="text-sm hover:text-primary transition-colors font-sans"
              >
                About Us
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/stories"
                className="text-sm hover:text-primary transition-colors font-sans"
              >
                Latest UAV News
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/contact"
                className="text-sm hover:text-primary transition-colors font-sans"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </Card>

        {/* Flight Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground font-sans">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>System Status: All UAV services operational</span>
          </div>

          <div className="text-xs text-muted-foreground font-sans">
            Error Code: HTTP 404 | Flight ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
        </div>

        {/* Background Pattern */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl opacity-5 rotate-12">🚁</div>
          <div className="absolute top-40 right-20 text-4xl opacity-5 -rotate-12">✈️</div>
          <div className="absolute bottom-32 left-20 text-5xl opacity-5 rotate-45">🛩️</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-5 -rotate-45">🚁</div>
          <div className="absolute top-1/2 left-1/3 text-7xl opacity-5 rotate-12">🛸</div>
        </div>
      </div>
    </main>
  );
}