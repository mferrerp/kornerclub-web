import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Barrios from "@/components/Barrios";
import NewcomersCTA from "@/components/NewcomersCTA";
import AgentCTA from "@/components/AgentCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Barrios />
      <NewcomersCTA />
      <AgentCTA />
      <Footer />
    </>
  );
}
