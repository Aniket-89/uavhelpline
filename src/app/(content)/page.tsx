
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Users } from "lucide-react";
import { HeroSection } from "@/components/content/home/hero-section";
import BlogsSection from "@/components/content/home/blogs-section";
import MagazineLayout from "@/components/content/home/magazine-layout";

export default async function Home() {
  return (
    <div className="min-h-screen mt-12">
      {/* Latest Stories Hero Section */}
      <HeroSection />
      <BlogsSection />
      <MagazineLayout />
      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose UAV Helpline?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted companion for all things drone-related, from beginner guides to advanced techniques.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Expert Reviews</h3>
              <p className="text-gray-600 leading-relaxed">
                In-depth analysis of the latest drone technology, from consumer models to professional equipment.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Safety First</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive safety guides and regulatory information to keep you flying responsibly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">
                Stories and insights shared by real pilots and drone enthusiasts from around the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Flight?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of drone enthusiasts who trust UAV Helpline for their aviation journey.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
            <Link href="/stories">
              Start Exploring
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
