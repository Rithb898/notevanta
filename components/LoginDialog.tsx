"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

interface LoginDialogProps {
  open: boolean;
}

export function LoginDialog({ open }: LoginDialogProps) {
  const { login } = useAuth();

  return (
    <Dialog open={open}>
      <DialogContent className="w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Sign in to NoteVanta
          </DialogTitle>
        </DialogHeader>
        <Button
          onClick={login}
          className="text-md flex w-full cursor-pointer items-center gap-2"
        >
          <Image
            src="/googleIcon.svg"
            alt="google icon"
            width={20}
            height={20}
          />
          <span>Continue with Google</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
