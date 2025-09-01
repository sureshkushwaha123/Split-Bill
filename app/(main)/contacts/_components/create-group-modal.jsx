<<<<<<< HEAD
"use client";

import React, { useState } from "react";
=======
import React, { use, useState } from "react";
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
<<<<<<< HEAD
=======
  DialogDescription,
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
<<<<<<< HEAD
=======
import { Badge } from "lucide-react";
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { UserPlus, X } from "lucide-react";
=======
import { UserPlus } from "lucide-react";
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
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
<<<<<<< HEAD
import { toast } from "sonner";

const groupSchema = z.object({
  name: z.string().min(2, "Group name is required").max(100),
=======
import { X } from "lucide-react";
import { query } from "@/convex/_generated/server";
import { set } from "date-fns";
import is from "zod/v4/locales/is.cjs";

const groupSchema = z.object({
  name: z.string().min(2, "group name is required").max(100),
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
  description: z.string().max(500).optional(),
});

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);

<<<<<<< HEAD
  const { data: searchResults, isLoading: isSearching } = useConvexQuery(
  api.users.searchUsers,
  searchQuery.length >= 3 ? { query: searchQuery } : undefined
);


  const createGroup = useConvexMutation(api.contacts.createGroup);

  // Add member (prevent duplicates)
  const addMember = (user) => {
    const normalizedUser = {
      ...user,
      id: user._id || user.id, // Convex returns _id
    };
    if (!selectedMembers.some((m) => m.id === normalizedUser.id)) {
      setSelectedMembers([...selectedMembers, normalizedUser]);
    }
    setCommandOpen(false);
    setSearchQuery("");
  };

  const removeMember = (userId) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== userId));
=======
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
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
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
<<<<<<< HEAD
      if (selectedMembers.length === 0) {
        toast.error("Please add at least one member");
        return;
      }

      const memberIds = selectedMembers.map((m) => m.id);

      const groupId = await createGroup.mutate({
        name: data.name,
        description: data.description,
        memberIds,
      });

      toast.success("Group created successfully!");
      handleClose();

      if (onSuccess) onSuccess(groupId);
    } catch (error) {
      toast.error("Failed to create group: " + error.message);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedMembers([]);
    setSearchQuery("");
=======
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
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
<<<<<<< HEAD
          {/* Group name */}
          <div>
            <Label htmlFor="name">Group name</Label>
=======
          <div>
            <Label htmlFor="name"> Group name</Label>
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
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

<<<<<<< HEAD
          {/* Description */}
=======
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter group description"
              className="mt-2"
              {...register("description")}
            />
          </div>

<<<<<<< HEAD
          {/* Members */}
          <div className="space-y-2">
            <Label>Members</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center px-3 py-1 rounded-full bg-secondary text-sm"
                >
=======
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
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={member.imageUrl} />
                    <AvatarFallback>
                      {member.name?.charAt(0) || "?"}
                    </AvatarFallback>
<<<<<<< HEAD
                  </Avatar>
                  <span>{member.name}</span>
                  <button
=======
                    </Avatar>
                    <span>{member.name}</span>
                    <button 
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
<<<<<<< HEAD
                </div>
              ))}

              {/* Add Members */}
=======
                </Badge>
              ))}


              {/* add users to select members */}
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
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
<<<<<<< HEAD
                        {searchQuery.length < 3 ? (
                          <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                            Type at least 3 letters to search.
=======
                        {searchQuery.length < 2 ? (
                          <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                            Type Atleast 2 letters to search.
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
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
<<<<<<< HEAD
                            key={user._id}
                            value={user._id}
=======
                            key={user.id}
                            value={user.name + user.email}
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
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
<<<<<<< HEAD
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || selectedMembers.length === 0}
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
=======

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
        
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
