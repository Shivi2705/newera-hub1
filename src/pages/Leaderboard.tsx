import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Award } from "lucide-react";
import Navbar from "@/components/Navbar";

const Leaderboard = () => {
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("points", { ascending: false })
      .limit(50);
    setProfiles(data || []);
  };

  const getTrophyColor = (index: number) => {
    switch (index) {
      case 0: return "text-yellow-500";
      case 1: return "text-gray-400";
      case 2: return "text-orange-600";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4  bg-clip-text text-slate-300">
            Leaderboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Top performers in the NEW ERA community
          </p>
        </div>

        {/* Top 3 Podium */}
        {profiles.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
            {/* Second Place */}
            <div className="md:order-1 order-2">
              <Card className="gradient-card border-border/50 text-center pt-8">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-20 h-20 border-4 border-gray-400">
                    <AvatarImage src={profiles[1]?.avatar_url} />
                    <AvatarFallback>{profiles[1]?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <CardContent>
                  <h3 className="font-bold text-lg mb-1">{profiles[1]?.full_name}</h3>
                  <p className="text-2xl font-bold text-primary">{profiles[1]?.points} pts</p>
                  {profiles[1]?.streak_days > 0 && (
                    <Badge variant="outline" className="mt-2">
                      <Flame className="w-3 h-3 mr-1" />
                      {profiles[1]?.streak_days} day streak
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* First Place */}
            <div className="md:order-2 order-1">
              <Card className="gradient-card border-primary shadow-glow text-center pt-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 gradient-hero"></div>
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 border-4 border-yellow-500 animate-pulse-glow">
                    <AvatarImage src={profiles[0]?.avatar_url} />
                    <AvatarFallback>{profiles[0]?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black">
                    1
                  </div>
                </div>
                <CardContent>
                  <h3 className="font-bold text-xl mb-1">{profiles[0]?.full_name}</h3>
                  <p className="text-3xl font-bold text-primary">{profiles[0]?.points} pts</p>
                  {profiles[0]?.streak_days > 0 && (
                    <Badge className="mt-2 gradient-hero">
                      <Flame className="w-3 h-3 mr-1" />
                      {profiles[0]?.streak_days} day streak
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Third Place */}
            <div className="md:order-3 order-3">
              <Card className="gradient-card border-border/50 text-center pt-8">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-20 h-20 border-4 border-orange-600">
                    <AvatarImage src={profiles[2]?.avatar_url} />
                    <AvatarFallback>{profiles[2]?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <CardContent>
                  <h3 className="font-bold text-lg mb-1">{profiles[2]?.full_name}</h3>
                  <p className="text-2xl font-bold text-primary">{profiles[2]?.points} pts</p>
                  {profiles[2]?.streak_days > 0 && (
                    <Badge variant="outline" className="mt-2">
                      <Flame className="w-3 h-3 mr-1" />
                      {profiles[2]?.streak_days} day streak
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Rest of the leaderboard */}
        <Card className="gradient-card border-border/50 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              All Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profiles.slice(3).map((profile, index) => (
              <div
                key={profile.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-smooth"
              >
                <span className="text-2xl font-bold text-muted-foreground w-8">
                  {index + 4}
                </span>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback>{profile.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">{profile.full_name}</h4>
                  {profile.bio && (
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{profile.points}</p>
                  <p className="text-sm text-muted-foreground">points</p>
                </div>
                {profile.streak_days > 0 && (
                  <Badge variant="outline">
                    <Flame className="w-3 h-3 mr-1" />
                    {profile.streak_days}
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
