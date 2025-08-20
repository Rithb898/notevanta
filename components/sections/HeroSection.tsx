"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Globe, MessageSquare, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <section className="from-background via-muted/30 to-accent/5 hero-gradient relative flex min-h-screen items-center justify-center bg-gradient-to-br">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/abstract-digital-hero.png')] opacity-5"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Hero Badge */}
          <motion.div
            className="bg-primary/10 text-primary mb-8 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            AI-Powered Document Chat
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-foreground mb-6 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Chat with Your Documents Using{" "}
            <span className="text-primary">AI Intelligence</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Upload PDFs, documents, and websites, then have intelligent
            conversations about their content. Choose from multiple AI models
            for the perfect chat experience.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/chat">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg cursor-pointer"
              >
                Start Chatting Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Feature Icons */}
          <motion.div
            className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-lg">
                <Upload className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-foreground mb-1 font-semibold">
                Upload Documents
              </h3>
              <p className="text-muted-foreground text-sm">
                PDF, text, and CSV file support
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-lg">
                <MessageSquare className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-foreground mb-1 font-semibold">
                AI Conversations
              </h3>
              <p className="text-muted-foreground text-sm">
                Chat with OpenAI and Gemini models
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-lg">
                <Globe className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-foreground mb-1 font-semibold">
                Website Integration
              </h3>
              <p className="text-muted-foreground text-sm">
                Single page or full site crawling
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
