import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import NewcomersCTA from "@/components/NewcomersCTA";
import AgentCTA from "@/components/AgentCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <NewcomersCTA />
      <AgentCTA />
      <Footer />
    </>
  );
}
