import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FEATURES, STEPS, TESTIMONIALS } from "@/lib/landing";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="flex flex-col pt-16">
      <section className="mt-10 pb-12 space-y-10 md:space-y-16 px-5">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <Badge variant={"outline"} className="bg-green-100 text-green-700">
            Welcome to Splint, manage your expenses with ease!
          </Badge>
          <h1 className="gradient-title mx-auto max-w-4xl text-3xl font-bold md:text-5xl">
            Smartest and efficient way to split expenses among friends.
          </h1>
          <p className="mx-auto max-w-[800px] text-gray-700 md:text-xl/relaxed">
            Track your expenses, split bills, and settle up with friends
            effortlessly. Splint is designed to make managing shared expenses
            simple and transparent.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size={"lg"}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-2 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size={"lg"}
              className="border-green-600 hover:bg-green-50 text-green-600"
            >
              <Link href="#how-it-works">How it Works</Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto max-w-5xl overflow-hidden rounded-xl shadow-xl">
          <div className="gradient p-1 aspect-[16/9]">
            <Image
              src="/hero.png"
              width={1280}
              height={720}
              alt="Banner"
              className="rounded-mg mx-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* features Section */}
      <section id="features" className="bg-gray-10 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant={"outline"} className="bg-green-100 text-green-700">
            Features
          </Badge>
          <h1 className="gradient-title mt-4 text-3xl md:text-5xl">
            Everything you need to split expenses.
          </h1>
          <p className="mx-auto max-w-[800px] text-gray-700 md:text-xl/relaxed">
            This app is packed with features to make managing shared expenses a
            breeze.
          </p>
          <div className="mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
            {FEATURES.map(({ title, Icon, bg, color, description }) => (
              <Card
                key={title}
                className="flex flex-col items-center space-y-4 p-6 text-center"
              >
                <div className={`rounded-full p-3 ${bg}`}>
                  <Icon className={`h-8 w-8 ${color} mb-2`} />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-500">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="bg-gray-10 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant={"outline"} className="bg-green-100 text-green-700">
            How it Works!
          </Badge>
          <h1 className="gradient-title mt-4 text-3xl md:text-5xl">
            Everything you need to split expenses.
          </h1>
          <p className="mx-auto max-w-[800px] text-gray-700 md:text-xl/relaxed">
            This app is packed with features to make managing shared expenses a
            breeze.
          </p>

          <div className="mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl">
            {STEPS.map(({ description, label, title }) => (
              <div
                key={title}
                className="flex flex-col items-center space-y-4 rounded-lg bg-white p-6 shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
                  {label}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* testmonials section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant={"outline"} className="bg-green-100 text-green-700">
            Testimonials
          </Badge>
          <h1 className="gradient-title mt-4 text-3xl md:text-5xl">
            Listen from our users.
          </h1>

          <div className="mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
            {TESTIMONIALS.map(({ quote, role, name, image }) => (
              <Card key={name}>
                <CardContent className="space-y-4 p-6">
                  <p className="text-gray-500">{quote}</p>

                  <div className="flex items-center mt-4 space-x-4">
                    <Avatar>
                      <AvatarImage src={image} alt={name} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-sm text-muted-foreground">{role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 gradient">
        <div className="container mx-auto px-4 md:px-6 text-center space-x-6">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl text-white">
            Join our community
          </h2>
          <p className="mx-auto max-w-[600px] text-green-100 md:text-xl/relaxed">
            Start managing your expenses with Splint today!
          </p>
           <Button
              asChild
              size={"lg"}
              className="bg-green-600 hover:opacity-90 text-white"
            >
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-2 w-4" />
              </Link>
            </Button>
        </div>
      </section>
      <footer className="border-t bg-gray-200 py-12 text-center text-sm text-muted-foreground">
        <p>© 2025 Splint. All rights reserved.</p>
      </footer>
    </div>
  );
}
