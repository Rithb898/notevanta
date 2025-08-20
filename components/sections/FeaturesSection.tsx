"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Bot,
  FileText,
  Globe,
  MessageSquare,
  Shield,
  Sparkles,
  Upload,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

const features = [
  {
    icon: Upload,
    title: "Document Upload",
    description:
      "Upload PDF, text, and CSV files seamlessly. Our intelligent processing extracts and indexes content for optimal chat interactions.",
    color: "text-accent",
  },
  {
    icon: Globe,
    title: "Website Integration",
    description:
      "Crawl single pages or entire websites to extract content. Chat with any web-based information as if it were your own document.",
    color: "text-accent",
  },
  {
    icon: Bot,
    title: "Multi-AI Support",
    description:
      "Choose between OpenAI and Gemini models for your conversations. Each AI brings unique strengths to document analysis and chat.",
    color: "text-accent",
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description:
      "Have natural, intelligent conversations about your documents. Ask questions, get summaries, and explore content interactively.",
    color: "text-accent",
  },
  {
    icon: FileText,
    title: "Document Management",
    description:
      "View, organize, and delete your uploaded sources with ease. Keep track of all your documents in one centralized dashboard.",
    color: "text-accent",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description:
      "Firebase-powered authentication ensures your documents and conversations remain private and secure with enterprise-grade protection.",
    color: "text-accent",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-muted/30 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-primary/10 text-primary mb-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium">
            <Sparkles className="mr-2 h-4 w-4" />
            Powerful Features
          </div>
          <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
            Everything You Need for Document Conversations
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover how NoteVanta transforms static documents into interactive
            conversations with advanced AI models and seamless content
            integration.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-card border-border h-full transition-shadow duration-300 hover:shadow-lg">
                <CardHeader>
                  <div
                    className={`bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg`}
                  >
                    <feature.icon className="text-primary h-6 w-6" />
                  </div>
                  <CardTitle className="text-card-foreground text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <Button
                    variant="ghost"
                    className="text-primary hover:text-primary/80 mt-4 h-auto cursor-pointer p-1"
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <Link href="/chat">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 cursor-pointer"
            >
              Explore All Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </Link>
      </div>
    </section>
  );
};

export default FeaturesSection;
