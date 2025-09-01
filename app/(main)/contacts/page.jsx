"use client";

import React from "react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import CreateGroupModal from "./_components/create-group-modal";

const ContactsPage = () => {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] =
    React.useState(false);
  const { data, isLoading } = useConvexQuery(
  api.contacts.getAllContacts,
  undefined
);


  const router = useRouter();

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <BarLoader width={"100%"} color="#36d7b7" />
      </div>
    );
  }
const { users = [], groups = [] } = data ?? {};


  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-5xl gradient-title">Contacts</h1>
        <Button onClick={() => setIsCreateGroupModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* People Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Users className="mr-2 h-4 w-4 inline" />
            People
          </h2>

          {users.length === 0 ? (
            <Card>
              <CardContent className="text-center py-6 text-muted-foreground">
                No contacts found.
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {users.map((user) => (
                <Link key={user._id} href={`/person/${user._id}`}>
                  <Card className="hover:bg-muted-foreground/30 transition-colors cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.imageUrl}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {user.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Groups Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Users className="mr-2 h-4 w-4 inline" />
            Groups
          </h2>

          {groups.length === 0 ? (
            <Card>
              <CardContent className="text-center py-6 text-muted-foreground">
                No groups yet created.
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {groups.map((group) => (
                <Link key={group._id} href={`/groups/${group._id}`}>
                  <Card className="hover:bg-muted-foreground/30 transition-colors cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <Users className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium">{group.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {group.members?.length || 0} members
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onSuccess={(groupId) => router.push(`/groups/${groupId}`)}
      />
    </div>
  );
};

export default ContactsPage;
