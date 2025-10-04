import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Trophy, Award, Zap, Users } from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
              Welcome to <span className=" bg-clip-text text-slate-400">NEW ERA</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in">
              Your platform for events, assignments, and achievement. Join our community of learners and achievers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/auth">
                <Button size="lg" className="gradient-hero shadow-glow text-lg px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Explore Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          Everything You Need to <span className=" bg-clip-text text-slate-400">Excel</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="gradient-card border-border/50 hover:shadow-glow transition-smooth group">
            <CardHeader>
              <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Live Events</CardTitle>
              <CardDescription>
                Join interactive workshops, webinars, and certification programs led by industry experts.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="gradient-card border-border/50 hover:shadow-glow transition-smooth group">
            <CardHeader>
              <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>
                Complete practical assignments to apply your knowledge and earn points toward certification.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="gradient-card border-border/50 hover:shadow-glow transition-smooth group">
            <CardHeader>
              <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>
                Compete with peers, track your progress, and climb the ranks to become a top achiever.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="gradient-card border-primary/50 shadow-glow overflow-hidden">
            <div className="absolute inset-0 gradient-accent opacity-30"></div>
            <CardContent className="pt-12 pb-12 relative">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-4">
                    Earn While You <span className=" bg-clip-text text-slate-400">Learn</span>
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Complete assignments, attend events, and unlock achievements to level up your profile. Build your streak and compete for the top spot!
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-primary" />
                      <span>Unlock exclusive badges and achievements</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <span>Maintain daily streaks for bonus points</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <span>Join a community of motivated learners</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-background/50 rounded-lg backdrop-blur">
                    <div className="text-4xl mb-2">🎯</div>
                    <p className="text-2xl font-bold text-primary">1000+</p>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </div>
                  <div className="text-center p-6 bg-background/50 rounded-lg backdrop-blur">
                    <div className="text-4xl mb-2">🏆</div>
                    <p className="text-2xl font-bold text-primary">50+</p>
                    <p className="text-sm text-muted-foreground">Events</p>
                  </div>
                  <div className="text-center p-6 bg-background/50 rounded-lg backdrop-blur">
                    <div className="text-4xl mb-2">📝</div>
                    <p className="text-2xl font-bold text-primary">100+</p>
                    <p className="text-sm text-muted-foreground">Assignments</p>
                  </div>
                  <div className="text-center p-6 bg-background/50 rounded-lg backdrop-blur">
                    <div className="text-4xl mb-2">⭐</div>
                    <p className="text-2xl font-bold text-primary">30+</p>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Start Your <span className=" bg-clip-text text-slate-400">Journey</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of learners achieving their certification goals with NEW ERA.
          </p>
          <Link to="/auth">
            <Button size="lg" className="gradient-hero shadow-glow text-lg px-12">
              Join Now - It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 NEW ERA. Empowering learners worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
