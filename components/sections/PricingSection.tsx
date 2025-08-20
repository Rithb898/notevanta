"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import ComingSoonDialog from "./ComingSoonDialog";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with AI document chat",
    features: [
      "10 messages per day",
      "Upload PDF, text & CSV files",
      "Website crawling & integration",
      "Document management",
      "Dark/Light theme",
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Premium",
    price: "$5",
    period: "per month",
    description: "Unlimited conversations for power users",
    features: [
      "100 messages per day",
      "Upload PDF, text & CSV files",
      "Website crawling & integration",
      "Priority support",
      "Advanced document management",
    ],
    buttonText: "Upgrade to Premium",
    buttonVariant: "default" as const,
    popular: true,
  },
];

const PricingSection = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8" id="pricing">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Choose the perfect plan for your AI document chat needs
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full ${plan.popular ? "border-primary shadow-lg" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                    <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="pb-8 text-center">
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">
                      /{plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="text-primary h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    className="w-full cursor-pointer"
                    variant={plan.buttonVariant}
                    size="lg"
                    onClick={() => {
                      if (plan.name === "Free") {
                        window.location.href = "/chat";
                      } else {
                        setShowComingSoon(true);
                      }
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <ComingSoonDialog
        open={showComingSoon}
        onOpenChange={setShowComingSoon}
      />
    </section>
  );
};

export default PricingSection;
