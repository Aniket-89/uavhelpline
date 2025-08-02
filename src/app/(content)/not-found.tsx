import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ContentNotFound() {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center space-y-8">
          
          {/* Drone Icon with 404 */}
          <div className="relative">
            <div className="text-8xl md:text-9xl mb-8 opacity-15">🚁</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl md:text-6xl font-headline font-bold text-secondary">404</div>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-headline font-bold text-secondary leading-tight">
              Story Not Found in Our Archives
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-sans leading-relaxed">
              The story you're searching for has flown beyond our radar. 
              Perhaps it was moved to a different flight path, or maybe it never existed in our database.
            </p>
          </div>

          {/* Quick Actions */}
          <Card className="bg-popover border-border p-6 md:p-8 max-w-2xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-headline font-bold text-secondary">
                Navigate to Safety
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans"
                    size="lg"
                  >
                    🏠 Home Base
                  </Button>
                </Link>
                
                <Link href="/stories">
                  <Button 
                    variant="outline" 
                    className="w-full border-secondary text-secondary hover:bg-secondary/10 font-sans"
                    size="lg"
                  >
                    📰 All Stories
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm font-sans">
                <Link 
                  href="/stories" 
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  Latest UAV News
                </Link>
                <Link 
                  href="/admin" 
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </Card>

          {/* Recent Stories Suggestion */}
          <div className="space-y-4 pt-8">
            <h3 className="text-lg font-headline font-medium text-secondary">
              Try These Popular Flight Paths
            </h3>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              <Link href="/stories">
                <span className="inline-block bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm font-sans hover:bg-accent/30 transition-colors">
                  #DroneDelivery
                </span>
              </Link>
              <Link href="/stories">
                <span className="inline-block bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm font-sans hover:bg-accent/30 transition-colors">
                  #MilitaryUAV
                </span>
              </Link>
              <Link href="/stories">
                <span className="inline-block bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm font-sans hover:bg-accent/30 transition-colors">
                  #CommercialDrones
                </span>
              </Link>
              <Link href="/stories">
                <span className="inline-block bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm font-sans hover:bg-accent/30 transition-colors">
                  #TechReviews
                </span>
              </Link>
            </div>
          </div>

          {/* Status Info */}
          <div className="pt-8 space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground font-sans">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>All systems operational</span>
            </div>
            <div className="text-xs text-muted-foreground font-sans">
              Mission ID: UAV-{new Date().getFullYear()}-{Math.random().toString(36).substr(2, 6).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}