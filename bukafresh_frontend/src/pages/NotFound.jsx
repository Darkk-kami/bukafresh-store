import { Button } from "@ui/buttons";
import { Card, CardContent } from "@ui/cards";
import { Home, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-lg border rounded-2xl">
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <motion.h1
                className="text-8xl font-bold text-primary mb-2"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                404
              </motion.h1>
              <p className="text-muted-foreground text-lg">
                Oops, this page doesn’t exist or has been moved.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={() => (window.location.href = "/")}
                className="flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search Site
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground mt-6">
          Need help?{" "}
          <a href="#" className="text-primary hover:underline">
            Contact Support
          </a>
        </p>
      </motion.div>
    </div>
  );
}
