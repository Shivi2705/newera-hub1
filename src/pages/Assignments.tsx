import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Award, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";

const Assignments = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Map<string, any>>(new Map());
  const [user, setUser] = useState<any>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    fetchAssignments();
    fetchSubmissions();
  }, []);

  const fetchAssignments = async () => {
    const { data } = await supabase
      .from("assignments")
      .select("*")
      .eq("status", "active")
      .order("deadline", { ascending: true });
    setAssignments(data || []);
  };

  const fetchSubmissions = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data } = await supabase
      .from("assignment_submissions")
      .select("*")
      .eq("user_id", session.user.id);
    
    const submissionMap = new Map();
    data?.forEach(sub => submissionMap.set(sub.assignment_id, sub));
    setSubmissions(submissionMap);
  };

  const handleSubmit = async () => {
    if (!user || !selectedAssignment) return;

    const { error } = await supabase
      .from("assignment_submissions")
      .insert({
        user_id: user.id,
        assignment_id: selectedAssignment,
        submission_url: submissionUrl,
      });

    if (error) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Assignment submitted!",
        description: "Your submission has been received.",
      });
      setSubmissionUrl("");
      setSelectedAssignment(null);
      fetchSubmissions();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-success";
      case "medium": return "bg-yellow-500";
      case "hard": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (submission: any) => {
    if (!submission) return <Clock className="w-4 h-4" />;
    if (submission.status === "approved") return <CheckCircle2 className="w-4 h-4 text-success" />;
    if (submission.status === "rejected") return <AlertCircle className="w-4 h-4 text-destructive" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4  bg-clip-text text-slate-300">
            Assignments
          </h1>
          <p className="text-xl text-muted-foreground">
            Complete assignments to earn points and achievements
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => {
            const submission = submissions.get(assignment.id);
            const deadline = new Date(assignment.deadline);
            const isOverdue = deadline < new Date();

            return (
              <Card key={assignment.id} className="gradient-card border-border/50 hover:shadow-glow transition-smooth">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getDifficultyColor(assignment.difficulty)}>
                      {assignment.difficulty}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {assignment.points} pts
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  <CardDescription>{assignment.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span className={isOverdue ? "text-destructive" : "text-muted-foreground"}>
                      Due {format(deadline, "PPP")}
                    </span>
                  </div>
                  {submission && (
                    <div className="flex items-center gap-2 text-sm">
                      {getStatusIcon(submission)}
                      <span>Status: {submission.status}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {submission ? (
                    <Button disabled className="w-full" variant="outline">
                      Submitted
                    </Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => setSelectedAssignment(assignment.id)}
                          className="w-full gradient-hero"
                          disabled={isOverdue}
                        >
                          {isOverdue ? "Overdue" : "Submit"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Assignment</DialogTitle>
                          <DialogDescription>
                            Provide the URL to your submission
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="url">Submission URL</Label>
                            <Input
                              id="url"
                              placeholder="https://..."
                              value={submissionUrl}
                              onChange={(e) => setSubmissionUrl(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleSubmit} className="gradient-hero">
                            Submit
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
