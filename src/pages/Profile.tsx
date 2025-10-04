import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Flame, Calendar, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    fetchProfile(session.user.id);
    fetchUserData(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
  };

  const fetchUserData = async (userId: string) => {
    const { data: achievementsData } = await supabase
      .from("user_achievements")
      .select("*, achievements(*)")
      .eq("user_id", userId);
    setAchievements(achievementsData || []);

    const { data: submissionsData } = await supabase
      .from("assignment_submissions")
      .select("*, assignments(*)")
      .eq("user_id", userId);
    setSubmissions(submissionsData || []);

    const { data: registrationsData } = await supabase
      .from("event_registrations")
      .select("*, events(*)")
      .eq("user_id", userId);
    setRegistrations(registrationsData || []);
  };

  if (!profile) return null;

  const completedAssignments = submissions.filter(s => s.status === "approved").length;
  const totalAssignments = submissions.length;
  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {/* Profile Header */}
        <Card className="gradient-card border-border/50 mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="w-32 h-32 border-4 border-primary shadow-glow">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-4xl">{profile.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{profile.full_name}</h1>
                {profile.bio && <p className="text-muted-foreground mb-4">{profile.bio}</p>}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Badge className="gradient-hero text-lg px-4 py-2">
                    <Trophy className="w-4 h-4 mr-2" />
                    {profile.points} Points
                  </Badge>
                  {profile.streak_days > 0 && (
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      <Flame className="w-4 h-4 mr-2" />
                      {profile.streak_days} Day Streak
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Progress Overview */}
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Assignment Completion</span>
                  <span className="font-bold">{completedAssignments}/{totalAssignments}</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">{registrations.length}</p>
                  <p className="text-sm text-muted-foreground">Events Registered</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">{achievements.length}</p>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No achievements yet. Keep participating to earn badges!
                  </p>
                ) : (
                  achievements.slice(0, 5).map((userAchievement) => (
                    <div
                      key={userAchievement.id}
                      className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userAchievement.achievements.badge_color || 'bg-primary'}`}>
                        <span className="text-2xl">{userAchievement.achievements.icon || "🏆"}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{userAchievement.achievements.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {userAchievement.achievements.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...submissions.slice(0, 3), ...registrations.slice(0, 3)].length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No recent activity. Start participating in events and assignments!
                </p>
              ) : (
                <>
                  {submissions.slice(0, 3).map((submission) => (
                    <div key={submission.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">Submitted: {submission.assignments.title}</p>
                        <p className="text-sm text-muted-foreground">Status: {submission.status}</p>
                      </div>
                    </div>
                  ))}
                  {registrations.slice(0, 3).map((registration) => (
                    <div key={registration.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">Registered: {registration.events.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(registration.registered_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
