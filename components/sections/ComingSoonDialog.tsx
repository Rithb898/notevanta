import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Clock } from 'lucide-react'
import { Button } from '../ui/button'

interface ComingSoonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ComingSoonDialog = ({ open, onOpenChange }: ComingSoonDialogProps) => {
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-semibold">Coming Soon!</DialogTitle>
          <DialogDescription className="text-base">
            Premium subscriptions will be available soon. Stay tuned for updates!
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ComingSoonDialog