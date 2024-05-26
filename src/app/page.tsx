"use client";

import Box from "@mui/material/Box";
import Header from "@/component/Header";
import Chart from "@/component/Chart";
import { SessionProvider } from "next-auth/react";

const Homepage = () => {
  return (
    <SessionProvider>
      <main style={{ background: "black" }}>
        <Box sx={{ flexGrow: 1 }} height={'100vh'}>
          <Header />
          <Chart />
        </Box>
      </main>
    </SessionProvider>
  );
}

export default Homepage;