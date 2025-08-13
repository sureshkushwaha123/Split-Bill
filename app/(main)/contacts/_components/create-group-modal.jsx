import React, { use, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { X } from "lucide-react";
import { query } from "@/convex/_generated/server";
import { set } from "date-fns";
import is from "zod/v4/locales/is.cjs";

const groupSchema = z.object({
  name: z.string().min(2, "group name is required").max(100),
  description: z.string().max(500).optional(),
});

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const { data: searchResults, isLoading: isSearching } = useConvexQuery(
    api.users.searchUsers,
    { query: searchQuery }
  );

  const createGroup = useConvexMutation(api.contacts.createGroup);

  const addMember = (user) => {
    if (!selectedMembers.some((m) => m.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    setCommandOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    try {
        const members = selectedMembers.map((member) => member.id);

        const groupId = await createGroup.mutate({
            name: data.name,
            description: data.description,
            members: members,
        });

        toast.success("Group created successfully!");
        handleClose();

        if (onSuccess) onSuccess(groupId);
    } catch (error) {
        toast.error("Failed to create group: " + error.message);
    }
  };

  const removeMember = (userId) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== userId));
  };

  const handleClose = () => {
    //reset form
    reset();
    setSelectedMembers([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name"> Group name</Label>
            <Input
              id="name"
              placeholder="Enter group name"
              className="mt-2"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter group description"
              className="mt-2"
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label>Members</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {currentUser && (
                <Badge variant="secondary" className="px-3 py-1 cursor-pointer">
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={currentUser.imageUrl} />
                    <AvatarFallback>
                      {currentUser.name?.charAt(0) || "?"}
                    </AvatarFallback>
                    <span>{currentUser.name}(you)</span>
                  </Avatar>
                </Badge>
              )}

              {/* selected members */}

              {selectedMembers.map((member) => (
                <Badge key={member.id} variant="secondary" className="px-3 py-1 cursor-pointer">
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={member.imageUrl} />
                    <AvatarFallback>
                      {member.name?.charAt(0) || "?"}
                    </AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                    <button 
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Badge>
              ))}


              {/* add users to select members */}
              <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 gap-1 text-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Members
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start" side="bottom">
                  <Command>
                    <CommandInput
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {searchQuery.length < 2 ? (
                          <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                            Type Atleast 2 letters to search.
                          </p>
                        ) : isSearching ? (
                          <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                            Searching...
                          </p>
                        ) : (
                          <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                            No results found.
                          </p>
                        )}
                      </CommandEmpty>
                      <CommandGroup heading="Users">
                        {searchResults?.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.name + user.email}
                            onSelect={() => addMember(user)}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={user.imageUrl} />
                                <AvatarFallback>
                                  {user.name?.charAt(0) || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="text-sm">{user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {selectedMembers.length === 0 && (
              <p className="text-sm text-amber-600">
                Add at least one member to the group.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || selectedMembers.length === 0}>
                {isSubmitting ? "Creating..." : "Create Group"}
            </Button>
        </DialogFooter>
        </form>
        
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
