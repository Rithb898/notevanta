"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const CTASection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          email: email,
          subject: "New NoteVanta Signup",
          message: `New user signup request from: ${email}`,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setEmail("");
        }, 3000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };
  return (
    <section
      className="from-accent/5 via-background to-muted/20 bg-gradient-to-br py-20"
      id="contact"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main CTA Content */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-foreground mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Join Our Community of{" "}
              <span className="text-primary">Intelligent</span> Note-Takers!
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl leading-relaxed">
              Start your journey towards more efficient research today. Get
              early access to NoteVanta and transform how you work with
              information.
            </p>
          </motion.div>

          {/* Email Signup Form */}
          <motion.div
            className="mx-auto mb-12 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {!isSubmitted ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-10 text-base"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 cursor-pointer px-6"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            ) : (
              <motion.div
                className="bg-primary/10 text-primary border-primary/20 flex items-center justify-center rounded-lg border p-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                <span className="font-medium">
                  Thank you! We&apos;ll be in touch soon.
                </span>
              </motion.div>
            )}
            <p className="text-muted-foreground mt-3 text-sm">
              No spam, unsubscribe at any time. Free 14-day trial included.
            </p>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            className="mx-auto mb-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-center sm:justify-start">
              <CheckCircle className="text-primary mr-2 h-5 w-5 flex-shrink-0" />
              <span className="text-muted-foreground">14-day free trial</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <CheckCircle className="text-primary mr-2 h-5 w-5 flex-shrink-0" />
              <span className="text-muted-foreground">
                No credit card required
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <CheckCircle className="text-primary mr-2 h-5 w-5 flex-shrink-0" />
              <span className="text-muted-foreground">Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
