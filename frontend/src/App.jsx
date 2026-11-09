import React, { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Scanner from './components/Scanner';
import ReportForm from './components/ReportForm';
import { Layers, Numbers, Platform, Steps, Compare, Security, Faq, Cta, Footer } from './components/Sections';
import { checkBackendStatus } from './services/api';

export default function App() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const ping = () => checkBackendStatus().then(setOnline);
    ping();
    const t = setInterval(ping, 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Nav online={online} />
      <main>
        <Hero />
        <Marquee />
        <Layers />
        <Numbers />
        <Platform />
        <Steps />
        <Compare />
        <Scanner online={online} />
        <ReportForm />
        <Security />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
