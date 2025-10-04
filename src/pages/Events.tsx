import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";

const Events = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    fetchEvents();
    fetchRegistrations();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    setEvents(data || []);
  };

  const fetchRegistrations = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data } = await supabase
      .from("event_registrations")
      .select("event_id")
      .eq("user_id", session.user.id);
    
    setRegistrations(new Set(data?.map(r => r.event_id) || []));
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for events.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("event_registrations")
      .insert({ user_id: user.id, event_id: eventId });

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Successfully registered!",
        description: "You're all set for this event.",
      });
      setRegistrations(new Set([...registrations, eventId]));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4  bg-clip-text text-slate-300">
            Upcoming Events
          </h1>
          <p className="text-xl text-muted-foreground">
            Join our community events and expand your knowledge
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isRegistered = registrations.has(event.id);
            const eventDate = new Date(event.event_date);
            const isUpcoming = eventDate > new Date();

            return (
              <Card key={event.id} className="gradient-card border-border/50 hover:shadow-glow transition-smooth overflow-hidden group">
                {event.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                      {event.status}
                    </Badge>
                    {event.category && (
                      <Badge variant="outline">{event.category}</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {format(eventDate, "PPP 'at' p")}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  )}
                  {event.max_participants && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      Max {event.max_participants} participants
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {isRegistered ? (
                    <Button disabled className="w-full" variant="outline">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Registered
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleRegister(event.id)} 
                      className="w-full gradient-hero"
                      disabled={!isUpcoming}
                    >
                      {isUpcoming ? "Register Now" : "Event Ended"}
                    </Button>
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

export default Events;
