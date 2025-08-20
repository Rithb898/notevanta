"use client";
import React from "react";
import Link from "next/link";
import { Brain } from "lucide-react";

const Footer = () => {
  return (
    <footer id="footer" className="bg-muted/30 border-border border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 text-center">
            <Brain className="text-primary mr-2 h-8 w-8" />
            <div className="text-primary text-2xl font-bold">
              Note<span className="text-accent-foreground/75">Vanta</span>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              Revolutionizing research with AI-powered note-taking
            </p>
          </div>

          <div className="flex space-x-6">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="#pricing"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="text-muted-foreground mt-8 text-sm">
            Made with ❤️ by{" "}
            <Link
              href=""
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Rith
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
