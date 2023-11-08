import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { Hash } from "lucide-react";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";

interface ServerSidebarProps {
  serverId: string;
}
const iconMap={
  [ChannelType.TEXT]: <Hash/>
}
export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  const textChanenels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChanenels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChanenels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );
  if (!server) {
    return redirect("/");
  }
  const role = server.members.find(
    (members) => members.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch />
        </div>

      </ScrollArea>
    </div>
  );
};
